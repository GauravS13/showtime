"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Banknote,
  Calendar,
  Eye,
  Filter,
  Loader2,
  MoreHorizontal,
  Search,
  Ticket as TicketIcon,
  Trash2,
  User,
} from "lucide-react"; // Import Banknote
import { useEffect, useState } from "react";

// Define the structure of a booking (more detailed for admin)
interface AdminBooking {
  id: string;
  showId: string;
  showTitle: string;
  userId: string;
  userName: string; // Or user email
  schedule: string; // ISO date string
  seats: string[];
  totalPrice: number;
  bookingDate: string; // ISO date string
  status: "confirmed" | "cancelled" | "pending";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  venue: string;
}

// --- Placeholder for Booking Service (Admin) ---
const randomShowTitles = [
  "Sample Drama",
  "Another Drama",
  "Past Comedy Show",
  "Cancelled Mystery",
  "Upcoming Musical",
  "Historical Epic",
  "Sci-Fi Adventure",
  "Romantic Play",
];
const randomUsers = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
  "Kate",
  "Liam",
  "Mary",
  "Noah",
  "Olivia",
  "Peter",
];
const randomVenues = [
  "Main Hall",
  "Grand Theatre",
  "Studio B",
  "Opera House",
  "The Black Box",
  "Amphitheatre",
];
const randomStatuses: AdminBooking["status"][] = [
  "confirmed",
  "cancelled",
  "pending",
];
const randomPaymentStatuses: AdminBooking["paymentStatus"][] = [
  "paid",
  "pending",
  "failed",
  "refunded",
];

const generateDummyBookings = (count: number): AdminBooking[] => {
  const bookings: AdminBooking[] = [];
  const now = new Date();
  const seatLetters = ["A", "B", "C", "D", "E"];

  for (let i = 1; i <= count; i++) {
    const status = randomStatuses[i % randomStatuses.length];
    let paymentStatus = randomPaymentStatuses[i % randomPaymentStatuses.length];
    if (status === "cancelled") paymentStatus = "refunded";
    if (status === "pending") paymentStatus = "pending";
    if (status === "confirmed" && paymentStatus === "pending")
      paymentStatus = "paid"; // Ensure confirmed bookings are mostly paid

    const showIndex = i % randomShowTitles.length;
    const userIndex = i % randomUsers.length;
    const venueIndex = i % randomVenues.length;
    const scheduleDate = new Date(
      now.getTime() + (Math.random() * 90 - 30) * 24 * 60 * 60 * 1000
    ); // +/- 30 days around today
    scheduleDate.setHours(
      19 + Math.floor(Math.random() * 3),
      Math.random() > 0.5 ? 0 : 30
    );

    const numSeats = Math.floor(Math.random() * 4) + 1; // 1 to 4 seats
    const seats = Array.from(
      { length: numSeats },
      (_, idx) =>
        `${seatLetters[Math.floor(Math.random() * seatLetters.length)]}${
          Math.floor(Math.random() * 10) + 1
        }`
    );

    bookings.push({
      id: `bk_${i.toString().padStart(3, "0")}`,
      showId: `show_${(showIndex + 1).toString().padStart(3, "0")}`,
      showTitle: randomShowTitles[showIndex],
      userId: `user${userIndex + 1}`,
      userName: randomUsers[userIndex],
      schedule: scheduleDate.toISOString(),
      seats: [...new Set(seats)], // Ensure unique seats
      totalPrice: parseFloat((numSeats * (Math.random() * 30 + 40)).toFixed(2)), // Price between 40-70 per seat
      bookingDate: new Date(
        scheduleDate.getTime() - (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000
      ).toISOString(), // Booked 1-8 days before show
      status: status,
      paymentStatus: paymentStatus,
      venue: randomVenues[venueIndex],
    });
  }
  return bookings;
};

const allDummyBookings = generateDummyBookings(30);

async function fetchAdminBookings(filters: {
  search?: string;
  showId?: string;
  status?: string;
}): Promise<AdminBooking[]> {
  console.log("Fetching admin bookings with filters:", filters);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay shorter

  let filtered = allDummyBookings;
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter(
      (b) => b.status.toLowerCase() === filters.status?.toLowerCase()
    );
  }
  if (filters.showId && filters.showId !== "all") {
    filtered = filtered.filter((b) => b.showId === filters.showId);
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.showTitle.toLowerCase().includes(query) ||
        b.userName.toLowerCase().includes(query) ||
        b.id.toLowerCase().includes(query) || // Search by booking ID
        b.seats.join(", ").toLowerCase().includes(query) ||
        b.venue.toLowerCase().includes(query)
    );
  }

  return filtered.sort(
    (a, b) =>
      new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
  ); // Sort by booking date descending
}

