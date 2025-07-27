'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { format, isPast } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { IAssessment, IQuestion } from '@/models/Assessment';

interface AssessmentTakingProps {
  // We will fetch the assessment based on the ID from the URL params
}

interface UserAnswer {
    questionId: string; // Storing question ID as string for easier handling
    answer: string | string[] | boolean;
}

const AssessmentTakingPage: React.FC<AssessmentTakingProps> = () => {
  const router = useRouter();
  const { state } = router as any; // Access state from router
  const params = useParams();

  console.log("Component rendered. useParams() result:", params);
  const assessmentId = params.assessmentid as string;
  console.log("assessmentId from params:", assessmentId);

  const [assessment, setAssessment] = useState<IAssessment | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(state?.passwordVerified === true);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Time left in seconds
  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');
  const [isPasswordCheckLoading, setIsPasswordCheckLoading] = useState(false); // New loading state for password check
  const [isAssessmentDetailsLoaded, setIsAssessmentDetailsLoaded] = useState(false);

  // Tab visibility state and handler
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isAssessmentStarted && !isTerminated) {
      console.warn('Tab switched! Terminating assessment.');
      // TODO: Implement backend call to terminate assessment and save progress
      setTerminationReason('Tab switched');
      setIsTerminated(true);
      // Optionally, disable inputs and show a message
      toast({
        title: "Assessment Terminated",
        description: "You switched tabs. Your assessment has been terminated.",
        variant: "destructive",
      });
      // router.push('/dashboard/assessments'); // Redirect after termination (optional)
    }
  }, [isAssessmentStarted, isTerminated]); // Include dependencies

  useEffect(() => {
    // Add event listener for tab visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]); // Re-run effect if handleVisibilityChange changes

  // Fetch assessment details
  useEffect(() => {
    console.log("useEffect triggered.", { params, assessmentId });
    const fetchAssessment = async () => {
      console.log("fetchAssessment function started.");
      // Add a check here to ensure assessmentId is a valid string
      if (!assessmentId || typeof assessmentId !== 'string') {
         console.log("assessmentId is not available or not a string. Skipping fetch.");
         setIsLoading(false);
         setIsAssessmentDetailsLoaded(true);
         return;
      }
      try {
        setIsLoading(true);
        setIsAssessmentDetailsLoaded(false);
        console.log("Fetching assessment data from:", `/api/assessments/${assessmentId}`);

        const response = await axios.get<{ success: boolean; assessment: IAssessment; isPasswordRequired?: boolean; message?: string }>(`/api/assessments/${assessmentId}`);
        console.log("API response received:", response.data);

        if (response.data.success) {
          const fetchedAssessment = response.data.assessment;
          const isPasswordRequired = response.data.isPasswordRequired ?? false;

          console.log("Assessment fetched successfully. isPasswordRequired:", isPasswordRequired);
          console.log("Fetched Assessment Data:", fetchedAssessment);

          setAssessment(fetchedAssessment);
          setUserAnswers(fetchedAssessment.questions.map(q => ({
              questionId: q._id.toString(),
              answer: q.type === 'msq' ? [] : '',
          })));

          if (!isPasswordRequired) {
              setIsPasswordVerified(true);
              setIsAssessmentStarted(true);
               // TODO: Make a backend call to /api/assessments/start here if needed for tracking
               console.log("No password required. isPasswordVerified and isAssessmentStarted set to true.");
          } else {
               console.log("Password required. isPasswordVerified remains false.");
          }

        } else {
          console.error("API response indicates failure:", response.data.message);
          setError(response.data.message || 'Failed to fetch assessment.\n');
          toast({
            title: 'Error',
            description: response.data.message || 'Failed to fetch assessment.',
            variant: 'destructive',
          });
        }
      } catch (err: any) {
        console.error('Error fetching assessment:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching the assessment.\n');
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'An error occurred while fetching the assessment.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsAssessmentDetailsLoaded(true);
        console.log("fetchAssessment finished. isLoading:", false, "isAssessmentDetailsLoaded:", true);
        console.log("Current assessment state after fetch:", assessment);
        console.log("Current isPasswordVerified state after fetch:", isPasswordVerified);
      }
    };

    fetchAssessment();

  }, [assessmentId]); // Depend on assessmentId state

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isAssessmentStarted && assessment && !isTerminated) {
            const endTime = new Date(assessment.endTime).getTime();

            timer = setInterval(() => {
                const now = new Date().getTime();
                const difference = Math.max(0, endTime - now);
                setTimeLeft(Math.floor(difference / 1000));

                if (difference === 0) {
                    clearInterval(timer as NodeJS.Timeout);
                    console.log('Time is up! Submitting assessment.');
                    // TODO: Automatically submit assessment when time is up
                    // handleSubmitAssessment(); // Implement this function
                    setIsTerminated(true); // Consider it terminated by time
                    setTerminationReason('Time ran out');
                     toast({
                        title: "Time's Up!",
                        description: "Your assessment time has ended. Your answers have been submitted.",
                        variant: "default", // Or info
                     });
                }
            }, 1000); // Update every second
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isAssessmentStarted, assessment, isTerminated]); // Dependencies

    const formatTime = (seconds: number | null) => {
        if (seconds === null) return '--:--';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

  const handlePasswordSubmit = async () => {
    if (!assessmentId) return;

    setIsPasswordCheckLoading(true); // Start loading

    try {
        // Call the new backend API to verify the password
        const response = await axios.post('/api/assessments/verify-password', {
            assessmentId: assessmentId,
            password: passwordInput,
        });

        if (response.data.success) {
            setIsPasswordVerified(true);
            setIsAssessmentStarted(true); // Start assessment only after successful password verify
            // TODO: Make a backend call to /api/assessments/start here if needed for tracking
             toast({
                title: 'Password Verified',
                description: 'You can now start the assessment.',
                variant: 'default',
             });
        } else {
            toast({
                title: 'Incorrect Password',
                description: response.data.message || 'The password you entered is incorrect.',
                variant: 'destructive',
            });
            setIsPasswordVerified(false); // Ensure this is false on failure
        }
    } catch (error: any) {
        console.error('Password verification error:', error);
        toast({
            title: 'Error',
            description: error.response?.data?.message || 'An error occurred during password verification.',
            variant: 'destructive',
        });
        setIsPasswordVerified(false); // Ensure this is false on error
    } finally {
        setIsPasswordCheckLoading(false); // Stop loading
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[] | boolean) => {
      setUserAnswers(prevAnswers => {
          const existingAnswerIndex = prevAnswers.findIndex(ans => ans.questionId === questionId);
          if (existingAnswerIndex > -1) {
              const newAnswers = [...prevAnswers];
              newAnswers[existingAnswerIndex].answer = answer;
              return newAnswers;
          } else {
              return [...prevAnswers, { questionId, answer }];
          }
      });
  };

  // Function to render different question types
  const renderQuestion = (question: IQuestion, qIndex: number) => {
    const userAnswer = userAnswers.find(ans => ans.questionId === question._id.toString());

    // Find the user's current answer for this question
    const currentAnswer = userAnswers.find(ans => ans.questionId === question._id.toString())?.answer;

    const isAnswered = currentAnswer !== undefined && currentAnswer !== null &&
                       !(Array.isArray(currentAnswer) && currentAnswer.length === 0);

    return (
      <Card key={question._id} className="mb-4">
        <CardHeader>
          <CardTitle>{`Question ${qIndex + 1}: ${question.text}`}</CardTitle>
        </CardHeader>
        <CardContent>
          {question.type === 'mcq' && question.options && (
            <RadioGroup
              value={currentAnswer as string || ''} // Use currentAnswer for RadioGroup value
              onValueChange={(value: string) => handleAnswerChange(question._id.toString(), value)}
              disabled={isTerminated}
            >
              {question.options.map((option: string, oIndex: number) => (
                <div key={oIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${qIndex}-option${oIndex}`} />
                  <Label htmlFor={`q${qIndex}-option${oIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'msq' && question.options && (
              <div className="space-y-2">
                {question.options.map((option: string, oIndex: number) => {
                    const msqAnswer = Array.isArray(currentAnswer) ? currentAnswer : [];
                    const isChecked = msqAnswer.includes(option);
                    return (
                        <div key={oIndex} className="flex items-center space-x-2">
                            <Checkbox
                                id={`q${qIndex}-option${oIndex}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                    const newAnswer = checked
                                        ? [...msqAnswer, option]
                                        : msqAnswer.filter(item => item !== option);
                                    handleAnswerChange(question._id.toString(), newAnswer);
                                }}
                                disabled={isTerminated}
                            />
                            <Label htmlFor={`q${qIndex}-option${oIndex}`}>{option}</Label>
                        </div>
                    );
                })}
              </div>
          )}

          {question.type === 'true_false' && (
              <RadioGroup
               value={String(currentAnswer) || ''} // Convert boolean to string for RadioGroup
               onValueChange={(value: string) => handleAnswerChange(question._id.toString(), value === 'true')}
               disabled={isTerminated}
              >
               <div className="flex items-center space-x-2">
                 <RadioGroupItem value="true" id={`q${qIndex}-true`} />
                 <Label htmlFor={`q${qIndex}-true`}>True</Label>
               </div>
               <div className="flex items-center space-x-2">
                 <RadioGroupItem value="false" id={`q${qIndex}-false`} />
                 <Label htmlFor={`q${qIndex}-false`}>False</Label>
               </div>
              </RadioGroup>
          )}

           {question.type === 'coding' && (
               <Textarea
                   placeholder="Write your code here..."
                   value={currentAnswer as string || ''}
                   onChange={(e) => handleAnswerChange(question._id.toString(), e.target.value)}
                   className="font-mono"
                   disabled={isTerminated}
               />
           )}
        </CardContent>
      </Card>
    );
  };

  const handleSubmitAssessment = async () => {
      if (!assessment || userAnswers.length !== assessment.questions.length) {
          // Basic check if all questions are attempted (optional, depending on requirements)
          toast({
              title: 'Submission Error',
              description: 'Please attempt all questions before submitting.',
              variant: 'destructive',
          });
          return;
      }

      setIsLoading(true);

      try {
          // TODO: Send userAnswers to a backend API for scoring and saving
          console.log('Submitting answers:', userAnswers);

          // Example: Send answers to a /api/submissions route
          const response = await axios.post(`/api/submissions`, {
              assessmentId: assessment._id,
              answers: userAnswers,
          }, {
              withCredentials: true,
              headers: {
                'X-Debug-Header': 'test'
              }
          });

          if (response.data.success) {
              toast({
                  title: 'Assessment Submitted',
                  description: 'Your answers have been submitted successfully.',
                  variant: 'default',
              });
              setIsTerminated(true); // Mark as terminated after submission
              setTerminationReason('Submitted');
              // Redirect or show a thank you message
               router.push('/dashboard/assessments'); // Redirect after submission
          } else {
              toast({
                  title: 'Submission Failed',
                  description: response.data.message || 'An error occurred during submission.',
                  variant: 'destructive',
              });
          }
      } catch (error: any) {
          console.error('Assessment submission error:', error);
           toast({
              title: 'Submission Failed',
              description: error.response?.data?.message || 'An error occurred while submitting the assessment.',
              variant: 'destructive',
          });
      } finally {
          setIsLoading(false);
      }
  };

  if (isLoading && !isAssessmentDetailsLoaded) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading assessment...</p>
      </div>
    );
  }

  if (!isLoading && error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!isLoading && !error && isAssessmentDetailsLoaded && !assessment) {
       return (
         <div className="container mx-auto py-8 text-center">
           <p>No assessment data available.</p>
         </div>
       );
  }

  if (assessment!.password && !isPasswordVerified) {
      return (
           <div className="container mx-auto py-8 max-w-md">
               <Card>
                   <CardHeader>
                       <CardTitle>Enter Password to Start</CardTitle>
                       <CardDescription>This assessment requires a password.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                       <Input
                           type="password"
                           placeholder="Enter password"
                           value={passwordInput}
                           onChange={(e) => setPasswordInput(e.target.value)}
                           onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handlePasswordSubmit();
                            }
                          }}
                       />
                       <Button onClick={handlePasswordSubmit}>Start Assessment</Button>
                   </CardContent>
               </Card>
           </div>
      );
  }

    if (isTerminated) {
         return (
             <div className="container mx-auto py-8 text-center text-red-500">
                 <Card>
                     <CardHeader>
                        <CardTitle>Assessment Terminated</CardTitle>
                        <CardDescription>Reason: {terminationReason}</CardDescription>
                     </CardHeader>
                     <CardContent>
                         <Button onClick={() => router.push('/dashboard/assessments')}>Back to Assessments</Button>
                     </CardContent>
                 </Card>
             </div>
         );
    }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{assessment!.title}</CardTitle>
          <CardDescription>
              Time Left: {formatTime(timeLeft)}
               {isPast(new Date(assessment!.endTime)) && " - Time has ended!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessment!.questions.map((question: IQuestion, qIndex: number) => renderQuestion(question, qIndex))}

          <Button
            onClick={handleSubmitAssessment}
            className="w-full mt-6"
            disabled={isLoading || isTerminated}
          >
            Submit Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentTakingPage; 