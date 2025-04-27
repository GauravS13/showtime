"use client"; // Assuming booking data might require client-side fetching or interaction

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  History,
  Loader2,
  Ticket,
} from "lucide-react";
import Image from "next/image"; // Use next/image
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define the structure of a booking
interface Booking {
  id: string;
  showId: string;
  showTitle: string;
  showImageUrl: string; // Add image URL for visual appeal
  venue: string;
  schedule: string; // ISO date string
  seats: string[];
  totalPrice: number;
  bookingDate: string; // ISO date string
  status: "confirmed" | "cancelled" | "pending"; // Add status
}

// --- Placeholder for Booking Service ---
const randomShowTitles = [
  "Sample Drama",
  "Another Drama",
  "Past Comedy Show",
  "Cancelled Mystery",
  "Upcoming Musical",
  "Historical Epic",
  "Sci-Fi Adventure",
  "Romantic Play",
  "Thriller Night",
  "One-Man Show",
  "Whodunit Mystery",
  "Shakespearean Classic",
  "Modern Adaptation",
  "Experimental Theatre",
  "Political Satire",
  "Family Friendly Show",
  "Award Winning Play",
  "Debut Performance",
  "Revival Production",
  "International Tour",
];
const randomVenues = [
  "Main Hall",
  "Grand Theatre",
  "Studio B",
  "Opera House",
  "The Black Box",
  "Amphitheatre",
  "Civic Center",
  "Royal Hall",
  "Heritage Playhouse",
  "Modern Arts Center",
  "Downtown Stage",
  "Riverside Pavilion",
  "The Loft",
  "Gallery Theatre",
  "West End Stage",
];
const randomStatuses: Booking["status"][] = [
  "confirmed",
  "confirmed",
  "confirmed",
  "cancelled",
  "pending",
  "confirmed",
  "confirmed",
  "cancelled",
]; // More confirmed, fewer pending
const seatLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const generateUserBookings = (count: number): Booking[] => {
  const bookings: Booking[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const showIndex = i % randomShowTitles.length;
    const venueIndex = i % randomVenues.length;
    const status = randomStatuses[i % randomStatuses.length];
    // Ensure schedule makes sense relative to booking date and status
    const bookingDate = new Date(
      now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000
    ); // Booked within last 180 days
    let scheduleDate: Date;
    if (status === "confirmed") {
      // Confirmed bookings can be past or future
      scheduleDate = new Date(
        bookingDate.getTime() + (Math.random() * 90 - 30) * 24 * 60 * 60 * 1000
      ); // -30 to +60 days from booking
    } else if (status === "cancelled") {
      // Cancelled bookings usually for future shows
      scheduleDate = new Date(
        now.getTime() + (Math.random() * 60 + 1) * 24 * 60 * 60 * 1000
      ); // 1 to 61 days in future
    } else {
      // Pending
      scheduleDate = new Date(
        now.getTime() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000
      ); // 1 to 15 days in future
    }
    scheduleDate.setHours(
      18 + Math.floor(Math.random() * 4),
      Math.random() > 0.5 ? 0 : 30
    ); // 6pm to 9:30pm

    const numSeats = Math.floor(Math.random() * 5) + 1; // 1 to 5 seats
    const seats = Array.from(
      { length: numSeats },
      (_, idx) =>
        `${seatLetters[Math.floor(Math.random() * seatLetters.length)]}${
          Math.floor(Math.random() * 15) + 1
        }`
    );

    bookings.push({
      id: `bk_user_${i.toString().padStart(3, "0")}`,
      showId: `show_${(showIndex + 1).toString().padStart(3, "0")}`,
      showTitle: randomShowTitles[showIndex],
      showImageUrl: `https://picsum.photos/seed/${(showIndex + 1)
        .toString()
        .padStart(3, "0")}/300/200`,
      venue: randomVenues[venueIndex],
      schedule: scheduleDate.toISOString(),
      seats: [...new Set(seats)],
      totalPrice: parseFloat((numSeats * (Math.random() * 40 + 35)).toFixed(2)), // Price between 35-75 per seat
      bookingDate: bookingDate.toISOString(),
      status: status,
    });
  }
  return bookings;
};

const allUserDummyBookings = generateUserBookings(30); // Increased dummy data