// --- Placeholder for Unique Shows List ---
async function fetchAllShowTitles(): Promise<{ id: string; title: string }[]> {
  await new Promise((resolve) => setTimeout(resolve, 100)); // Faster simulation
  const uniqueShows = [
    ...new Map(
      allDummyBookings.map((item) => [
        item.showId,
        { id: item.showId, title: item.showTitle },
      ])
    ).values(),
  ];
  return uniqueShows.sort((a, b) => a.title.localeCompare(b.title));
}
// --- End Placeholders ---

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [showsList, setShowsList] = useState<{ id: string; title: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const fetchAndSetData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch shows list for filter dropdown first or in parallel
      const [fetchedBookings, fetchedShows] = await Promise.all([
        fetchAdminBookings({
          search: searchTerm,
          showId: showFilter,
          status: statusFilter,
        }),
        fetchAllShowTitles(), // Fetch only if showsList is empty? Optimize later.
      ]);
      setBookings(fetchedBookings);
      setShowsList(fetchedShows);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setError("Could not load bookings. Please try again later.");
      toast({
        title: "Error",
        description: "Could not load bookings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilter, statusFilter]); // Refetch when filters change

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchAndSetData();
  };

  const getStatusBadgeVariant = (
    status: AdminBooking["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "confirmed":
        return "default";
      case "cancelled":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPaymentBadgeVariant = (
    status: AdminBooking["paymentStatus"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "paid":
        return "default"; // Or a green variant if defined
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "outline";
    }
  };

  // Placeholder actions
  const handleViewDetails = (bookingId: string) => {
    toast({
      title: "Info",
      description: `Viewing details for booking ${bookingId} (Not Implemented)`,
    });
    // TODO: Implement modal or detail view
  };
  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Action Required",
      description: `Cancelling booking ${bookingId} (Not Implemented)`,
    });
    // Need refund logic connection here
    // TODO: Implement cancellation logic and state update/refetch
  };
  const handleRefundBooking = (bookingId: string) => {
    toast({
      title: "Action Required",
      description: `Refunding booking ${bookingId} (Not Implemented)`,
    });
    // TODO: Implement refund logic and state update/refetch
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">
        Manage Bookings
      </h1>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        <div className="relative md:col-span-2 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Show, User, Booking ID, Seats, Venue..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={showFilter} onValueChange={setShowFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Show" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shows</SelectItem>
            {showsList.map((show) => (
              <SelectItem key={show.id} value={show.id}>
                {show.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {/* Button is implicitly part of the form */}
        <Button type="submit" className="md:col-start-3 lg:col-start-4">
          <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </form>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            List of all ticket bookings made by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading bookings...</p>
            </div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No bookings found matching your criteria.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Show Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">
                        {booking.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {booking.showTitle}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {booking.userName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(
                            new Date(booking.schedule),
                            "MMM d, yyyy h:mm a"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <TicketIcon className="h-3 w-3 text-muted-foreground" />
                          {booking.seats.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(booking.status)}
                          className="capitalize"
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getPaymentBadgeVariant(
                            booking.paymentStatus
                          )}
                          className="capitalize"
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {booking.venue}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Manage</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(booking.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {booking.status === "confirmed" &&
                              booking.paymentStatus === "paid" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />{" "}
                                  Cancel / Refund
                                </DropdownMenuItem>
                              )}
                            {booking.status === "cancelled" &&
                              booking.paymentStatus === "paid" && ( // Example condition for refund
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRefundBooking(booking.id)
                                  }
                                >
                                  <Banknote className="mr-2 h-4 w-4" /> Trigger
                                  Refund
                                </DropdownMenuItem>
                              )}
                            {/* Add more actions like Resend Email etc. */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {/* Optional: Add Pagination */}
      </Card>

      {/* TODO: Add Bulk Booking Functionality */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Ticket Booking</CardTitle>
          <CardDescription>
            Register tickets for offline or special entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bulk booking functionality will be added here.
          </p>
          {/* Form elements for bulk booking */}
          <Button disabled className="mt-4">
            Initiate Bulk Booking (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper type or interface for show list
interface ShowTitle {
  id: string;
  title: string;
}

// Helper type or interface for booking filters
interface BookingFilters {
  search?: string;
  showId?: string;
  status?: string;
}
