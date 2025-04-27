'use client';

import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonsProps {
  showTitle: string;
  showUrl: string; // Relative URL like /shows/[showId]
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ showTitle, showUrl }) => {
  const { toast } = useToast();
  // Ensure we construct the full URL for sharing
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${showUrl}` : showUrl;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(`Check out this show: ${showTitle}`);

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        toast({ description: "Link copied to clipboard!" });
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        toast({ description: "Failed to copy link.", variant: "destructive" });
      });
  };

  const openShareWindow = (url: string) => {
      // Open social share links in a new, smaller window
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
         <Button variant="outline" className="w-full">
           <Share2 className="mr-2 h-4 w-4" /> Share Show
         </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => openShareWindow(twitterShareUrl)} className="flex items-center gap-2 cursor-pointer">
          <Twitter className="h-4 w-4 text-[#1DA1F2]" /> Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(facebookShareUrl)} className="flex items-center gap-2 cursor-pointer">
          <Facebook className="h-4 w-4 text-[#1877F2]" /> Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink} className="flex items-center gap-2 cursor-pointer">
          <LinkIcon className="h-4 w-4" /> Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButtons;
