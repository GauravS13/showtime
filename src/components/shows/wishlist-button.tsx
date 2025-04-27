'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface WishlistButtonProps {
  showId: string;
  initialIsWishlisted?: boolean;
  isLoggedIn: boolean; // Pass login status
  className?: string;
}

// --- Placeholder for Wishlist API ---
async function addToWishlist(showId: string): Promise<boolean> {
  console.log(`Adding show ${showId} to wishlist...`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  // throw new Error("Simulated API error"); // Uncomment to test error case
  return true; // Assume success
}

async function removeFromWishlist(showId: string): Promise<boolean> {
  console.log(`Removing show ${showId} from wishlist...`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return true; // Assume success
}
// --- End Placeholder ---

const WishlistButton: React.FC<WishlistButtonProps> = ({
  showId,
  initialIsWishlisted = false,
  isLoggedIn,
  className,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleClick = () => {
    if (!isLoggedIn) {
        toast({
            title: "Login Required",
            description: "Please login to add shows to your wishlist.",
            variant: "destructive",
            // Optional: Add action to redirect to login
            // action: <ToastAction altText="Login" onClick={() => router.push('/login')}>Login</ToastAction>,
        });
        return;
    }

    startTransition(async () => {
      try {
        if (isWishlisted) {
          const success = await removeFromWishlist(showId);
          if (success) {
            setIsWishlisted(false);
            toast({ description: "Removed from wishlist." });
          } else {
             throw new Error("Failed to remove");
          }
        } else {
          const success = await addToWishlist(showId);
           if (success) {
            setIsWishlisted(true);
            toast({ description: "Added to wishlist!" });
           } else {
             throw new Error("Failed to add");
           }
        }
      } catch (error) {
        console.error("Wishlist action failed:", error);
        toast({
          title: "Error",
          description: `Could not ${isWishlisted ? 'remove from' : 'add to'} wishlist. Please try again.`,
          variant: "destructive",
        });
         // Optional: Revert state on error
         // setIsWishlisted(prev => !prev);
      }
    });
  };

  return (
    <Button
      variant="outline"
      className={cn("w-full", className)}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isWishlisted} // Indicate state for accessibility
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={cn(
            "mr-2 h-4 w-4 transition-colors",
            isWishlisted ? "text-red-500 fill-red-500" : "text-muted-foreground"
          )}
        />
      )}
      {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </Button>
  );
};

export default WishlistButton;
