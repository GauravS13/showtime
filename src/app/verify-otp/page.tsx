"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"; // Import useEffect

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract verification context from query parameters
  const [verificationTarget, setVerificationTarget] = useState(
    "your registered method"
  );
  const [verificationReason, setVerificationReason] =
    useState("verify your action");

  useEffect(() => {
    const target = searchParams?.get("target");
    const reason = searchParams?.get("reason");
    if (target) setVerificationTarget(decodeURIComponent(target));
    if (reason) setVerificationReason(reason);
  }, [searchParams]);

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (otp.length !== 6) {
      // Basic validation for OTP length
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    // --- Placeholder for OTP Verification Logic ---
    console.log(
      "Verifying OTP:",
      otp,
      "for:",
      verificationTarget,
      "reason:",
      verificationReason
    );
    // Replace with your actual OTP verification API call
    // This should check if the OTP matches the one sent for the specific target and reason
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    // Example: Check if OTP is correct (replace with actual response check)
    const verificationSuccess = otp === "123456"; // Assume success for placeholder

    if (verificationSuccess) {
      toast({
        title: "Verification Successful",
        description:
          verificationReason === "register-verify"
            ? "Your account is now active."
            : "Your identity has been verified.",
      });

      // Redirect based on the reason
      if (verificationReason === "login") {
        // TODO: Redirect to dashboard once it exists
        router.push("/"); // Redirect to home page for now
      } else if (verificationReason === "reset-password") {
        // TODO: Redirect to actual password reset form/page
        router.push("/forgot-password?step=reset"); // Example redirect to reset step
      } else if (verificationReason === "register-verify") {
        // TODO: Redirect to dashboard once it exists
        router.push("/"); // Redirect to home page after successful registration verification
      } else {
        router.push("/"); // Fallback redirect
      }
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false); // Only set loading false on failure
    }
    // --- End Placeholder ---

    // Don't set isLoading to false if redirecting on success
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    // --- Placeholder for Resend OTP Logic ---
    console.log(
      "Resend OTP request for:",
      verificationTarget,
      "reason:",
      verificationReason
    );
    // Replace with your actual resend OTP API call based on target and reason
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    // Example: Check if request is successful
    const resendSuccess = true; // Assume success for placeholder

    if (resendSuccess) {
      toast({
        title: "OTP Resent",
        description: `A new OTP has been sent to ${verificationTarget}.`,
      });
    } else {
      toast({
        title: "Request Failed",
        description: "Could not resend OTP. Please try again later.",
        variant: "destructive",
      });
    }
    // --- End Placeholder ---

    setIsResending(false);
  };

  const getReasonDescription = (reason: string) => {
    switch (reason) {
      case "login":
        return "log in";
      case "reset-password":
        return "reset your password";
      case "register-verify":
        return "verify your email and activate your account";
      default:
        return "verify your action";
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md mx-auto shadow-lg text-center">
        <CardHeader className="space-y-2">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl font-bold text-primary">
            Enter Verification Code
          </CardTitle>
          <CardDescription>
            Please enter the 6-digit code sent to {verificationTarget} to{" "}
            {getReasonDescription(verificationReason)}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="sr-only">
                OTP Code
              </Label>
              <Input
                id="otp"
                type="text" // Use text to allow leading zeros, handle validation manually
                inputMode="numeric" // Hint for numeric keyboard on mobile
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Allow only digits
                disabled={isLoading}
                className="text-center text-lg tracking-widest"
                aria-label="One-Time Password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Verify Code
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">Didn't receive the code?</p>
            <Button
              variant="link"
              className="font-medium text-primary"
              onClick={handleResendOtp}
              disabled={isResending || isLoading}
            >
              {isResending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Resend Code
            </Button>
          </div>
          {/* Optional: Link to go back if verification is part of another flow */}
          {verificationReason !== "register-verify" && (
            <div className="mt-4 text-center text-sm">
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Cancel
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
