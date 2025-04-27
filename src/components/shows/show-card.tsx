import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Calendar, MapPin, Users } from 'lucide-react';
import type { DramaShow } from '@/services/ticket-service';
import { format } from 'date-fns'; // For formatting dates

interface ShowCardProps {
  show: DramaShow;
}

export default function ShowCard({ show }: ShowCardProps) {
  const firstScheduleDate = show.schedule.length > 0
    ? format(new Date(show.schedule[0]), 'MMM d, yyyy') // Format the first date
    : 'TBA';

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600'; // Use Tailwind colors directly for status badges
      case 'upcoming':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'closed':
      case 'ended':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-secondary hover:bg-secondary/80';
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg h-full">
      <CardHeader className="p-0 relative">
        {/* Placeholder Image */}
        <Image
          src={`https://picsum.photos/seed/${show.id}/400/250`} // Use show ID for consistent placeholder
          alt={`${show.title} poster`}
          width={400}
          height={250}
          className="w-full h-48 object-cover" // Ensure image covers the area
        />
         <Badge
            className={`absolute top-2 right-2 text-white ${getStatusColor(show.status)}`}
          >
            {show.status.charAt(0).toUpperCase() + show.status.slice(1)}
          </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold mb-1 line-clamp-2">
          <Link href={`/shows/${show.id}`} className="hover:text-primary transition-colors">
            {show.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {show.description}
        </CardDescription>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
             <Badge variant="secondary">{show.genre}</Badge>
             <span className="flex items-center gap-1">
               <Star className="w-4 h-4 text-yellow-500 fill-current" />
               {show.rating.toFixed(1)}
             </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="line-clamp-1">{show.cast.join(', ')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{show.venue}</span>
          </div>
           <div className="flex items-center gap-1.5">
             <Calendar className="w-4 h-4" />
             <span>Starts: {firstScheduleDate}</span>
           </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t mt-auto">
        <Button asChild className="w-full" variant="default">
          <Link href={`/shows/${show.id}/book`}>
            {show.status === 'active' ? 'Book Tickets' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
