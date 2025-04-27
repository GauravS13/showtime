import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ShowCard from '@/components/shows/show-card';
import { getActiveAndUpcomingShows, type DramaShow } from '@/services/ticket-service';
import { ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default async function Home() {
  const shows: DramaShow[] = await getActiveAndUpcomingShows(); // Fetch shows server-side

  // Filter for featured (e.g., high rating or specific status) - simple example
  const featuredShows = shows.filter(show => show.rating >= 4.0).slice(0, 3);
  const upcomingShows = shows.filter(show => show.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-b from-primary/10 to-background rounded-lg shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
          Experience the Magic of Theatre
        </h1>
        <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
          Discover and book tickets for the best drama shows in town. Your next unforgettable experience awaits.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
           <div className="relative w-full">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input
               type="search"
               placeholder="Search for shows, cast, or genres..."
               className="pl-10 w-full"
             />
           </div>
           <Button size="lg" className="w-full sm:w-auto">
             Find Shows
           </Button>
        </div>
         <Button variant="outline" size="lg" asChild>
           <Link href="/shows">
             Browse All Shows <ArrowRight className="ml-2 h-4 w-4" />
           </Link>
         </Button>
      </section>

      {/* Featured Shows Section */}
      {featuredShows.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-foreground">Featured Shows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Shows Section */}
      {upcomingShows.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-foreground">Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
           <div className="text-center mt-8">
             <Button variant="link" asChild>
               <Link href="/shows?status=upcoming">
                 View All Upcoming Shows <ArrowRight className="ml-1 h-4 w-4" />
               </Link>
             </Button>
          </div>
        </section>
      )}

       {/* Call to Action (if no specific sections) */}
       {featuredShows.length === 0 && upcomingShows.length === 0 && (
         <section className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Explore Amazing Shows</h2>
            <p className="text-muted-foreground mb-6">Find the perfect drama for your next outing.</p>
            <Button size="lg" asChild>
              <Link href="/shows">Browse All Shows</Link>
            </Button>
         </section>
       )}
    </div>
  );
}
