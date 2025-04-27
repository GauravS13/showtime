"use client"; // This needs to be a client component for interactivity

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollArea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Import cn utility
import { getDiscountCode, type DiscountCode } from "@/services/payment-service";
import { getDramaShow, type DramaShow } from "@/services/ticket-service";
import { format } from "date-fns";
import { Armchair, ArrowLeft, Loader2, Tag, Ticket, X } from "lucide-react"; // Added Armchair and X icons
import { useParams, useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { useCallback, useEffect, useState } from "react";

// Seat Component (remains the same)
const Seat = ({
  id,
  status,
  onClick,
  isSelected,
}: {
  id: string;
  status: "available" | "booked" | "selected";
  onClick: (id: string) => void;
  isSelected: boolean;
}) => {
  const baseClasses =
    "w-8 h-8 md:w-10 md:h-10 rounded-t-md flex items-center justify-center transition-all duration-150 ease-in-out border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 shrink-0"; // Added shrink-0

  let stateClasses = "";
  let content: React.ReactNode = id; // Use React.ReactNode for type safety
  let ariaLabel = `Seat ${id}`;

  switch (status) {
    case "available":
      stateClasses =
        "bg-muted/30 border-muted-foreground/30 text-muted-foreground/80 hover:bg-accent/20 hover:border-accent hover:text-accent-foreground cursor-pointer";
      ariaLabel += " (Available)";
      // Extract row and number for display
      const matchAvail = id.match(/([A-Z]+)(\d+)/);
      content = matchAvail ? matchAvail[2] : id; // Display only number
      break;
    case "selected":
      stateClasses =
        "bg-accent border-accent/80 text-accent-foreground ring-2 ring-offset-background ring-accent cursor-pointer shadow-md scale-105 z-10";
      ariaLabel += " (Selected)";
      content = <Armchair size={16} className="stroke-current" />; // Use icon for selected
      break;
    case "booked":
      stateClasses =
        "bg-secondary/40 border-secondary/50 text-muted-foreground/50 cursor-not-allowed opacity-70";
      content = <X size={16} className="stroke-current" />; // Use X icon for booked
      ariaLabel += " (Booked)";
      break;
  }

  return (
    <button
      key={id}
      onClick={() =>
        (status === "available" || status === "selected") && onClick(id)
      }
      disabled={status === "booked"}
      className={cn(baseClasses, stateClasses)}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      title={id} // Show full ID on hover
    >
      {content}
    </button>
  );
};

// *** New Hall Layout Component ***
const InteractiveSeatLayout = ({
  selectedSeats,
  onSeatSelect,
  bookedSeats = [],
}: {
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  bookedSeats?: string[];
}) => {
  // Define sections and their layout
  // Example: Orchestra (slightly curved), Mezzanine (straight)
  const sections = {
    orchestraLeft: {
      rows: ["A", "B", "C", "D"],
      seatsPerRow: 6,
      offset: 0,
      curve: -5,
    },
    orchestraCenter: {
      rows: ["A", "B", "C", "D", "E"],
      seatsPerRow: 10,
      offset: 6,
      curve: 0,
    },
    orchestraRight: {
      rows: ["A", "B", "C", "D"],
      seatsPerRow: 6,
      offset: 16,
      curve: 5,
    },
    mezzanineLeft: {
      rows: ["F", "G", "H"],
      seatsPerRow: 8,
      offset: 0,
      curve: 0,
    },
    mezzanineRight: {
      rows: ["F", "G", "H"],
      seatsPerRow: 8,
      offset: 12,
      curve: 0,
    }, // Adjust offset based on layout
  };

  const getStatus = (seatId: string): "available" | "booked" | "selected" => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  // Legend Component (reusable)
  const LegendItem = ({
    status,
    label,
  }: {
    status: "available" | "selected" | "booked";
    label: string;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      <Seat id="" status={status} onClick={() => {}} isSelected={false} />
      <span>{label}</span>
    </div>
  );

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
        <CardDescription>
          Choose your preferred seats from the layout below.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 bg-background rounded-b-md">
        {/* Wrap the seat layout in ScrollArea */}
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex flex-col items-center gap-8 min-w-[700px]">
            {" "}
            {/* Set min-width */}
            {/* STAGE Representation */}
            <div className="w-3/4 h-12 bg-gradient-to-b from-foreground/90 to-foreground/70 text-background text-center rounded-b-xl mb-4 flex items-center justify-center font-semibold shadow-inner tracking-widest text-lg">
              STAGE
            </div>
            {/* Orchestra Section */}
            <div className="w-full flex justify-center gap-4 md:gap-8 mb-8">
              {/* Orchestra Left */}
              <div
                className="flex flex-col items-end"
                style={{
                  transform: `perspective(500px) rotateY(${sections.orchestraLeft.curve}deg)`,
                }}
              >
                {sections.orchestraLeft.rows.map((row) => (
                  <div key={`orch-left-${row}`} className="flex gap-1 mb-1">
                    {Array.from({
                      length: sections.orchestraLeft.seatsPerRow,
                    }).map((_, i) => {
                      const seatNum = i + 1;
                      const seatId = `${row}${seatNum}`;
                      const status = getStatus(seatId);
                      return (
                        <Seat
                          key={seatId}
                          id={seatId}
                          status={status}
                          isSelected={selectedSeats.includes(seatId)}
                          onClick={onSeatSelect}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              {/* Orchestra Center */}
              <div className="flex flex-col items-center">
                {sections.orchestraCenter.rows.map((row) => (
                  <div key={`orch-center-${row}`} className="flex gap-1 mb-1">
                    {Array.from({
                      length: sections.orchestraCenter.seatsPerRow,
                    }).map((_, i) => {
                      const seatNum =
                        sections.orchestraLeft.seatsPerRow + i + 1; // Adjust numbering
                      const seatId = `${row}${seatNum}`;
                      const status = getStatus(seatId);
                      return (
                        <Seat
                          key={seatId}
                          id={seatId}
                          status={status}
                          isSelected={selectedSeats.includes(seatId)}
                          onClick={onSeatSelect}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              {/* Orchestra Right */}
              <div
                className="flex flex-col items-start"
                style={{
                  transform: `perspective(500px) rotateY(${sections.orchestraRight.curve}deg)`,
                }}
              >
                {sections.orchestraRight.rows.map((row) => (
                  <div key={`orch-right-${row}`} className="flex gap-1 mb-1">
                    {Array.from({
                      length: sections.orchestraRight.seatsPerRow,
                    }).map((_, i) => {
                      const seatNum =
                        sections.orchestraLeft.seatsPerRow +
                        sections.orchestraCenter.seatsPerRow +
                        i +
                        1; // Adjust numbering
                      const seatId = `${row}${seatNum}`;
                      const status = getStatus(seatId);
                      return (
                        <Seat
                          key={seatId}
                          id={seatId}
                          status={status}
                          isSelected={selectedSeats.includes(seatId)}
                          onClick={onSeatSelect}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            {/* Aisle */}
            <div className="h-8 w-full"></div>
            {/* Mezzanine Section */}
            <div className="w-full flex justify-center gap-4 md:gap-16">
              {/* Mezzanine Left */}
              <div className="flex flex-col items-center">
                <Label className="mb-2 text-xs text-muted-foreground">
                  Mezzanine Left
                </Label>
                {sections.mezzanineLeft.rows.map((row) => (
                  <div key={`mezz-left-${row}`} className="flex gap-1 mb-1">
                    {Array.from({
                      length: sections.mezzanineLeft.seatsPerRow,
                    }).map((_, i) => {
                      const seatNum = i + 1;
                      const seatId = `${row}${seatNum}`;
                      const status = getStatus(seatId);
                      return (
                        <Seat
                          key={seatId}
                          id={seatId}
                          status={status}
                          isSelected={selectedSeats.includes(seatId)}
                          onClick={onSeatSelect}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              {/* Mezzanine Right */}
              <div className="flex flex-col items-center">
                <Label className="mb-2 text-xs text-muted-foreground">
                  Mezzanine Right
                </Label>
                {sections.mezzanineRight.rows.map((row) => (
                  <div key={`mezz-right-${row}`} className="flex gap-1 mb-1">
                    {Array.from({
                      length: sections.mezzanineRight.seatsPerRow,
                    }).map((_, i) => {
                      const seatNum =
                        sections.mezzanineLeft.seatsPerRow + i + 1; // Adjust numbering
                      const seatId = `${row}${seatNum}`;
                      const status = getStatus(seatId);
                      return (
                        <Seat
                          key={seatId}
                          id={seatId}
                          status={status}
                          isSelected={selectedSeats.includes(seatId)}
                          onClick={onSeatSelect}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />{" "}
          {/* Add horizontal scrollbar */}
        </ScrollArea>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-10 border-t pt-4 w-full">
          <LegendItem status="available" label="Available" />
          <LegendItem status="selected" label="Selected" />
          <LegendItem status="booked" label="Booked" />
        </div>
      </CardContent>
    </Card>
  );
};
// *** End New Layout Component ***

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const { toast } = useToast(); // Moved toast hook call here
  const showId = params.showId as string;

  const [show, setShow] = useState<DramaShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(
    null
  );
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  // Placeholder: More realistic booked seats for a larger hall
  const [bookedSeatsForSchedule, setBookedSeatsForSchedule] = useState<
    string[]
  >([
    "A3",
    "A4",
    "B5",
    "B6",
    "C1",
    "C12",
    "D8",
    "D9",
    "D10",
    "E5",
    "E6",
    "E7",
    "B2",
    "F1",
    "F8",
    "G3",
    "G4",
    "G12",
    "H7",
    "H8",
  ]);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false); // Flag for success toast

  const ticketPrice = 50; // Placeholder price
  const maxSeatsPerBooking = 5; // Example restriction

  // Effect to show success toast on mount if param exists
  useEffect(() => {
    let isMounted = true; // Flag to prevent state update on unmounted component
    if (searchParams?.get("success") === "true" && !hasShownSuccessToast) {
      // Use requestAnimationFrame to defer the toast call slightly
      requestAnimationFrame(() => {
        if (isMounted) {
          toast({
            title: "Booking Successful!",
            description:
              "Your booking details are listed below. An e-ticket has been sent to your email.",
            variant: "default",
            duration: 5000,
          });
          setHasShownSuccessToast(true); // Set flag to prevent re-showing
        }
      });
      // Optional: Clean the URL query param - safer in useEffect
      const currentPath = window.location.pathname;
      // Use router.replace with shallow: true if you don't want to trigger navigation events
      // For simple URL cleanup, replaceState is often sufficient
      window.history.replaceState(null, "", currentPath);
    }
    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, hasShownSuccessToast]); // Include flag in dependency

  useEffect(() => {
    async function fetchShow() {
      if (!showId) return; // Exit early if showId is not available
      setIsLoading(true);
      try {
        const fetchedShow = await getDramaShow(showId);
        if (!fetchedShow || fetchedShow.status !== "active") {
          // Added check for null fetchedShow
          toast({
            title: "Booking Not Available",
            description:
              "This show is not currently active for booking or does not exist.",
            variant: "destructive",
          });
          router.push(`/shows`); // Redirect to shows list if show not found or inactive
          return;
        }
        setShow(fetchedShow);
        // Automatically select the first available future schedule
        if (fetchedShow.schedule.length > 0) {
          const now = new Date();
          const futureSchedules = fetchedShow.schedule
            .map((s) => new Date(s))
            .filter((d) => d > now)
            .sort((a, b) => a.getTime() - b.getTime());

          if (futureSchedules.length > 0) {
            setSelectedSchedule(futureSchedules[0].toISOString());
            // Note: Initial fetch of booked seats will happen in the next useEffect
          } else if (fetchedShow.schedule.length > 0) {
            // Fallback if somehow an active show has only past dates (unlikely with status check)
            setSelectedSchedule(fetchedShow.schedule[0]);
          } else {
            toast({
              title: "No Schedule Available",
              description: "There are no upcoming dates for this show.",
              variant: "destructive",
            });
            // Consider redirecting or showing a message if no schedule is found
            // router.push(`/shows/${showId}`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch show details:", error);
        toast({
          title: "Error",
          description: "Could not load show details.",
          variant: "destructive",
        });
        router.push("/shows");
      } finally {
        setIsLoading(false);
      }
    }
    fetchShow();
  }, [showId, router, toast]);

  // Fetch booked seats when schedule changes
  useEffect(() => {
    const fetchSeatsForSelectedSchedule = async () => {
      if (!showId || !selectedSchedule) return;

      // Simulate fetch for demo - make it slightly different based on date
      console.log(
        `Simulating fetch for ${selectedSchedule}, using placeholder booked seats.`
      );
      const dateBasedSeed = new Date(selectedSchedule).getDate();
      let demoBooked = [
        "A3",
        "A4",
        "B5",
        "B6",
        "C1",
        "C12",
        "D8",
        "D9",
        "D10",
        "E5",
        "E6",
        "E7",
        "B2",
        "F1",
        "F8",
        "G3",
        "G4",
        "G12",
        "H7",
        "H8",
      ];
      if (dateBasedSeed % 2 === 0)
        demoBooked = [...demoBooked, "C7", "C8", "G9", "G10"]; // Add more booked seats
      if (dateBasedSeed % 3 === 0)
        demoBooked = [...demoBooked.slice(5), "A1", "A10", "E1", "E15"]; // Change booked seats

      // Ensure booked seats are unique
      setBookedSeatsForSchedule([...new Set(demoBooked)]);
      setSelectedSeats([]); // Clear selected seats when schedule changes
    };

    fetchSeatsForSelectedSchedule();
  }, [selectedSchedule, showId]);

  const handleSeatSelect = useCallback(
    (seatId: string) => {
      setSelectedSeats((prevSelectedSeats) => {
        const isCurrentlySelected = prevSelectedSeats.includes(seatId);
        let newSelectedSeats;

        if (isCurrentlySelected) {
          // Deselect the seat
          newSelectedSeats = prevSelectedSeats.filter((s) => s !== seatId);
        } else {
          // Select the seat if limit not reached
          if (prevSelectedSeats.length >= maxSeatsPerBooking) {
            toast({
              title: "Seat Limit Reached",
              description: `You can select a maximum of ${maxSeatsPerBooking} seats per booking.`,
              variant: "default",
            });
            return prevSelectedSeats; // Return current state without adding
          }
          newSelectedSeats = [...prevSelectedSeats, seatId]; // Add the new seat
        }
        return newSelectedSeats.sort(); // Return the sorted updated list
      });
    },
    [maxSeatsPerBooking, toast]
  );

  const handleApplyDiscount = async () => {
    if (!discountCode) return;
    setIsApplyingDiscount(true);
    setAppliedDiscount(null); // Reset previous discount first
    try {
      const fetchedDiscount = await getDiscountCode(discountCode);
      if (fetchedDiscount) {
        setAppliedDiscount(fetchedDiscount);
        toast({
          title: "Discount Applied",
          description: `${fetchedDiscount.discountPercentage}% off!`,
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "The discount code entered is not valid.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error applying discount code:", error);
      toast({
        title: "Error",
        description: "Could not apply discount code.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const calculateTotal = useCallback(() => {
    const subtotal = selectedSeats.length * ticketPrice;
    const discountAmount = appliedDiscount
      ? (subtotal * appliedDiscount.discountPercentage) / 100
      : 0;
    return subtotal - discountAmount;
    // Recalculate only when selected seats or discount change
  }, [selectedSeats.length, appliedDiscount, ticketPrice]); // Depend on length for recalculation trigger

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedSchedule) {
      toast({
        title: "No Schedule Selected",
        description: "Please select a date and time.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    // --- Placeholder for actual booking logic ---
    console.log("Booking Details:", {
      showId: show?.id,
      showTitle: show?.title,
      schedule: selectedSchedule,
      seats: selectedSeats,
      discount: appliedDiscount?.code,
      totalPrice: calculateTotal(),
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // On Success: Redirect with success flag
    router.push(`/bookings?success=true`);

    // --- End Placeholder ---
    // No need to set isBooking(false) on success because we redirect
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-16 text-destructive">
        Show not found or booking is not available.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Show Details
      </Button>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
        {show.title} - Ticket Booking
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Seat Selection & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>
                Choose your desired performance date and time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedSchedule}
                onValueChange={setSelectedSchedule} // Resets selected seats via useEffect
                disabled={
                  show.schedule.filter((s) => new Date(s) > new Date())
                    .length <= 1
                } // Disable if only one or zero future dates
              >
                <SelectTrigger className="w-full md:w-2/3">
                  <SelectValue placeholder="Select a date and time" />
                </SelectTrigger>
                <SelectContent>
                  {show.schedule
                    .map((s) => new Date(s)) // Convert to Date objects
                    .filter((d) => d > new Date()) // Filter out past dates
                    .sort((a, b) => a.getTime() - b.getTime()) // Sort dates
                    .map((date, index) => (
                      <SelectItem key={index} value={date.toISOString()}>
                        {format(date, "eeee, MMM d, yyyy - h:mm a")}
                      </SelectItem>
                    ))}
                  {show.schedule.filter((s) => new Date(s) > new Date())
                    .length === 0 && (
                    <SelectItem value="" disabled>
                      No upcoming dates
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* *** USE THE NEW LAYOUT COMPONENT *** */}
          <InteractiveSeatLayout
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
            bookedSeats={bookedSeatsForSchedule}
          />
          {/* *** END NEW LAYOUT COMPONENT *** */}
        </div>

        {/* Right Side: Summary & Payment */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Show
                </Label>
                <p className="font-semibold">{show.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Date & Time
                </Label>
                <p className="font-semibold">
                  {selectedSchedule
                    ? format(
                        new Date(selectedSchedule),
                        "eeee, MMM d, yyyy - h:mm a"
                      )
                    : "Please select a date"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Selected Seats ({selectedSeats.length})
                </Label>
                {selectedSeats.length > 0 ? (
                  <p className="font-semibold break-words">
                    {[...selectedSeats].join(", ")}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No seats selected
                  </p>
                )}
              </div>
              <Separator />
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Label htmlFor="discount">Discount Code</Label>
                  <Input
                    id="discount"
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) =>
                      setDiscountCode(e.target.value.toUpperCase())
                    }
                    disabled={isApplyingDiscount}
                  />
                </div>
                <Button
                  onClick={handleApplyDiscount}
                  disabled={!discountCode || isApplyingDiscount}
                  size="icon"
                  variant="outline"
                  aria-label="Apply Discount"
                >
                  {isApplyingDiscount ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Tag className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {appliedDiscount && (
                <p className="text-sm text-green-600 font-medium">
                  Applied "{appliedDiscount.code}" (
                  {appliedDiscount.discountPercentage}% off)
                </p>
              )}

              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({selectedSeats.length} x ${ticketPrice.toFixed(2)}
                    )
                  </span>
                  <span>
                    ${(selectedSeats.length * ticketPrice).toFixed(2)}
                  </span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount ({appliedDiscount.discountPercentage}%)
                    </span>
                    <span>
                      -$
                      {(
                        (selectedSeats.length *
                          ticketPrice *
                          appliedDiscount.discountPercentage) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                {/* Add Fees if applicable */}
                {/* <div className="flex justify-between"><span>Booking Fee</span><span>$2.00</span></div> */}
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold text-primary">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                onClick={handleBooking}
                disabled={
                  selectedSeats.length === 0 || !selectedSchedule || isBooking
                }
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <Ticket className="mr-2 h-5 w-5" /> Proceed to Payment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
