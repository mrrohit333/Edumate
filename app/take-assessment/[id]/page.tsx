'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Question {
  _id: string;
  type: 'MCQ' | 'MSQ' | 'TRUE_FALSE' | 'CODING';
  question: string;
  options: { text: string; isCorrect: boolean }[];
  correctAnswer?: string;
  codeTemplate?: string;
  points: number;
}

interface Assessment {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  startTime: string;
  endTime: string;
  timer?: number;
}

export default function TakeAssessment({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const warningShown = useRef(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent tab switching
  // useBeforeUnload((e: BeforeUnloadEvent) => {
  //   if (!warningShown.current) {
  //     e.preventDefault();
  //     e.returnValue = '';
  //     warningShown.current = true;
  //     toast.error('Tab switching is not allowed during the assessment');
  //   }
  // });

  useEffect(() => {
    fetchAssessment();

    const handleVisibilityChange = async () => {
      if (document.hidden && submissionId) {
        console.log(`Tab switched! Attempting to terminate submission ${submissionId}`);
        try {
          const response = await fetch(`/api/submissions/${submissionId}`, {
            method: 'PUT',
          });
          if (response.ok) {
            console.log('Submission terminated due to tab switch.');
            // Optionally, redirect the user or show a message
            // router.push('/terminated'); // Example redirection
          } else {
            console.error('Failed to terminate submission on tab switch.', response.status);
          }
        } catch (error) {
          console.error('Error terminating submission on tab switch:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [submissionId]); // Add submissionId as a dependency

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch assessment');
      const data = await response.json();
      setAssessment(data);

      console.log('Fetched assessment data:', data);
      console.log('Timer value from fetched data:', data.timer);

      // Calculate time left based on timer duration
      const durationInMilliseconds = (data.timer || 0) * 60 * 1000;
      setTimeLeft(durationInMilliseconds);

      console.log('Calculated timeLeft:', durationInMilliseconds);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } catch (error) {
      toast.error('Failed to load assessment');
      router.push('/assessments');
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !submissionId) return; // Prevent multiple submissions and ensure submissionId exists
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer
          })),
          status: 'SUBMITTED',
        })
      });

      if (!response.ok) throw new Error('Failed to submit assessment');

      toast.success('Assessment submitted successfully');
      router.push('/assessments');
    } catch (error) {
      toast.error('Failed to submit assessment');
      setIsSubmitting(false);
    }
  };

  const startAssessment = async () => {
    setIsLoading(true); // Assuming you have an isLoading state for the start button
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: params.id,
          // Include userId here if available on the frontend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create submission');
      }

      const data = await response.json();
      setSubmissionId(data.submissionId); // Assuming backend returns { submissionId: '...' }
      setIsAssessmentStarted(true);

      // Start the timer here as well, or ensure fetchAssessment handles it based on submissionId
      // fetchAssessment(); // You might want to refetch assessment data or just start timer

    } catch (error: any) {
      toast.error(`Error starting assessment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!assessment) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Conditional rendering: Show start button or assessment content
  if (!isAssessmentStarted) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{assessment.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{assessment.description}</p>
            {/* Assuming there's a password input here if needed */}
            <Button onClick={startAssessment} disabled={isLoading}>Start Assessment</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{assessment.title}</h1>
          <p className="text-gray-600">{assessment.description}</p>
        </div>
        <div className="text-2xl font-mono bg-gray-100 px-4 py-2 rounded">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-8">
        {assessment.questions.map((question, index) => (
          <Card key={question._id}>
            <CardHeader>
              <CardTitle>
                Question {index + 1} ({question.points} points)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">{question.question}</p>

              {question.type === 'MCQ' && (
                <RadioGroup
                  value={answers[question._id]}
                  onValueChange={(value) => handleAnswerChange(question._id, value)}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.text} id={`${question._id}-${optionIndex}`} />
                      <label htmlFor={`${question._id}-${optionIndex}`}>{option.text}</label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === 'MSQ' && (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question._id}-${optionIndex}`}
                        checked={answers[question._id]?.includes(option.text)}
                        onCheckedChange={(checked) => {
                          const currentAnswers = answers[question._id] || [];
                          handleAnswerChange(
                            question._id,
                            checked
                              ? [...currentAnswers, option.text]
                              : currentAnswers.filter((a: string) => a !== option.text)
                          );
                        }}
                      />
                      <label htmlFor={`${question._id}-${optionIndex}`}>{option.text}</label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'TRUE_FALSE' && (
                <RadioGroup
                  value={answers[question._id]}
                  onValueChange={(value) => handleAnswerChange(question._id, value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`${question._id}-true`} />
                    <label htmlFor={`${question._id}-true`}>True</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${question._id}-false`} />
                    <label htmlFor={`${question._id}-false`}>False</label>
                  </div>
                </RadioGroup>
              )}

              {question.type === 'CODING' && (
                <div className="space-y-4">
                  {question.codeTemplate && (
                    <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                      <pre>{question.codeTemplate}</pre>
                    </div>
                  )}
                  <Textarea
                    value={answers[question._id] || ''}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    placeholder="Write your code here..."
                    className="font-mono min-h-[200px]"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
        </Button>
      </div>
    </div>
  );
} 