async function fetchUserBookings(): Promise<Booking[]> {
  // Replace with your actual API call to fetch user's bookings
  console.log("Fetching user bookings...");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay shorter

  return allUserDummyBookings.sort(
    (a, b) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime()
  ); // Sort by show date descending initially
}
// --- End Placeholder ---

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false); // State flag for toast

  // Check for success query param from booking page and show toast only once
  useEffect(() => {
    if (searchParams?.get("success") === "true" && !hasShownSuccessToast) {
      toast({
        title: "Booking Successful!",
        description:
          "Your booking details are listed below. An e-ticket has been sent to your email.",
        variant: "default",
        duration: 5000,
      });
      setHasShownSuccessToast(true); // Mark toast as shown
      // Optional: Clean the URL query param
      // window.history.replaceState(null, '', window.location.pathname);
    }
  }, [searchParams, toast, hasShownSuccessToast]); // Add flag to dependency array

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Add authentication check here. Redirect if not logged in.
        const fetchedBookings = await fetchUserBookings();
        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError("Could not load your bookings. Please try again later.");
        toast({
          title: "Error",
          description: "Could not load bookings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]); // Add toast to dependency array if used inside useEffect

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.schedule) >= new Date() && b.status === "confirmed"
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.schedule) < new Date() || b.status !== "confirmed"
  );

  const getStatusBadgeVariant = (
    status: Booking["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "confirmed":
        return "default"; // Use primary color for confirmed
      case "cancelled":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleDownloadTicket = (bookingId: string) => {
    // Placeholder for ticket download logic
    console.log(`Downloading ticket for booking ${bookingId}`);
    toast({
      title: "Ticket Download",
      description: "Ticket download functionality is not yet implemented.",
    });
    // In a real app: Trigger an API call or generate the PDF
  };

  const handleViewInvoice = (bookingId: string) => {
    // Placeholder for invoice view logic
    console.log(`Viewing invoice for booking ${bookingId}`);
    toast({
      title: "Invoice View",
      description: "Invoice viewing functionality is not yet implemented.",
    });
    // In a real app: Navigate to an invoice page or open a modal
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
        <History className="h-7 w-7" /> My Booking History
      </h1>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading your bookings...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Loading Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && bookings.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <Ticket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Bookings Yet</CardTitle>
            <CardDescription>
              You haven't booked any shows yet. Explore our exciting lineup!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/shows">Browse Shows</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && bookings.length > 0 && (
        <>
          {/* Upcoming Bookings */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Upcoming Bookings
            </h2>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="overflow-hidden flex flex-col sm:flex-row"
                  >
                    <div className="flex-shrink-0 w-full sm:w-[150px] h-32 sm:h-auto relative">
                      <Image
                        src={booking.showImageUrl}
                        alt={`${booking.showTitle} Poster`}
                        fill // Use fill layout
                        sizes="(max-width: 640px) 100vw, 150px" // Define sizes
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg">
                            <Link
                              href={`/shows/${booking.showId}`}
                              className="hover:text-primary transition-colors"
                            >
                              {booking.showTitle}
                            </Link>
                          </CardTitle>
                          <Badge
                            variant={getStatusBadgeVariant(booking.status)}
                            className="capitalize"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {booking.venue}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1 pb-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(
                              new Date(booking.schedule),
                              "eeee, MMM d, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(booking.schedule), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Ticket className="w-4 h-4" />
                          <span>Seats: {booking.seats.join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Booked on:{" "}
                          </span>
                          {format(new Date(booking.bookingDate), "MMM d, yyyy")}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-semibold text-foreground">
                            ${booking.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadTicket(booking.id)}
                        >
                          <Download className="mr-1.5 h-4 w-4" /> Download
                          Ticket
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewInvoice(booking.id)}
                        >
                          <FileText className="mr-1.5 h-4 w-4" /> View Invoice
                        </Button>
                        {/* Optional: Add Cancel Button (if allowed) */}
                        {/* <Button size="sm" variant="destructive" disabled>Cancel Booking</Button> */}
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No upcoming bookings.
              </p>
            )}
          </section>

          <Separator />

          {/* Past Bookings */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Past & Cancelled Bookings
            </h2>
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="overflow-hidden flex flex-col sm:flex-row opacity-80"
                  >
                    <div className="flex-shrink-0 w-full sm:w-[150px] h-32 sm:h-auto relative">
                      <Image
                        src={booking.showImageUrl}
                        alt={`${booking.showTitle} Poster`}
                        fill // Use fill layout
                        sizes="(max-width: 640px) 100vw, 150px" // Define sizes
                        className="object-cover filter grayscale"
                      />
                    </div>
                    <div className="flex-grow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg text-muted-foreground">
                            {booking.showTitle}
                          </CardTitle>
                          <Badge
                            variant={getStatusBadgeVariant(booking.status)}
                            className="capitalize"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {booking.venue}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1 pb-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(booking.schedule), "MMM d, yyyy")}{" "}
                            at {format(new Date(booking.schedule), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Ticket className="w-4 h-4" />
                          <span>Seats: {booking.seats.join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Booked on:{" "}
                          </span>
                          {format(new Date(booking.bookingDate), "MMM d, yyyy")}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-semibold">
                            ${booking.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4 flex flex-wrap gap-2">
                        {booking.status === "confirmed" &&
                          new Date(booking.schedule) < new Date() && ( // Only show for completed past bookings
                            <Button size="sm" variant="secondary" asChild>
                              <Link href={`/shows/${booking.showId}#reviews`}>
                                Leave a Review
                              </Link>
                            </Button>
                          )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewInvoice(booking.id)}
                        >
                          <FileText className="mr-1.5 h-4 w-4" /> View Invoice
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No past or cancelled bookings.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
