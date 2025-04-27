"use client";

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
import { useToast } from "@/hooks/use-toast";
import type { DramaShow } from "@/services/ticket-service"; // Import DramaShow type for reference
import { Heart, Info, Loader2, Ticket, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the structure of a wishlisted show (can reuse DramaShow or create specific type)
interface WishlistedShow {
  id: string;
  title: string;
  imageUrl: string;
  genre: string;
  status: DramaShow["status"]; // Reuse status from DramaShow
  venue: string;
}

// --- Placeholder for Wishlist Service ---
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
];
const randomGenres = [
  "Drama",
  "Comedy",
  "Thriller",
  "Musical",
  "Mystery",
  "Historical",
  "Sci-Fi",
  "Romance",
];
const randomStatuses: WishlistedShow["status"][] = [
  "active",
  "upcoming",
  "ended",
  "closed",
  "active",
  "upcoming",
]; // More active/upcoming
const randomVenues = [
  "Main Hall",
  "Grand Theatre",
  "Studio B",
  "Opera House",
  "The Black Box",
  "Amphitheatre",
  "Civic Center",
  "Royal Hall",
];

const generateDummyWishlist = (count: number): WishlistedShow[] => {
  const wishlist: WishlistedShow[] = [];
  const usedIds = new Set<string>();

  while (wishlist.length < count) {
    const idNum = Math.floor(Math.random() * 50) + 1; // Assume shows exist up to show_050
    const showId = `show_${idNum.toString().padStart(3, "0")}`;
    if (usedIds.has(showId)) continue; // Ensure unique shows in wishlist

    usedIds.add(showId);
    const showIndex = idNum % randomShowTitles.length;
    const genreIndex = idNum % randomGenres.length;
    const venueIndex = idNum % randomVenues.length;
    const statusIndex = idNum % randomStatuses.length;

    wishlist.push({
      id: showId,
      title: randomShowTitles[showIndex],
      imageUrl: `https://picsum.photos/seed/${showId}/300/200`,
      genre: randomGenres[genreIndex],
      status: randomStatuses[statusIndex],
      venue: randomVenues[venueIndex],
    });
  }
  return wishlist;
};

let allDummyWishlistItems = generateDummyWishlist(20); // Initial generation

async function fetchWishlist(): Promise<WishlistedShow[]> {
  // Replace with your actual API call to fetch user's wishlist
  console.log("Fetching wishlist...");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay shorter
  // Return the current state of the dummy wishlist
  return [...allDummyWishlistItems].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

async function removeFromWishlist(showId: string): Promise<boolean> {
  // Replace with actual API call
  console.log(`Removing show ${showId} from wishlist...`);
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay shorter
  const initialLength = allDummyWishlistItems.length;
  allDummyWishlistItems = allDummyWishlistItems.filter(
    (item) => item.id !== showId
  );
  return allDummyWishlistItems.length < initialLength; // Return true if an item was removed
}
// --- End Placeholder ---

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistedShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Add authentication check here. Redirect if not logged in.
        const fetchedWishlist = await fetchWishlist();
        setWishlist(fetchedWishlist);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        setError("Could not load your wishlist. Please try again later.");
        toast({
          title: "Error",
          description: "Could not load wishlist.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [toast]);

  const handleRemove = async (showId: string) => {
    setRemovingItemId(showId);
    try {
      const success = await removeFromWishlist(showId);
      if (success) {
        // Update state immediately for responsiveness
        setWishlist((prev) => prev.filter((item) => item.id !== showId));
        toast({
          title: "Removed",
          description: "Show removed from your wishlist.",
        });
      } else {
        throw new Error("Failed to remove from API or item not found");
      }
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
      toast({
        title: "Error",
        description: "Could not remove show from wishlist.",
        variant: "destructive",
      });
    } finally {
      setRemovingItemId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 hover:bg-green-600";
      case "upcoming":
        return "bg-blue-500 hover:bg-blue-600";
      case "closed":
      case "ended":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-secondary hover:bg-secondary/80";
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
        <Heart className="h-7 w-7" /> My Wishlist
      </h1>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading your wishlist...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Loading Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && wishlist.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Your Wishlist is Empty</CardTitle>
            <CardDescription>
              Save shows you're interested in to easily find them later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/shows">Discover Shows</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && wishlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((show) => (
            <Card
              key={show.id}
              className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg h-full relative group"
            >
              {/* Remove Button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(show.id)}
                disabled={removingItemId === show.id}
                aria-label={`Remove ${show.title} from wishlist`}
              >
                {removingItemId === show.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>

              <CardHeader className="p-0 relative">
                <Link href={`/shows/${show.id}`}>
                  <Image
                    src={show.imageUrl}
                    alt={`${show.title} poster`}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <Badge
                  className={`absolute top-2 left-2 text-white ${getStatusColor(
                    show.status
                  )}`}
                >
                  {show.status.charAt(0).toUpperCase() + show.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">
                  <Link
                    href={`/shows/${show.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {show.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">
                  {show.genre}
                </CardDescription>
                <div className="text-sm text-muted-foreground">
                  {show.venue}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t mt-auto flex gap-2">
                <Button asChild className="flex-1" variant="outline" size="sm">
                  <Link href={`/shows/${show.id}`}>
                    <Info className="mr-1.5 h-4 w-4" /> Details
                  </Link>
                </Button>
                {show.status === "active" && (
                  <Button asChild className="flex-1" size="sm">
                    <Link href={`/shows/${show.id}/book`}>
                      <Ticket className="mr-1.5 h-4 w-4" /> Book Now
                    </Link>
                  </Button>
                )}
                {show.status === "upcoming" && (
                  <Button className="flex-1" size="sm" disabled>
                    <Ticket className="mr-1.5 h-4 w-4" /> Soon
                  </Button>
                )}
                {(show.status === "ended" || show.status === "closed") && (
                  <Button
                    className="flex-1"
                    size="sm"
                    disabled
                    variant="secondary"
                  >
                    Ended
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
