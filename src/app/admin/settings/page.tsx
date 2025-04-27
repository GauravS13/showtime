"use client";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Building, Loader2, Save, Settings } from "lucide-react"; // Import Settings
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// --- Settings Schemas (Example) ---
const generalSettingsSchema = z.object({
  appName: z.string().min(1, "Application name is required."),
  defaultCurrency: z
    .string()
    .length(3, "Currency code must be 3 letters (e.g., USD).")
    .toUpperCase(),
  maxSeatsPerBooking: z.coerce
    .number()
    .int()
    .min(1, "Must allow at least 1 seat.")
    .max(20, "Maximum 20 seats per booking."),
  // Add more general settings
});

const venueSettingsSchema = z.object({
  venueName: z.string().min(1, "Venue name is required."),
  address: z.string().optional(),
  defaultHall: z.string().optional(),
  // Add hall/room management fields later
});

const notificationSettingsSchema = z.object({
  adminEmail: z
    .string()
    .email("Invalid email format.")
    .optional()
    .or(z.literal("")),
  sendBookingConfirmation: z.boolean(),
  sendCancellationNotice: z.boolean(),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
type VenueSettingsFormValues = z.infer<typeof venueSettingsSchema>;
type NotificationSettingsFormValues = z.infer<
  typeof notificationSettingsSchema
>;

const initialGeneralSettings: GeneralSettingsFormValues = {
  appName: "",
  defaultCurrency: "",
  maxSeatsPerBooking: 1,
};
const initialVenueSettings: VenueSettingsFormValues = {
  venueName: "",
  address: "",
  defaultHall: "",
};
const initialNotificationSettings: NotificationSettingsFormValues = {
  adminEmail: "",
  sendBookingConfirmation: true,
  sendCancellationNotice: true,
};

// --- Placeholder for Settings Service ---
async function fetchSettings<T>(key: string, defaultValue: T): Promise<T> {
  console.log(`Fetching settings for key: ${key}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Simulate fetching saved settings (use localStorage or API)
  // Check if running in a browser environment before accessing localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(`setting_${key}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure the shape matches the default value structure
        return { ...defaultValue, ...parsed };
      } catch {
        /* ignore parse error, return default */
      }
    }
  }
  return defaultValue;
}

