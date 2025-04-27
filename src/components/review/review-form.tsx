"use client";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import StarRating from "@/components/ui/star-rating";
import { Textarea } from "@/components/ui/textarea";
import { submitReview, type NewReviewData } from "@/services/review-service";
import { Loader2, Send } from "lucide-react";

// --- Validation Schema ---
const reviewSchema = z.object({
  rating: z.number().min(1, { message: "Please select a rating." }).max(5),
  comment: z
    .string()
    .min(10, { message: "Review must be at least 10 characters." })
    .max(500, { message: "Review cannot exceed 500 characters." }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  showId: string;
  isLoggedIn: boolean;
  onReviewSubmit?: () => void;
}

export default function ReviewForm({
  showId,
  isLoggedIn,
  onReviewSubmit,
}: ReviewFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  // Redirect to login/register prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <Card className="bg-secondary/50 border-dashed">
        <CardHeader>
          <CardTitle>Leave a Review</CardTitle>
          <CardDescription>
            You must be logged in to post a review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="link" className="p-0">
            <Link href="/login">Login</Link>
          </Button>
          <span className="mx-2">or</span>
          <Button asChild variant="link" className="p-0">
            <Link href="/register">Register</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  async function onSubmit(values: ReviewFormValues) {
    startTransition(async () => {
      const payload: NewReviewData = {
        showId,
        rating: values.rating,
        comment: values.comment,
      };
      try {
        const newReview = await submitReview(payload);
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
        form.reset();
        onReviewSubmit?.();
      } catch {
        toast({
          title: "Submission Failed",
          description: "Could not submit your review. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Your Review</CardTitle>
        <CardDescription>Share your experience with others.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating *</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      size={28}
                      readOnly={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you thought..."
                      {...field}
                      disabled={isPending}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}{" "}
              Submit Review
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
