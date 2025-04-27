"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as UiCalendar } from "@/components/ui/calendar"; // Rename Calendar import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Filter,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

// Define the structure of a payment transaction
interface PaymentTransaction {
  id: string; // Transaction ID from payment gateway
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  status:
    | "succeeded"
    | "pending"
    | "failed"
    | "refunded"
    | "partially_refunded";
  paymentMethod: string; // e.g., 'Card', 'PayPal'
  createdAt: string; // ISO date string
  refundAmount?: number;
  showTitle?: string; // Optional, useful for display
}

// --- Placeholder for Payment Service (Admin) ---
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
const randomStatuses: PaymentTransaction["status"][] = [
  "succeeded",
  "succeeded",
  "succeeded",
  "pending",
  "failed",
  "refunded",
  "partially_refunded",
];
const randomMethods = ["Card", "Card", "PayPal", "Card"];

const generateDummyPayments = (count: number): PaymentTransaction[] => {
  const payments: PaymentTransaction[] = [];
  const now = new Date();
  const threeMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 3,
    now.getDate()
  );

  for (let i = 1; i <= count; i++) {
    const status = randomStatuses[i % randomStatuses.length];
    const bookingId = `bk_${i.toString().padStart(3, "0")}`;
    const userId = `user${(i % randomUsers.length) + 1}`;
    const userName = randomUsers[i % randomUsers.length];
    const showTitle = randomShowTitles[i % randomShowTitles.length];
    const amount = parseFloat((Math.random() * 150 + 20).toFixed(2)); // Amount between 20 and 170
    const createdAt = new Date(
      threeMonthsAgo.getTime() +
        Math.random() * (now.getTime() - threeMonthsAgo.getTime())
    ).toISOString();
    let refundAmount: number | undefined = undefined;

    if (status === "refunded") {
      refundAmount = amount;
    } else if (status === "partially_refunded") {
      refundAmount = parseFloat(
        (amount * (Math.random() * 0.5 + 0.1)).toFixed(2)
      ); // Refund 10-60%
    }

    payments.push({
      id: `pi_${Math.random().toString(36).substring(2, 10)}${i}`, // More realistic transaction ID
      bookingId: bookingId,
      userId: userId,
      userName: userName,
      amount: amount,
      currency: "USD",
      status: status,
      paymentMethod: randomMethods[i % randomMethods.length],
      createdAt: createdAt,
      refundAmount: refundAmount,
      showTitle: showTitle,
    });
  }
  return payments;
};

const allDummyPayments = generateDummyPayments(40);