async function saveSettings<T>(key: string, data: T): Promise<boolean> {
  console.log(`Saving settings for key ${key}:`, data);
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Simulate saving (use localStorage or API)
  // Check if running in a browser environment before accessing localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(`setting_${key}`, JSON.stringify(data));
  } else {
    console.warn("localStorage is not available. Settings not saved.");
    return false; // Indicate failure if localStorage is not available
  }
  return true; // Assume success
}
// --- End Placeholders ---

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isSavingVenue, setIsSavingVenue] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // --- General Settings Form ---
  const generalForm = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: initialGeneralSettings, // Use initial synchronous values
  });

  useEffect(() => {
    fetchSettings("general", initialGeneralSettings).then((data) => {
      generalForm.reset(data); // Reset form with fetched data
    });
  }, [generalForm]);

  async function onGeneralSubmit(data: GeneralSettingsFormValues) {
    setIsSavingGeneral(true);
    try {
      const success = await saveSettings("general", data);
      if (success) {
        toast({ title: "General Settings Saved" });
        generalForm.reset(data); // Reset form with the saved data to update dirty state
      } else {
        throw new Error(
          "Save failed (localStorage unavailable or other error)"
        );
      }
    } catch (error) {
      console.error("Error saving general settings:", error);
      toast({
        title: "Error Saving",
        description: "Could not save general settings.",
        variant: "destructive",
      });
    } finally {
      setIsSavingGeneral(false);
    }
  }

  // --- Venue Settings Form ---
  const venueForm = useForm<VenueSettingsFormValues>({
    resolver: zodResolver(venueSettingsSchema),
    defaultValues: initialVenueSettings,
  });

  useEffect(() => {
    fetchSettings("venue", initialVenueSettings).then((data) => {
      venueForm.reset(data);
    });
  }, [venueForm]);

  async function onVenueSubmit(data: VenueSettingsFormValues) {
    setIsSavingVenue(true);
    try {
      const success = await saveSettings("venue", data);
      if (success) {
        toast({ title: "Venue Settings Saved" });
        venueForm.reset(data);
      } else {
        throw new Error(
          "Save failed (localStorage unavailable or other error)"
        );
      }
    } catch (error) {
      console.error("Error saving venue settings:", error);
      toast({
        title: "Error Saving",
        description: "Could not save venue settings.",
        variant: "destructive",
      });
    } finally {
      setIsSavingVenue(false);
    }
  }

  // --- Notification Settings Form ---
  const notificationForm = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: initialNotificationSettings,
  });

  useEffect(() => {
    fetchSettings("notifications", initialNotificationSettings).then((data) => {
      notificationForm.reset(data);
    });
  }, [notificationForm]);

  async function onNotificationSubmit(data: NotificationSettingsFormValues) {
    setIsSavingNotifications(true);
    try {
      const success = await saveSettings("notifications", data);
      if (success) {
        toast({ title: "Notification Settings Saved" });
        notificationForm.reset(data);
      } else {
        throw new Error(
          "Save failed (localStorage unavailable or other error)"
        );
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error Saving",
        description: "Could not save notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsSavingNotifications(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        Application Settings
      </h1>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" /> General Settings
          </CardTitle>
          <CardDescription>
            Configure core application parameters.
          </CardDescription>
        </CardHeader>
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={generalForm.control}
                name="appName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Showtime Tickets" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={generalForm.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Currency Code</FormLabel>
                    <FormControl>
                      <Input placeholder="USD" {...field} maxLength={3} />
                    </FormControl>
                    <FormDescription>
                      3-letter ISO currency code (e.g., USD, EUR).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={generalForm.control}
                name="maxSeatsPerBooking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Seats Per Booking</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="20" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of seats a user can select in a single
                      transaction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                type="submit"
                disabled={isSavingGeneral || !generalForm.formState.isDirty}
              >
                {isSavingGeneral ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save General Settings
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Separator />

      {/* Venue Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" /> Venue Configuration
          </CardTitle>
          <CardDescription>
            Set up details about the performance venue(s).
          </CardDescription>
        </CardHeader>
        <Form {...venueForm}>
          <form onSubmit={venueForm.handleSubmit(onVenueSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={venueForm.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grand Theatre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={venueForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Address (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Main St, Anytown..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* TODO: Add Hall/Room Management Interface */}
              <p className="text-sm text-muted-foreground">
                Hall/Room management coming soon.
              </p>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                type="submit"
                disabled={isSavingVenue || !venueForm.formState.isDirty}
              >
                {isSavingVenue ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Venue Settings
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Separator />

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notification Settings
          </CardTitle>
          <CardDescription>
            Configure email notifications sent by the system.
          </CardDescription>
        </CardHeader>
        <Form {...notificationForm}>
          <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={notificationForm.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Notification Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Email address to receive system notifications (e.g., new
                      bookings, errors). Leave blank to disable.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={notificationForm.control}
                name="sendBookingConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Send Booking Confirmations
                      </FormLabel>
                      <FormDescription>
                        Email users their e-ticket and booking details upon
                        successful payment.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={notificationForm.control}
                name="sendCancellationNotice"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Send Cancellation Notices
                      </FormLabel>
                      <FormDescription>
                        Notify users if their booking is cancelled (e.g., due to
                        event cancellation or refund).
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Add more notification toggles */}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                type="submit"
                disabled={
                  isSavingNotifications || !notificationForm.formState.isDirty
                }
              >
                {isSavingNotifications ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Notification Settings
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* TODO: Add sections for Payment Gateway Config, Email Templates, etc. */}
    </div>
  );
}
