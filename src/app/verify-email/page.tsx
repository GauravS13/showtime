'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck, Send } from 'lucide-react';

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // TODO: Get user's email from query params or auth state if needed

  const handleResendVerification = async () => {
    setIsLoading(true);

    // --- Placeholder for Resend Verification Logic ---
    console.log('Resend verification email request');
    // Replace with your actual resend verification API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    // Example: Check if request is successful
    const resendSuccess = true; // Assume success for placeholder

    if (resendSuccess) {
      toast({ title: 'Verification Email Resent', description: 'Please check your inbox again.' });
    } else {
      toast({ title: 'Request Failed', description: 'Could not resend verification email. Please try again later.', variant: 'destructive' });
    }
    // --- End Placeholder ---

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md mx-auto shadow-lg text-center">
        <CardHeader className="space-y-2">
          <MailCheck className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl font-bold text-primary">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please check your inbox (and spam folder!) to complete your registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
                Didn't receive the email?
            </p>
            <Button onClick={handleResendVerification} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
              Resend Verification Email
            </Button>
             <p className="text-muted-foreground text-xs pt-2">
                Once verified, you can <Link href="/login" className="font-medium text-primary hover:underline">login here</Link>.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}
