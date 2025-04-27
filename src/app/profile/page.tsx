"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { passwordChangeSchema, profileSchema } from "@/lib/schemas/profile"; // Assuming schemas are defined here
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// --- Placeholder for Authentication and User Data ---
// Replace with your actual auth hook/context
const useAuth = () => {
  // Simulate fetching user data
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatarUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data after mount
    setTimeout(() => {
      setUser({
        name: "John Doe",
        email: "john.doe@example.com",
        avatarUrl: "https://picsum.photos/seed/profile/100", // Placeholder avatar
      });
      setLoading(false);
    }, 500); // Simulate network delay
  }, []);

  return { user, loading };
};
// --- End Placeholder ---

// --- Profile Form ---
type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: authLoading } = useAuth(); // Use the auth hook

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // Set initial default values (can be empty strings or placeholders)
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Reset form with fetched user data once available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    console.log("Updating profile:", data);
    // --- Placeholder for Profile Update Logic ---
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
    const updateSuccess = true; // Assume success

    if (updateSuccess) {
      toast({
        title: "Profile Updated",
        description: "Your information has been saved.",
      });
      // Optionally refetch user data or update local state
      // Reset form with the new data to update dirty state
      form.reset(data);
    } else {
      toast({
        title: "Update Failed",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      });
    }
    // --- End Placeholder ---
    setIsLoading(false);
  }

  if (authLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Loading your details...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
          <div className="h-10 bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 bg-muted rounded-md animate-pulse"></div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not load user profile.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {/* TODO: Add upload/change avatar functionality if needed */}
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    {/* Make email read-only or add verification flow if editable */}
                    <Input
                      placeholder="your.email@example.com"
                      {...field}
                      disabled={true}
                      readOnly
                    />
                  </FormControl>
                  <FormDescription>
                    Email cannot be changed here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// --- Password Change Form ---
type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

function PasswordChangeForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: PasswordChangeFormValues) {
    setIsLoading(true);
    console.log("Changing password request initiated..."); // Avoid logging passwords
    // --- Placeholder for Password Change Logic ---
    // IMPORTANT: You need to verify the currentPassword against the backend here!
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
    const changeSuccess = true; // Assume success for placeholder

    if (changeSuccess) {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      form.reset(); // Clear form on success
    } else {
      toast({
        title: "Password Change Failed",
        description:
          "Could not update password. Please check your current password.",
        variant: "destructive",
      });
      // Example specific error:
      // form.setError("currentPassword", { type: "manual", message: "Incorrect current password." });
    }
    // --- End Placeholder ---
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              Change Password
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// --- Main Profile Page ---
export default function ProfilePage() {
  // TODO: Add check if user is logged in, redirect if not using actual auth logic

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
        <User className="h-7 w-7" /> Manage Your Profile
      </h1>

      <ProfileForm />

      <Separator />

      <PasswordChangeForm />

      {/* Optional: Add Delete Account section */}
      <Separator />
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="destructive" disabled>
            {" "}
            {/* TODO: Implement delete functionality */}
            Delete My Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
