/**
 * Represents a drama show.
 */
export interface DramaShow {
  /**
   * The unique identifier for the drama show.
   */
  id: string;
  /**
   * The title of the drama show.
   */
  title: string;
  /**
   * The cast of the drama show.
   */
  cast: string[];
  /**
   * The genre of the drama show.
   */
  genre: string;
  /**
   * The rating of the drama show.
   */
  rating: number;
  /**
   * The description of the drama show.
   */
  description: string;
  /**
   * The status of the drama show (upcoming, active, closed, ended).
   */
  status: "upcoming" | "active" | "closed" | "ended";
  /**
   * The schedule of the drama show (multiple dates/times).
   */
  schedule: string[];
  /**
   * The venue of the drama show.
   */
  venue: string;
}

// Helper function to generate random dates
const getRandomDate = (start: Date, end: Date): string => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

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
const randomStatuses: DramaShow["status"][] = [
  "upcoming",
  "active",
  "closed",
  "ended",
];
const randomVenues = [
  "Main Hall",
  "Grand Theatre",
  "Studio B",
  "Opera House",
  "The Black Box",
  "Amphitheatre",
];
const randomActors = [
  "Alice Ray",
  "Bob Smith",
  "Charlie Green",
  "Diana Fox",
  "Ethan Hunt",
  "Fiona Blue",
  "George Moon",
  "Helen Star",
  "Ian Stone",
  "Julia Sky",
  "Kevin River",
  "Linda Brook",
];
const randomDescriptions = [
  "A gripping tale of betrayal and redemption.",
  "A hilarious journey through modern life.",
  "A nail-biting thriller that will keep you on the edge of your seat.",
  "A spectacular musical extravaganza with unforgettable songs.",
  "A baffling mystery where everyone is a suspect.",
  "An epic historical drama spanning generations.",
  "A thought-provoking sci-fi adventure to another world.",
  "A heartwarming story of love against all odds.",
  "An intense courtroom drama with shocking twists.",
  "A lighthearted comedy perfect for a night out.",
];

const generateDummyShows = (count: number): DramaShow[] => {
  const shows: DramaShow[] = [];
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const threeMonthsAhead = new Date(
    now.getFullYear(),
    now.getMonth() + 3,
    now.getDate()
  );

  for (let i = 1; i <= count; i++) {
    const status = randomStatuses[i % randomStatuses.length];
    const scheduleBaseDate =
      status === "upcoming"
        ? new Date(
            now.getTime() + (Math.random() * 60 + 7) * 24 * 60 * 60 * 1000
          ) // 7 to 67 days ahead
        : status === "active"
        ? new Date(now.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000) // 0 to 14 days ahead
        : new Date(
            now.getTime() - (Math.random() * 60 + 1) * 24 * 60 * 60 * 1000
          ); // 1 to 61 days ago

    const numSchedules = Math.floor(Math.random() * 3) + 1; // 1 to 3 showtimes
    const schedule = Array.from({ length: numSchedules }, (_, idx) => {
      const date = new Date(scheduleBaseDate);
      date.setDate(date.getDate() + idx * (Math.random() > 0.5 ? 1 : 7)); // Add 1 or 7 days for subsequent shows
      date.setHours(
        19 + Math.floor(Math.random() * 3),
        Math.random() > 0.5 ? 0 : 30
      ); // 7 PM, 7:30 PM, 8 PM, 8:30 PM
      return date.toISOString();
    });

    const numCast = Math.floor(Math.random() * 3) + 2; // 2 to 4 actors
    const cast = Array.from(
      { length: numCast },
      () => randomActors[Math.floor(Math.random() * randomActors.length)]
    );

    shows.push({
      id: `show_${i.toString().padStart(3, "0")}`,
      title: `${randomGenres[i % randomGenres.length]} Show #${i}`,
      cast: [...new Set(cast)], // Ensure unique cast members
      genre: randomGenres[i % randomGenres.length],
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Rating between 3.0 and 5.0
      description:
        randomDescriptions[i % randomDescriptions.length] + ` (Ref: ${i})`,
      status: status,
      schedule: schedule.sort(), // Sort schedules chronologically
      venue: randomVenues[i % randomVenues.length],
    });
  }
  return shows;
};

const allDummyShows = generateDummyShows(25);

/**
 * Asynchronously retrieves drama show details for a given show ID.
 *
 * @param showId The ID of the drama show to retrieve.
 * @returns A promise that resolves to a DramaShow object containing the show details, or null if not found.
 */
export async function getDramaShow(showId: string): Promise<DramaShow | null> {
  console.log(`Fetching show details for ID: ${showId}`);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  const show = allDummyShows.find((s) => s.id === showId);
  return show || null;
}

/**
 * Asynchronously retrieves a list of active and upcoming drama shows.
 *
 * @returns A promise that resolves to an array of DramaShow objects.
 */
export async function getActiveAndUpcomingShows(): Promise<DramaShow[]> {
  console.log("Fetching active and upcoming shows...");
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Filter for active and upcoming shows for the main pages
  return allDummyShows.filter(
    (show) => show.status === "active" || show.status === "upcoming"
  );
}

/**
 * Fetches all shows regardless of status (used for admin panel).
 * Allows basic filtering.
 */
export async function getAllShowsAdmin(filters?: {
  search?: string;
  status?: string;
}): Promise<DramaShow[]> {
  console.log("Fetching all shows for admin with filters:", filters);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = allDummyShows;

  if (filters?.status && filters.status !== "all") {
    filtered = filtered.filter(
      (s) => s.status.toLowerCase() === filters.status?.toLowerCase()
    );
  }
  if (filters?.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.venue.toLowerCase().includes(query) ||
        s.genre.toLowerCase().includes(query) ||
        s.cast.some((actor) => actor.toLowerCase().includes(query))
    );
  }

  return filtered.sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically
}
