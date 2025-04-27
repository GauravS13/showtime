"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { DramaShow } from "@/services/ticket-service"; // Re-use type
import { getAllShowsAdmin } from "@/services/ticket-service"; // Import the service function
import { format } from "date-fns";
import {
  Edit,
  Filter,
  Loader2,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- Placeholder for Show Management Service Mutations ---
async function createShow(
  showData: Omit<DramaShow, "id" | "rating">
): Promise<DramaShow> {
  console.log("Creating show:", showData);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newShow: DramaShow = {
    ...showData,
    id: `new_${Date.now()}`,
    rating: 0,
  }; // Assign temporary ID
  console.log("Show created (simulated):", newShow);
  // In real app, return the actual created show from API
  // Should also update the source where getAllShowsAdmin reads from or refetch
  return newShow;
}

async function updateShow(
  showId: string,
  showData: Partial<Omit<DramaShow, "id" | "rating">>
): Promise<DramaShow> {
  console.log(`Updating show ${showId}:`, showData);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In real app, fetch the original, apply updates, send to API, return updated
  const updatedShow = {
    id: showId,
    title: "Updated Title",
    cast: ["Updated Actor"],
    genre: "Updated Genre",
    rating: 4.0,
    description: "Updated Desc",
    status: "active",
    schedule: ["2024-12-01T19:00:00Z"],
    venue: "Updated Venue",
    ...showData, // Apply partial updates
  } as DramaShow;
  // Ensure required fields are still present even if partial update doesn't include them
  if (!updatedShow.cast) updatedShow.cast = [];
  if (!updatedShow.schedule) updatedShow.schedule = [];
  if (!updatedShow.status) updatedShow.status = "closed"; // Default to closed if somehow missing
  if (!updatedShow.venue) updatedShow.venue = "Unknown Venue";
  if (!updatedShow.description) updatedShow.description = "No description";
  if (!updatedShow.genre) updatedShow.genre = "Uncategorized";

  console.log("Show updated (simulated):", updatedShow);
  // Should also update the source where getAllShowsAdmin reads from or refetch
  return updatedShow;
}

async function deleteShow(showId: string): Promise<boolean> {
  console.log(`Deleting show ${showId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Show deleted (simulated)");
  // Should also update the source where getAllShowsAdmin reads from or refetch
  return true; // Assume success
}
// --- End Placeholder Service ---

// Form Schema (Simplified - Use Zod for real validation)
interface ShowFormData {
  title: string;
  description: string;
  genre: string;
  venue: string;
  status: DramaShow["status"]; // Use specific status types
  cast: string; // Comma-separated for simplicity here
  schedule: string; // Comma-separated ISO strings for simplicity
}

export default function AdminShowsPage() {
  const [shows, setShows] = useState<DramaShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // Specific loading state for delete
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<DramaShow | null>(null);
  const { toast } = useToast();

  const fetchAndSetShows = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the imported service function
      const fetchedShows = await getAllShowsAdmin({
        search: searchTerm,
        status: statusFilter,
      });
      setShows(fetchedShows);
    } catch (err) {
      console.error("Failed to load shows:", err);
      setError("Could not load shows. Please try again later.");
      toast({
        title: "Error",
        description: "Could not load shows.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]); // Refetch when status filter changes

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchAndSetShows();
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const data: ShowFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      genre: formData.get("genre") as string,
      venue: formData.get("venue") as string,
      status: formData.get("status") as DramaShow["status"], // Cast to specific type
      cast: formData.get("cast") as string,
      schedule: formData.get("schedule") as string,
    };

    // Basic validation (Replace with Zod)
    if (
      !data.title ||
      !data.description ||
      !data.genre ||
      !data.venue ||
      !data.status
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare payload for API (adjust based on actual API requirements)
    const showPayload: Omit<DramaShow, "id" | "rating"> = {
      title: data.title,
      description: data.description,
      genre: data.genre,
      venue: data.venue,
      status: data.status,
      cast: data.cast
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      // TODO: Add proper date validation/parsing for schedule
      schedule: data.schedule
        .split(",")
        .map((s) => s.trim())
        .filter((s) => {
          try {
            // Basic ISO check with 'T' and 'Z'
            return (
              s.includes("T") &&
              s.endsWith("Z") &&
              !isNaN(new Date(s).getTime())
            );
          } catch {
            return false;
          }
        }),
    };

    // Ensure schedule validation doesn't prevent submission if initially empty/invalid in form
    if (showPayload.schedule.length === 0 && data.schedule.trim() !== "") {
      toast({
        title: "Invalid Schedule",
        description:
          "Please enter valid ISO date strings (YYYY-MM-DDTHH:mm:ssZ), comma-separated.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingShow) {
        // Update
        const updated = await updateShow(editingShow.id, showPayload);
        // Optimistic update or refetch:
        setShows((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        // fetchAndSetShows(); // Alternatively, refetch all data
        toast({
          title: "Show Updated",
          description: `"${updated.title}" has been updated.`,
        });
      } else {
        // Create
        const created = await createShow(showPayload);
        // Optimistic update or refetch:
        setShows((prev) => [created, ...prev]); // Add to top
        // fetchAndSetShows(); // Alternatively, refetch all data
        toast({
          title: "Show Created",
          description: `"${created.title}" has been added.`,
        });
      }
      setIsFormOpen(false); // Close dialog on success
      setEditingShow(null); // Reset editing state
    } catch (err) {
      console.error("Failed to save show:", err);
      toast({
        title: "Save Failed",
        description: `Could not ${editingShow ? "update" : "create"} show.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (show: DramaShow) => {
    setEditingShow(show);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async (showId: string, showTitle: string) => {
    setIsDeleting(true);
    try {
      const success = await deleteShow(showId);
      if (success) {
        // Optimistic update or refetch:
        setShows((prev) => prev.filter((s) => s.id !== showId));
        // fetchAndSetShows(); // Alternatively, refetch all data
        toast({
          title: "Show Deleted",
          description: `"${showTitle}" has been deleted.`,
        });
      } else {
        throw new Error("Deletion failed");
      }
    } catch (err) {
      console.error("Failed to delete show:", err);
      toast({
        title: "Delete Failed",
        description: `Could not delete show.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateForm = () => {
    setEditingShow(null); // Ensure not in edit mode
    setIsFormOpen(true);
  };

  const getStatusBadgeVariant = (
    status: DramaShow["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"; // Use primary color
      case "upcoming":
        return "secondary"; // Use secondary color
      case "ended":
      case "closed":
        return "outline"; // Use outline/muted
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Manage Shows
        </h1>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingShow(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={openCreateForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Show
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            {" "}
            {/* Increased width */}
            <DialogHeader>
              <DialogTitle>
                {editingShow ? "Edit Show" : "Add New Show"}
              </DialogTitle>
              <DialogDescription>
                {editingShow
                  ? "Modify the details of the existing show."
                  : "Fill in the details for the new drama show."}
              </DialogDescription>
            </DialogHeader>
            {/* Use ScrollArea for potentially long forms */}
            <ScrollArea className="max-h-[70vh] pr-6">
              <form
                onSubmit={handleFormSubmit}
                id="show-form"
                className="grid gap-4 py-4"
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingShow?.title ?? ""}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingShow?.description ?? ""}
                    className="col-span-3"
                    required
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="genre" className="text-right">
                    Genre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="genre"
                    name="genre"
                    defaultValue={editingShow?.genre ?? ""}
                    className="col-span-3"
                    required
                    placeholder="e.g., Drama, Comedy"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="venue" className="text-right">
                    Venue <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="venue"
                    name="venue"
                    defaultValue={editingShow?.venue ?? ""}
                    className="col-span-3"
                    required
                    placeholder="e.g., Main Hall"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name="status"
                    defaultValue={editingShow?.status ?? "upcoming"}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="cast" className="text-right pt-2">
                    Cast
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="cast"
                      name="cast"
                      defaultValue={editingShow?.cast?.join(", ") ?? ""}
                      className="w-full"
                      placeholder="Actor A, Actor B"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Comma-separated names
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="schedule" className="text-right pt-2">
                    Schedule
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="schedule"
                      name="schedule"
                      defaultValue={editingShow?.schedule?.join(",\n") ?? ""}
                      className="w-full font-mono text-xs"
                      placeholder="YYYY-MM-DDTHH:mm:ssZ"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      One ISO date string (e.g., 2024-09-15T20:00:00Z) per line,
                      or comma-separated.
                    </p>
                  </div>
                </div>
                {/* TODO: Add fields for venue/room selection, seat booking limit */}
              </form>
            </ScrollArea>
            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t -mx-6 px-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" form="show-form" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {editingShow ? "Save Changes" : "Create Show"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, venue, genre, cast..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </form>

      {/* Shows Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Shows</CardTitle>
          <CardDescription>
            List of all drama shows in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading shows...</p>
            </div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : shows.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No shows found matching your criteria.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Schedule Dates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shows.map((show) => (
                    <TableRow key={show.id}>
                      <TableCell className="font-medium">
                        {show.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(show.status)}
                          className="capitalize"
                        >
                          {show.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{show.genre}</TableCell>
                      <TableCell>{show.venue}</TableCell>
                      <TableCell className="text-xs">
                        {show.schedule.length > 0
                          ? format(new Date(show.schedule[0]), "MMM d, yyyy") +
                            (show.schedule.length > 1
                              ? ` (+${show.schedule.length - 1} more)`
                              : "")
                          : "Not Set"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEdit(show)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {/* Optional: Add View Bookings link */}
                            {/* <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View Bookings
                             </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            {/* Use AlertDialog for Delete */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()} // Prevent closing dropdown immediately
                                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the show "
                                    <span className="font-medium">
                                      {show.title}
                                    </span>
                                    " and all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteConfirm(show.id, show.title)
                                    }
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Delete Show
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {/* Optional: Add Pagination */}
        {/* <CardFooter>
             <div className="text-xs text-muted-foreground">
               Showing <strong>1-10</strong> of <strong>{shows.length}</strong> shows
             </div>
           </CardFooter> */}
      </Card>
    </div>
  );
}
