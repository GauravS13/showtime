import ShowCard from '@/components/shows/show-card';
import { getActiveAndUpcomingShows, type DramaShow } from '@/services/ticket-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

// Server component to fetch data initially
export default async function ShowsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const allShows: DramaShow[] = await getActiveAndUpcomingShows();

    // Basic filtering based on searchParams (can be expanded)
    const statusFilter = searchParams?.status as string | undefined;
    const genreFilter = searchParams?.genre as string | undefined;
    const searchQuery = searchParams?.q as string | undefined;

    let filteredShows = allShows;

    if (statusFilter && statusFilter !== 'all') {
      filteredShows = filteredShows.filter(show => show.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (genreFilter && genreFilter !== 'all') {
        filteredShows = filteredShows.filter(show => show.genre.toLowerCase() === genreFilter.toLowerCase());
    }

     if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredShows = filteredShows.filter(show =>
          show.title.toLowerCase().includes(lowerQuery) ||
          show.genre.toLowerCase().includes(lowerQuery) ||
          show.cast.some(actor => actor.toLowerCase().includes(lowerQuery)) ||
          show.description.toLowerCase().includes(lowerQuery)
        );
      }


    const uniqueGenres = Array.from(new Set(allShows.map(show => show.genre)));


  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Discover Shows
        </h1>
        {/* Simple Search and Filter Placeholder */}
         <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <div className="relative flex-grow">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input
               type="search"
               name="q"
               placeholder="Search shows..."
               className="pl-10 w-full"
               defaultValue={searchQuery}
             />
           </div>
           <div className="flex gap-2 w-full sm:w-auto">
                <Select name="genre" defaultValue={genreFilter ?? "all"}>
                  <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by genre">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {uniqueGenres.map(genre => (
                        <SelectItem key={genre} value={genre.toLowerCase()}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select name="status" defaultValue={statusFilter ?? "all"}>
                 <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status">
                   <SelectValue placeholder="Status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Statuses</SelectItem>
                   <SelectItem value="active">Active</SelectItem>
                   <SelectItem value="upcoming">Upcoming</SelectItem>
                   <SelectItem value="ended">Ended</SelectItem>
                 </SelectContent>
               </Select>
            </div>

           <Button type="submit" className="w-full sm:w-auto">
             <Filter className="mr-2 h-4 w-4" /> Filter
           </Button>
         </form>
      </section>

      <Separator />

      {filteredShows.length > 0 ? (
         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredShows.map((show) => (
             <ShowCard key={show.id} show={show} />
           ))}
         </section>
      ) : (
        <section className="text-center py-16">
           <h2 className="text-2xl font-semibold text-foreground mb-4">No Shows Found</h2>
           <p className="text-muted-foreground">
             We couldn't find any shows matching your criteria. Try adjusting your filters or search.
           </p>
        </section>
      )}
    </div>
  );
}
