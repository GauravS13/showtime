// TODO: Replace with actual data fetching and mutation logic (e.g., Firebase Firestore, API calls)

/**
 * Represents a review for a drama show.
 */
export interface Review {
  id: string;
  showId: string;
  userId: string; // ID of the user who wrote the review
  userName: string; // Name of the user
  userAvatar?: string; // Optional avatar URL
  rating: number; // Rating out of 5
  comment: string;
  createdAt: string; // ISO date string
  likes?: number; // Optional: Number of likes/helpful votes
}

/**
 * Represents the data needed to submit a new review.
 */
export interface NewReviewData {
  showId: string;
  rating: number;
  comment: string;
  // userId should be inferred from the authenticated user server-side
}

export interface ShowTitle {
  id: string;
  title: string;
}

// --- Helper function to generate dummy reviews ---
const randomUserNames = [
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
];
const randomComments = [
  "Absolutely fantastic performance! A must-see.",
  "Great show, enjoyed the story and acting. The venue was comfortable too.",
  "It was okay, had a few laughs but expected more.",
  "Disappointing plot, felt very predictable. Not worth the price.",
  "Incredible set design and powerful performances. Highly recommend!",
  "Terrible! Walked out halfway through. Complete waste of time and money.",
  "A solid performance, but nothing groundbreaking.",
  "The lead actor was phenomenal!",
  "Some technical issues, but the story was engaging.",
  "Good value for money. Entertaining evening.",
  "A bit slow in the first act, but picked up later.",
  "Loved the costumes and music.",
  "Not my cup of tea, but well-produced.",
  "Funny and heartwarming.",
  "Thought-provoking and moving.",
];

const generateDummyReviews = (count: number, showIds: string[]): Review[] => {
  const reviews: Review[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const showId = showIds[i % showIds.length];
    const userId = `user${(i % randomUserNames.length) + 1}`;
    const userName = randomUserNames[i % randomUserNames.length];
    const rating = Math.floor(Math.random() * 5) + 1; // 1 to 5 stars
    const comment =
      randomComments[i % randomComments.length] + ` (Review ${i})`;
    const createdAt = new Date(
      now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000
    ).toISOString(); // Within last 60 days
    const likes = Math.floor(Math.random() * 30);

    reviews.push({
      id: `rev_${i.toString().padStart(3, "0")}`,
      showId: showId,
      userId: userId,
      userName: userName,
      userAvatar: `https://picsum.photos/seed/${userId}/100`,
      rating: rating,
      comment: comment,
      createdAt: createdAt,
      likes: likes,
    });
  }
  return reviews;
};

// Generate reviews based on a subset of show IDs (e.g., first 10 shows)
const dummyShowIdsForReviews = Array.from(
  { length: 10 },
  (_, i) => `show_${(i + 1).toString().padStart(3, "0")}`
);
const allDummyReviews = generateDummyReviews(30, dummyShowIdsForReviews);

/**
 * Asynchronously retrieves reviews for a given show ID (for public view).
 *
 * @param showId The ID of the drama show to retrieve reviews for.
 * @returns A promise that resolves to an array of Review objects.
 */
export async function getReviewsForShow(showId: string): Promise<Review[]> {
  console.log(`Fetching reviews for show ${showId}...`);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const showReviews = allDummyReviews.filter(
    (review) => review.showId === showId
  );
  return showReviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Asynchronously retrieves reviews for the admin panel, allowing filtering.
 * Also returns a list of unique show titles that have reviews.
 *
 * @param filters Filters for showId and rating.
 * @returns A promise that resolves to an object containing reviews and show titles.
 */
export async function getReviewsForShowAdmin(filters: {
  showId?: string;
  rating?: number;
}): Promise<{ reviews: Review[]; shows: ShowTitle[] }> {
  console.log("Fetching admin reviews with filters:", filters);
  await new Promise((resolve) => setTimeout(resolve, 400));

  let filteredReviews = allDummyReviews;

  if (filters.showId && filters.showId !== "all") {
    filteredReviews = filteredReviews.filter(
      (r) => r.showId === filters.showId
    );
  }
  if (filters.rating && filters.rating > 0) {
    filteredReviews = filteredReviews.filter(
      (r) => r.rating === filters.rating
    );
  }

  // Extract unique show IDs and titles from the full dummy review set
  const reviewedShowIds = new Set(allDummyReviews.map((r) => r.showId));
  const showTitles: ShowTitle[] = Array.from(reviewedShowIds)
    .map((id) => {
      // Find a review for this show to get the title (or fetch from show service ideally)
      const reviewForShow = allDummyReviews.find((r) => r.showId === id);
      // In a real app, fetch show title from ticket service if needed
      return {
        id: id,
        title: reviewForShow ? `Show Title for ${id}` : `Unknown Show ${id}`,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    reviews: filteredReviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    shows: showTitles,
  };
}

/**
 * Asynchronously submits a new review.
 *
 * @param reviewData The data for the new review.
 * @returns A promise that resolves to the newly created Review object (or null/throws error on failure).
 */
export async function submitReview(
  reviewData: NewReviewData
): Promise<Review | null> {
  // TODO: Add authentication check server-side before proceeding
  // TODO: Validate reviewData server-side

  console.log(`Submitting review for show ${reviewData.showId}...`, reviewData);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // --- Placeholder Logic ---
  // Assume success and return a mock review object
  const newReview: Review = {
    id: `rev_${Date.now()}`, // Generate a temporary ID
    showId: reviewData.showId,
    userId: "currentUser123", // Replace with actual logged-in user ID
    userName: "Current User", // Replace with actual user name
    userAvatar: "https://picsum.photos/seed/currentuser/100", // Replace with actual avatar
    rating: reviewData.rating,
    comment: reviewData.comment,
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  console.log("Review submitted successfully (simulated):", newReview);
  // Add to our dummy data list for persistence in this session (optional)
  allDummyReviews.unshift(newReview);
  return newReview;

  // Example Failure:
  // console.error("Failed to submit review (simulated)");
  // throw new Error("Could not submit review."); // Or return null
  // --- End Placeholder ---
}
