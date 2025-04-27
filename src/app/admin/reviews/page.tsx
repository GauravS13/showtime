"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StarRating from "@/components/ui/star-rating";
import { useToast } from "@/hooks/use-toast";
import type { Review } from "@/services/review-service";
import { Loader2, ThumbsDown, Trash2 } from "lucide-react";

// --- Placeholder Services ---
async function fetchAdminReviews(filters: {
  showId?: string;
  rating?: number;
}): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const now = Date.now();
  const allReviews: Review[] = [
    {
      id: "rev1",
      showId: "123",
      userId: "user1",
      userName: "Alice",
      userAvatar: "https://picsum.photos/seed/alice/100",
      rating: 5,
      comment: "Absolutely fantastic performance! A must-see.",
      createdAt: new Date(now - 86400000 * 2).toISOString(),
      likes: 15,
    },
    {
      id: "rev2",
      showId: "123",
      userId: "user2",
      userName: "Bob",
      rating: 4,
      comment:
        "Great show, enjoyed the story and acting. The venue was comfortable too.",
      createdAt: new Date(now - 86400000 * 1).toISOString(),
      likes: 8,
    },
    {
      id: "rev3",
      showId: "789",
      userId: "user3",
      userName: "Charlie",
      rating: 3,
      comment: "It was okay, had a few laughs but expected more.",
      createdAt: new Date(now - 86400000 * 35).toISOString(),
    },
    {
      id: "rev4",
      showId: "456",
      userId: "user1",
      userName: "Alice",
      rating: 2,
      comment:
        "Disappointing plot, felt very predictable. Not worth the price.",
      createdAt: new Date(now - 86400000 * 5).toISOString(),
    },
    {
      id: "rev5",
      showId: "123",
      userId: "user5",
      userName: "Eve",
      rating: 5,
      comment:
        "Incredible set design and powerful performances. Highly recommend!",
      createdAt: new Date(now - 86400000 * 3).toISOString(),
      likes: 20,
    },
    {
      id: "rev6",
      showId: "456",
      userId: "user6",
      userName: "Frank",
      rating: 1,
      comment:
        "Terrible! Walked out halfway through. Complete waste of time and money.",
      createdAt: new Date(now - 86400000 * 6).toISOString(),
    },
  ];

  let filtered = allReviews;
  if (filters.showId && filters.showId !== "all")
    filtered = filtered.filter((r) => r.showId === filters.showId);
  if (filters.rating && filters.rating > 0)
    filtered = filtered.filter((r) => r.rating === filters.rating);

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function deleteReview(reviewId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return true;
}

async function blockComment(reviewId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}

async function fetchAllShows(): Promise<{ id: string; title: string }[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: "123", title: "Sample Drama" },
    { id: "456", title: "Another Drama" },
    { id: "789", title: "Past Comedy Show" },
    { id: "101", title: "Cancelled Mystery" },
    { id: "112", title: "Upcoming Musical" },
  ];
}
// --- End Services ---

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showsList, setShowsList] = useState<{ id: string; title: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("0");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedReviews, fetchedShows] = await Promise.all([
        fetchAdminReviews({
          showId: showFilter,
          rating: parseInt(ratingFilter),
        }),
        fetchAllShows(),
      ]);
      setReviews(fetchedReviews);
      setShowsList(fetchedShows);
    } catch {
      setError("Could not load reviews. Please try again later.");
      toast({
        title: "Error",
        description: "Could not load reviews.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showFilter, ratingFilter]);

  const handleDelete = async (id: string, userName: string) => {
    if (!confirm(`Delete review by "${userName}"?`)) return;
    setActionLoading(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast({
        title: "Review Deleted",
        description: `Removed review by ${userName}.`,
      });
    } catch {
      toast({
        title: "Delete Failed",
        description: "Could not delete review.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (id: string, userName: string) => {
    if (!confirm(`Block comment by "${userName}"?`)) return;
    setActionLoading(id);
    try {
      await blockComment(id);
      toast({
        title: "Comment Blocked",
        description: `Blocked comment by ${userName}.`,
      });
    } catch {
      toast({
        title: "Block Failed",
        description: "Could not block comment.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const badgeVariant = (status: Review["status"]) => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">
        Moderate Reviews
      </h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={showFilter} onValueChange={setShowFilter}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Filter by Show" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shows</SelectItem>
            {showsList.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r} Star{r > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>View and moderate user comments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews match your filters.
            </p>
          ) : (
            reviews.map((rev) => (
              <Card
                key={rev.id}
                className="relative group hover:bg-muted/30 transition-colors"
              >
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDelete(rev.id, rev.userName)}
                    disabled={actionLoading === rev.id}
                    aria-label={`Delete review by ${rev.userName}`}
                  >
                    {actionLoading === rev.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleBlock(rev.id, rev.userName)}
                    disabled={actionLoading === rev.id}
                    aria-label={`Block comment by ${rev.userName}`}
                  >
                    {actionLoading === rev.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardHeader className="flex items-start justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          rev.userAvatar ||
                          `https://picsum.photos/seed/${rev.userId}/100`
                        }
                        alt={rev.userName}
                      />
                      <AvatarFallback>{rev.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {rev.userName}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Reviewed{" "}
                        <span className="font-medium text-foreground">
                          {showsList.find((s) => s.id === rev.showId)?.title ||
                            rev.showId}
                        </span>{" "}
                        on {format(new Date(rev.createdAt), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} readOnly size={16} />
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{rev.comment}</p>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
