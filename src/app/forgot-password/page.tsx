'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleResetRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // --- Placeholder for Password Reset Logic ---
    console.log('Password reset request for:', email);
    // Replace with your actual password reset API call (e.g., using Firebase Auth)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    // Example: Check if request is successful (replace with actual response check)
    const requestSuccess = true; // Assume success for placeholder

    if (requestSuccess) {
      toast({ title: 'Password Reset Email Sent', description: 'Please check your inbox for instructions.' });
      setIsSubmitted(true);
    } else {
      toast({ title: 'Request Failed', description: 'Could not process request. Please try again.', variant: 'destructive' });
    }
    // --- End Placeholder ---

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary">Forgot Password</CardTitle>
          {!isSubmitted ? (
             <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
           ) : (
             <CardDescription className="text-green-600">Password reset instructions sent to your email address.</CardDescription>
           )
          }
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
              <form onSubmit={handleResetRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send Reset Link
                </Button>
              </form>
           ) : (
             <div className="text-center">
                <p className="text-muted-foreground">Didn't receive the email? Check your spam folder or try again later.</p>
                {/* Optional: Add a resend button with cooldown */}
             </div>
           )
          }
        </CardContent>
         <div className="mt-4 text-center text-sm p-6 pt-0">
           <Link href="/login" className="font-medium text-primary hover:underline inline-flex items-center">
             <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
           </Link>
         </div>
      </Card>
    </div>
  );
}
