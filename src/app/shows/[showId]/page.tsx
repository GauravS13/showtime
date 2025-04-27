import ReviewForm from "@/components/review/review-form";
import ShareButtons from "@/components/shows/share-buttons"; // Import ShareButtons
import WishlistButton from "@/components/shows/wishlist-button"; // Import WishlistButton
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For reviews
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StarRating from "@/components/ui/star-rating"; // Import StarRating
import { getReviewsForShow, type Review } from "@/services/review-service"; // Import review service
import { getDramaShow, type DramaShow } from "@/services/ticket-service";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Ticket,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Placeholder for Auth Check - Replace with actual logic
const checkUserLoggedIn = async (): Promise<boolean> => {
  // Simulate checking auth status
  await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate async check
  return true; // Assume user is logged in for testing purposes
};

export default async function ShowDetailPage({
  params,
}: {
  params: { showId: string };
}) {
  let show: DramaShow | null = null;
  let reviews: Review[] = [];
  let isLoggedIn = false; // Default to false

  try {
    // Fetch show details, reviews, and check auth status in parallel
    [show, reviews, isLoggedIn] = await Promise.all([
      getDramaShow(params.showId),
      getReviewsForShow(params.showId), // Fetch reviews
      checkUserLoggedIn(), // Check if user is logged in
    ]);
  } catch (error) {
    console.error("Failed to fetch show details or reviews:", error);
    // Keep show as null to trigger notFound later if it failed
  }

  if (!show) {
    notFound(); // Render a 404 page if the show isn't found
  }

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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : show.rating; // Fallback to show's base rating if no reviews

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Image, Basic Info, Actions */}
        <div className="md:col-span-1 space-y-6 sticky top-24 self-start">
          <Card className="overflow-hidden shadow-lg">
            <Image
              src={`https://picsum.photos/seed/${show.id}/600/800`}
              alt={`${show.title} Poster`}
              width={600}
              height={800}
              className="w-full h-auto object-cover"
              priority // Prioritize loading the main image
            />
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{show.genre}</Badge>
                <Badge className={`text-white ${getStatusColor(show.status)}`}>
                  {show.status.charAt(0).toUpperCase() + show.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <StarRating rating={averageRating} readOnly size={20} />
                <span className="ml-1 text-sm text-muted-foreground">
                  ({averageRating.toFixed(1)}) ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{show.venue}</span>
              </div>
            </CardContent>
          </Card>
          {show.status === "active" && (
            <Button size="lg" className="w-full" asChild>
              <Link href={`/shows/${show.id}/book`}>
                <Ticket className="mr-2 h-5 w-5" /> Book Tickets Now
              </Link>
            </Button>
          )}
          {show.status === "upcoming" && (
            <Button size="lg" className="w-full" disabled>
              <Calendar className="mr-2 h-5 w-5" /> Coming Soon
            </Button>
          )}
          {/* Wishlist Button */}
          <WishlistButton
            showId={show.id}
            initialIsWishlisted={false}
            isLoggedIn={isLoggedIn}
          />

          {/* Share Buttons */}
          <ShareButtons showTitle={show.title} showUrl={`/shows/${show.id}`} />
        </div>

        {/* Right Column: Details, Schedule, Cast, Reviews */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {show.title}
            </h1>
            <p className="text-lg text-muted-foreground">{show.description}</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Schedule
            </h2>
            {show.schedule.length > 0 ? (
              <div className="space-y-3">
                {show.schedule.map((dateTime, index) => (
                  <div
                    key={index}
                    className="flex items-center flex-wrap gap-x-4 gap-y-1 p-3 border rounded-md bg-card"
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium text-card-foreground">
                        {format(new Date(dateTime), "eeee, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium text-card-foreground">
                        {format(new Date(dateTime), "h:mm a")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Show times are yet to be announced.
              </p>
            )}
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Cast
            </h2>
            <div className="flex flex-wrap gap-3">
              {show.cast.map((actor, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-base px-3 py-1"
                >
                  <Users className="w-4 h-4 mr-1.5" /> {actor}
                </Badge>
              ))}
            </div>
          </section>

          <Separator />

          {/* Reviews Section */}
          <section id="reviews">
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <MessageSquare className="w-6 h-6" /> Reviews & Ratings
            </h2>

            {/* Review Form */}
            <ReviewForm showId={show.id} isLoggedIn={isLoggedIn} />

            {/* Existing Reviews List */}
            <div className="mt-8 space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              review.userAvatar ||
                              `https://picsum.photos/seed/${review.userId}/100`
                            }
                            alt={review.userName}
                          />
                          <AvatarFallback>
                            {review.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-semibold">
                            {review.userName}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {format(new Date(review.createdAt), "MMMM d, yyyy")}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarRating rating={review.rating} readOnly size={16} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-card-foreground">{review.comment}</p>
                    </CardContent>
                    {/* Optional: Add like/helpful button */}
                    {/* <CardFooter className="pt-4 pb-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="mr-2 h-4 w-4" /> Helpful ({review.likes || 0})
                          </Button>
                        </CardFooter> */}
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Be the first to leave a review!
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Optional: Revalidate data periodically
export const revalidate = 3600; // Revalidate every hour