async function fetchAdminPayments(filters: {
  search?: string;
  status?: string;
  dateRange?: DateRange;
}): Promise<PaymentTransaction[]> {
  console.log("Fetching admin payments with filters:", filters);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay shorter

  let filtered = allDummyPayments;
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter(
      (p) => p.status.toLowerCase() === filters.status?.toLowerCase()
    );
  }
  if (filters.dateRange?.from && filters.dateRange?.to) {
    const from = filters.dateRange.from;
    const to = filters.dateRange.to;
    to.setHours(23, 59, 59, 999); // Include end of day
    filtered = filtered.filter(
      (p) => new Date(p.createdAt) >= from && new Date(p.createdAt) <= to
    );
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.id.toLowerCase().includes(query) ||
        p.bookingId.toLowerCase().includes(query) ||
        p.userName.toLowerCase().includes(query) ||
        p.paymentMethod.toLowerCase().includes(query) ||
        (p.showTitle && p.showTitle.toLowerCase().includes(query)) // Check if showTitle exists
    );
  }

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function triggerRefund(
  paymentId: string,
  amount?: number
): Promise<boolean> {
  console.log(
    `Triggering ${
      amount ? `partial refund of $${amount} for` : "full refund for"
    } payment ${paymentId}`
  );
  // TODO: Call payment gateway API (e.g., Stripe, PayPal)
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Simulate update in dummy data
  const paymentIndex = allDummyPayments.findIndex((p) => p.id === paymentId);
  if (paymentIndex !== -1) {
    const payment = allDummyPayments[paymentIndex];
    if (amount && amount < payment.amount) {
      allDummyPayments[paymentIndex].status = "partially_refunded";
      allDummyPayments[paymentIndex].refundAmount =
        (allDummyPayments[paymentIndex].refundAmount || 0) + amount;
    } else {
      allDummyPayments[paymentIndex].status = "refunded";
      allDummyPayments[paymentIndex].refundAmount = payment.amount;
    }
    console.log("Refund processed successfully (simulated)");
    return true; // Assume success
  }
  console.log("Payment not found for refund");
  return false;
}
// --- End Placeholders ---

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track refund loading
  const { toast } = useToast();

  const fetchAndSetPayments = async () => {
    setIsLoading(true);
    setError(null);
    // Keep actionLoading state between fetches if needed, or clear here:
    // setActionLoading(null);
    try {
      const fetchedPayments = await fetchAdminPayments({
        search: searchTerm,
        status: statusFilter,
        dateRange: dateRange,
      });
      setPayments(fetchedPayments);
    } catch (err) {
      console.error("Failed to load payments:", err);
      setError("Could not load payment transactions. Please try again later.");
      toast({
        title: "Error",
        description: "Could not load payments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch on initial load

  const handleFilterSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    fetchAndSetPayments();
  };

  const handleRefund = async (payment: PaymentTransaction) => {
    // Simple full refund confirmation for now
    const confirmMessage = `Are you sure you want to fully refund payment ${
      payment.id
    } for $${payment.amount.toFixed(2)}?`;
    if (!confirm(confirmMessage)) return;

    setActionLoading(payment.id);
    try {
      const success = await triggerRefund(payment.id, payment.amount); // Trigger full refund
      if (success) {
        toast({
          title: "Refund Processing",
          description: `Full refund for payment ${payment.id} initiated.`,
        });
        // Refetch payments to update status
        fetchAndSetPayments(); // Refetch after action
      } else {
        throw new Error("Refund failed");
      }
    } catch (err) {
      console.error("Failed to trigger refund:", err);
      toast({
        title: "Refund Failed",
        description: "Could not process refund.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadgeVariant = (
    status: PaymentTransaction["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "succeeded":
        return "default"; // Or green
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
      case "partially_refunded":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">
        Payment Transactions
      </h1>

      {/* Filters */}
      <form
        onSubmit={handleFilterSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Tx ID, Booking ID, User, Show, Method..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="succeeded">Succeeded</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="partially_refunded">
              Partially Refunded
            </SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <UiCalendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button type="submit" className="md:col-span-4">
          <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </form>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>List of all payment transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading payments...</p>
            </div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No payment transactions found matching your criteria.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Show</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className={
                        actionLoading === payment.id ? "opacity-50" : ""
                      }
                    >
                      <TableCell
                        className="font-mono text-xs max-w-[100px] truncate"
                        title={payment.id}
                      >
                        {payment.id}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.bookingId}
                      </TableCell>
                      <TableCell>{payment.userName}</TableCell>
                      <TableCell>
                        {payment.currency}
                        {payment.amount.toFixed(2)}
                        {payment.refundAmount && (
                          <span className="text-xs text-orange-600 ml-1 block sm:inline">
                            (-{payment.currency}
                            {payment.refundAmount.toFixed(2)})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(payment.status)}
                          className="capitalize"
                        >
                          {payment.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell
                        className="text-xs max-w-[150px] truncate"
                        title={payment.showTitle}
                      >
                        {payment.showTitle || "-"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {format(
                          new Date(payment.createdAt),
                          "MMM d, yyyy h:mm a"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {/* View Details / Link to Gateway */}
                        {/* <Button variant="ghost" size="icon" className="mr-1 h-8 w-8" title="View in Gateway (Not Implemented)">
                               <ExternalLink className="h-4 w-4"/>
                           </Button> */}
                        {/* Refund Button */}
                        {(payment.status === "succeeded" ||
                          payment.status === "partially_refunded") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefund(payment)}
                            disabled={actionLoading === payment.id}
                            className="h-8"
                          >
                            {actionLoading === payment.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                            <span className="ml-1">Refund</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {/* Optional: Pagination */}
      </Card>
      {/* TODO: Add Payment Analytics Summary (e.g., Total Volume, Success Rate, Refund Rate) */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Analytics Summary</CardTitle>
          <CardDescription>
            Overview of payment processing health.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Payment analytics charts and summaries will be added here.
          </p>
          {/* Example: Use Recharts for visualization */}
        </CardContent>
      </Card>
    </div>
  );
}
