'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Shield, Clock, Calendar, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Assessment {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  // password and questions are not included in the list view API
}

// Assuming a more detailed interface for a single assessment fetch
interface FullAssessmentDetails extends Assessment {
  password?: string; // Password might be included for password-protected assessments
  // other detailed fields like questions could be here
}

const AssessmentsListPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data and status
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // State for modal visibility
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null); // State for selected assessment ID
  const [passwordInput, setPasswordInput] = useState(''); // State for password input
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false); // State for password verification loading

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/assessments');
      if (response.data.success) {
        setAssessments(response.data.assessments);
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to fetch assessments.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching assessments:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred while fetching assessments.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeAssessment = async (id: string) => {
    console.log('Session status:', status); // Log the session status
    setIsLoading(true);
    try {
      const response = await axios.get<{
        success: boolean;
        assessment: FullAssessmentDetails;
        isPasswordRequired?: boolean;
      }>(`/api/assessments/${id.toLowerCase()}`);

      if (response.data.success && response.data.assessment) {
        const assessment = response.data.assessment;
        const isPasswordRequired = response.data.isPasswordRequired ?? !!assessment.password;

        if (isPasswordRequired) {
          setSelectedAssessmentId(id);
          setShowPasswordModal(true);
        } else {
          router.push(`/dashboard/assessments/${id}`);
        }
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to fetch assessment details.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching assessment details:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred while fetching assessment details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordVerification = async () => {
    if (!selectedAssessmentId || !passwordInput) return;

    setIsVerifyingPassword(true);

    try {
        const response = await axios.post<{
          success: boolean;
          message?: string;
        }>('/api/assessments/verify-password', {
            assessmentId: selectedAssessmentId,
            password: passwordInput,
        });

        if (response.data.success) {
            toast({
                title: 'Password Verified',
                description: 'Navigating to assessment.',
                variant: 'default',
             });
            router.push(`/dashboard/assessments/${selectedAssessmentId}`, { state: { passwordVerified: true } });
            setShowPasswordModal(false);
            setSelectedAssessmentId(null);
            setPasswordInput('');
        } else {
            toast({
                title: 'Incorrect Password',
                description: response.data.message || 'The password you entered is incorrect.',
                variant: 'destructive',
            });
            setPasswordInput('');
        }
    } catch (error: any) {
        console.error('Password verification error:', error);
        toast({
            title: 'Error',
            description: error.response?.data?.message || 'An error occurred during password verification.',
            variant: 'destructive',
        });
        setPasswordInput('');
    } finally {
        setIsVerifyingPassword(false);
    }
  };

  const isAssessmentActive = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Assessments</CardTitle>
            <CardDescription>Browse and take available assessments</CardDescription>
          </div>
          <Button onClick={() => router.push('/dashboard/assessments/create')}>
            Create New Assessment
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading assessments...</p>
          ) : assessments.length === 0 ? (
            <p>No assessments available yet.</p>
          ) : (
            <div className="grid gap-4">
              {assessments.map((assessment) => (
                <Card key={assessment._id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{assessment.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {format(new Date(assessment.startTime), 'PPP p')}
                          {' - '}
                          {format(new Date(assessment.endTime), 'PPP p')}
                        </span>
                      </div>
                       <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          Status: {isAssessmentActive(assessment.startTime, assessment.endTime) ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleTakeAssessment(assessment._id)}
                      disabled={!isAssessmentActive(assessment.startTime, assessment.endTime) || isLoading || status === 'loading'}
                    >
                      {isAssessmentActive(assessment.startTime, assessment.endTime) ? 'Take Assessment' : 'Inactive'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Enter Password to Start</DialogTitle>
                  <DialogDescription>This assessment requires a password.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                  <Input
                      type="password"
                      placeholder="Enter password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyPress={(e) => {
                         if (e.key === 'Enter') {
                           handlePasswordVerification();
                         }
                       }}
                  />
              </div>
              <DialogFooter>
                  <Button onClick={handlePasswordVerification} disabled={isVerifyingPassword}>
                      {isVerifyingPassword ? 'Verifying...' : 'Start Assessment'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentsListPage; 