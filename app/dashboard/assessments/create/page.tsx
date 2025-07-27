'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { signOut } from 'next-auth/react';

interface Question {
  type: 'mcq' | 'msq' | 'true_false' | 'coding';
  text: string;
  options: string[];
  correctAnswer: string | string[] | boolean;
  codeTemplate?: string;
}

const CreateAssessmentPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timer, setTimer] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { type: 'mcq', text: '', options: ['', ''], correctAnswer: '' }]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;

    // Reset options and correct answer if type changes
    if (field === 'type') {
      if (value === 'mcq' || value === 'msq') {
        if (!newQuestions[index].options || newQuestions[index].options.length < 2) {
             newQuestions[index].options = ['', ''];
        }
        newQuestions[index].correctAnswer = value === 'mcq' ? '' : [''];
        newQuestions[index].codeTemplate = undefined;
      } else if (value === 'true_false') {
        newQuestions[index].options = [];
        newQuestions[index].correctAnswer = false;
        newQuestions[index].codeTemplate = undefined;
      } else if (value === 'coding') {
        newQuestions[index].options = [];
        newQuestions[index].correctAnswer = ''; // Or a default coding answer structure
        newQuestions[index].codeTemplate = '';
      }
    }

    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options[oIndex] = value;
      setQuestions(newQuestions);
    }
  };

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options.push('');
      setQuestions(newQuestions);
    }
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
      // Adjust correct answer if the removed option was selected
      if (newQuestions[qIndex].type === 'mcq') {
         if (newQuestions[qIndex].correctAnswer === questions[qIndex].options[oIndex]) {
             newQuestions[qIndex].correctAnswer = '';
         }
      } else if (newQuestions[qIndex].type === 'msq') {
         if (Array.isArray(newQuestions[qIndex].correctAnswer)) {
             newQuestions[qIndex].correctAnswer = newQuestions[qIndex].correctAnswer.filter(ans => ans !== questions[qIndex].options[oIndex]);
         }
      }
      setQuestions(newQuestions);
    }
  };

  const handleCorrectAnswerChange = (qIndex: number, value: any) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const handleCreateAssessment = async () => {
    // Basic form validation
    if (!title || !startTime || !endTime || questions.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and add at least one question.',
        variant: 'destructive',
      });
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
         toast({
             title: 'Validation Error',
             description: 'End time must be after start time.',
             variant: 'destructive',
         });
         return;
    }

    // More detailed validation for questions could be added here

    setIsLoading(true);
    try {
      const response = await axios.post('/api/assessments/create', {
        title,
        password: password || undefined, // Send password only if set
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        timer: parseInt(timer, 10), // Add the timer value
        questions,
      });

      if (response.data.success) {
        toast({
          title: 'Assessment Created',
          description: response.data.message,
        });
        router.push('/dashboard/assessments'); // Redirect to assessments list page
      } else {
        toast({
          title: 'Creation Failed',
          description: response.data.message || 'An error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error creating assessment:', error);
      toast({
        title: 'Creation Failed',
        description: error.response?.data?.message || 'An error occurred while creating the assessment.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Assessment Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password (Optional)</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="startTime">Start Date & Time</Label>
              <Input id="startTime" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="endTime">End Date & Time</Label>
              <Input id="endTime" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="timer">Duration (minutes)</Label>
              <Input id="timer" type="number" value={timer} onChange={(e) => setTimer(e.target.value)} min="1" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Questions</h3>
            {questions.map((question, qIndex) => (
              <Card key={qIndex} className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Question {qIndex + 1}</h4>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveQuestion(qIndex)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
                <div>
                  <Label htmlFor={`qText-${qIndex}`}>Question Text</Label>
                  <Textarea id={`qText-${qIndex}`} value={question.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor={`qType-${qIndex}`}>Question Type</Label>
                  <Select onValueChange={(value) => handleQuestionChange(qIndex, 'type', value)} value={question.type}>
                    <SelectTrigger id={`qType-${qIndex}`} className="w-[180px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice (Single Answer)</SelectItem>
                      <SelectItem value="msq">Multiple Select (Multiple Answers)</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(question.type === 'mcq' || question.type === 'msq') && (
                  <div className="space-y-2">
                    <h5 className="font-medium">Options</h5>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                        <Button variant="outline" size="icon" onClick={() => handleRemoveOption(qIndex, oIndex)} disabled={question.options.length <= 2}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleAddOption(qIndex)}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Option
                    </Button>
                  </div>
                )}

                {question.type === 'true_false' && (
                    <div>
                        <Label>Correct Answer</Label>
                        <Select onValueChange={(value) => handleCorrectAnswerChange(qIndex, value === 'true')} value={String(question.correctAnswer)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {question.type === 'mcq' && question.options.length > 0 && (
                    <div>
                        <Label>Correct Answer</Label>
                         <Select onValueChange={(value) => handleCorrectAnswerChange(qIndex, value)} value={question.correctAnswer as string}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select correct option" />
                            </SelectTrigger>
                            <SelectContent>
                                {question.options.filter(option => option !== '').map((option, oIndex) => (
                                    // Use the option text as the value
                                    <SelectItem key={oIndex} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                 {question.type === 'msq' && question.options.length > 0 && (
                     <div>
                         <Label>Correct Answers (Select all that apply)</Label>
                          {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center space-x-2">
                                  // Using a simple checkbox for now. A more sophisticated component might be needed
                                  <input
                                      type="checkbox"
                                      id={`msq-${qIndex}-${oIndex}`}
                                      checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option)}
                                      onChange={(e) => {
                                          const newCorrectAnswers = Array.isArray(question.correctAnswer) ? [...question.correctAnswer] : [];
                                          if (e.target.checked) {
                                              newCorrectAnswers.push(option);
                                          } else {
                                              const index = newCorrectAnswers.indexOf(option);
                                              if (index > -1) {
                                                  newCorrectAnswers.splice(index, 1);
                                              }
                                          }
                                          handleCorrectAnswerChange(qIndex, newCorrectAnswers);
                                      }}
                                  />
                                  <Label htmlFor={`msq-${qIndex}-${oIndex}`}>{option}</Label>
                              </div>
                          ))}
                     </div>
                 )}

                 {question.type === 'coding' && (
                     <div>
                          <Label htmlFor={`codeTemplate-${qIndex}`}>Code Template (Optional)</Label>
                          <Textarea
                              id={`codeTemplate-${qIndex}`}
                              value={question.codeTemplate || ''}
                              onChange={(e) => handleQuestionChange(qIndex, 'codeTemplate', e.target.value)}
                              placeholder="Provide a starting code template for the user..."
                          />
                           <div>
                              <Label htmlFor={`correctAnswer-coding-${qIndex}`}>Correct Answer (Expected Output or Test Cases)</Label>
                              // This is a simplified input. A real coding question would need a more robust way to define and evaluate correctness.
                              <Textarea
                                  id={`correctAnswer-coding-${qIndex}`}
                                  value={question.correctAnswer as string}
                                  onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                                  placeholder="Define the expected output or test cases for the coding question..."
                                  required
                              />
                          </div>
                     </div>
                 )}

              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={handleAddQuestion}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Question
            </Button>
          </div>

          <Button className="w-full" onClick={handleCreateAssessment} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Assessment'}
          </Button>

          <Button onClick={() => signOut()}>Logout</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAssessmentPage; 