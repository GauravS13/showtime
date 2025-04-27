"use client";

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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Edit,
  Loader2,
  MoreHorizontal,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define the structure of a discount code/offer
interface DiscountOffer {
  id: string;
  code: string; // Unique code (e.g., SUMMER20)
  discountPercentage: number;
  description: string; // Optional description
  isActive: boolean;
  validFrom?: string; // ISO date string
  validUntil?: string; // ISO date string
  usageLimit?: number; // Max uses total
  timesUsed?: number; // How many times used so far
  createdAt: string; // ISO date string
}

// --- Placeholder for Discount Management Service ---
const randomDiscountPrefixes = [
  "SUMMER",
  "WINTER",
  "FALL",
  "SPRING",
  "WELCOME",
  "SPECIAL",
  "FLASH",
  "MEMBER",
  "LOYALTY",
  "EARLYBIRD",
];
const randomPercentages = [5, 10, 15, 20, 25];

const generateDummyDiscounts = (count: number): DiscountOffer[] => {
  const discounts: DiscountOffer[] = [];
  const now = new Date();
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );
  const sixMonthsAhead = new Date(
    now.getFullYear(),
    now.getMonth() + 6,
    now.getDate()
  );

  for (let i = 1; i <= count; i++) {
    const prefix = randomDiscountPrefixes[i % randomDiscountPrefixes.length];
    const percentage = randomPercentages[i % randomPercentages.length];
    const isActive = Math.random() > 0.3; // ~70% active
    const hasUsageLimit = Math.random() > 0.6; // ~40% have usage limit
    const usageLimit = hasUsageLimit
      ? Math.floor(Math.random() * 900) + 100
      : undefined; // 100-1000 limit
    const timesUsed = hasUsageLimit
      ? Math.floor(Math.random() * (usageLimit! + 1))
      : Math.floor(Math.random() * 300); // Random usage
    const hasValidUntil = Math.random() > 0.4; // ~60% have expiry
    const validUntil = hasValidUntil
      ? new Date(
          now.getTime() + (Math.random() * 180 - 30) * 24 * 60 * 60 * 1000
        ).toISOString() // +/- 30 days to 150 days ahead
      : undefined;
    const createdAt = new Date(
      oneYearAgo.getTime() +
        Math.random() * (now.getTime() - oneYearAgo.getTime())
    ).toISOString();

    discounts.push({
      id: `disc_${i.toString().padStart(3, "0")}`,
      code: `${prefix}${percentage}_${i}`,
      discountPercentage: percentage,
      description: `${prefix} Offer ${i}`,
      isActive:
        isActive &&
        (validUntil ? new Date(validUntil) > now : true) &&
        (!usageLimit || timesUsed! < usageLimit), // Recalculate active based on dates/usage
      validFrom: undefined, // Optional: Add validFrom logic
      validUntil: validUntil,
      usageLimit: usageLimit,
      timesUsed: timesUsed,
      createdAt: createdAt,
    });
  }
  // Ensure at least a few known active/inactive/expired codes exist
  discounts.push({
    id: "disc_fixed_1",
    code: "SUMMER20",
    discountPercentage: 20,
    description: "Summer Sale 20% Off",
    isActive: true,
    validUntil: sixMonthsAhead.toISOString(),
    timesUsed: 50,
    createdAt: "2024-06-01T10:00:00Z",
  });
  discounts.push({
    id: "disc_fixed_2",
    code: "WELCOME10",
    discountPercentage: 10,
    description: "New User Welcome Offer",
    isActive: true,
    usageLimit: 1000,
    timesUsed: 150,
    createdAt: "2024-01-01T00:00:00Z",
  });
  discounts.push({
    id: "disc_fixed_3",
    code: "EXPIRED5",
    discountPercentage: 5,
    description: "Old Offer",
    isActive: false,
    validUntil: oneYearAgo.toISOString(),
    timesUsed: 25,
    createdAt: "2023-11-01T00:00:00Z",
  });
  discounts.push({
    id: "disc_fixed_4",
    code: "LAUNCH15",
    discountPercentage: 15,
    description: "Launch Special (Used Up)",
    isActive: false,
    usageLimit: 50,
    timesUsed: 50,
    createdAt: "2024-05-01T00:00:00Z",
  });

  return discounts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const allDummyDiscounts = generateDummyDiscounts(20);

async function fetchAdminDiscounts(): Promise<DiscountOffer[]> {
  console.log("Fetching admin discounts...");
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay shorter
  // Return the generated dummy data
  return allDummyDiscounts;
}

async function createDiscount(
  discountData: Omit<DiscountOffer, "id" | "timesUsed" | "createdAt">
): Promise<DiscountOffer> {
  console.log("Creating discount:", discountData);
  await new Promise((resolve) => setTimeout(resolve, 600));
  const newDiscount: DiscountOffer = {
    ...discountData,
    id: `disc_${Date.now()}`,
    timesUsed: 0,
    createdAt: new Date().toISOString(),
  };
  console.log("Discount created (simulated):", newDiscount);
  // Add to our dummy data list for persistence in this session (optional)
  allDummyDiscounts.unshift(newDiscount);
  return newDiscount;
}

async function updateDiscount(
  discountId: string,
  discountData: Partial<Omit<DiscountOffer, "id" | "timesUsed" | "createdAt">>
): Promise<DiscountOffer> {
  console.log(`Updating discount ${discountId}:`, discountData);
  await new Promise((resolve) => setTimeout(resolve, 600));

  const index = allDummyDiscounts.findIndex((d) => d.id === discountId);
  if (index === -1) throw new Error("Discount not found");

  const updatedDiscount = {
    ...allDummyDiscounts[index],
    ...discountData, // Apply partial updates
  } as DiscountOffer;

  // Update in our dummy data list
  allDummyDiscounts[index] = updatedDiscount;
  console.log("Discount updated (simulated):", updatedDiscount);
  return updatedDiscount;
}

async function deleteDiscount(discountId: string): Promise<boolean> {
  console.log(`Deleting discount ${discountId}`);
  await new Promise((resolve) => setTimeout(resolve, 700));
  const index = allDummyDiscounts.findIndex((d) => d.id === discountId);
  if (index !== -1) {
    allDummyDiscounts.splice(index, 1);
    console.log("Discount deleted (simulated)");
    return true; // Assume success
  }
  console.log("Discount not found for deletion");
  return false;
}
// --- End Placeholder Service ---

// Form Schema (Simplified)
interface DiscountFormData {
  code: string;
  discountPercentage: number;
  description: string;
  isActive: boolean;
  // Add validFrom, validUntil, usageLimit later if needed
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountOffer | null>(
    null
  );
  const { toast } = useToast();

  const fetchAndSetDiscounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedDiscounts = await fetchAdminDiscounts();
      setDiscounts(fetchedDiscounts);
    } catch (err) {
      console.error("Failed to load discounts:", err);
      setError("Could not load discounts. Please try again later.");
      toast({
        title: "Error",
        description: "Could not load discounts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const data: DiscountFormData = {
      code: (formData.get("code") as string).toUpperCase(), // Ensure code is uppercase
      discountPercentage: Number(formData.get("discountPercentage")),
      description: formData.get("description") as string,
      isActive: formData.get("isActive") === "on", // Handle switch value
    };

    // Basic validation
    if (
      !data.code ||
      data.discountPercentage <= 0 ||
      data.discountPercentage > 100
    ) {
      toast({
        title: "Invalid Data",
        description: "Please provide a valid code and percentage (1-100).",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const discountPayload = {
      code: data.code,
      discountPercentage: data.discountPercentage,
      description: data.description,
      isActive: data.isActive,
      // Add other fields like dates/limits here if implemented
    };

    try {
      let savedDiscount: DiscountOffer;
      if (editingDiscount) {
        savedDiscount = await updateDiscount(
          editingDiscount.id,
          discountPayload
        );
        setDiscounts((prev) =>
          prev.map((d) => (d.id === savedDiscount.id ? savedDiscount : d))
        );
        toast({
          title: "Discount Updated",
          description: `Code "${savedDiscount.code}" has been updated.`,
        });
      } else {
        savedDiscount = await createDiscount(discountPayload);
        setDiscounts((prev) => [savedDiscount, ...prev]);
        toast({
          title: "Discount Created",
          description: `Code "${savedDiscount.code}" has been added.`,
        });
      }
      setIsFormOpen(false);
      setEditingDiscount(null);
    } catch (err) {
      console.error("Failed to save discount:", err);
      toast({
        title: "Save Failed",
        description: `Could not ${
          editingDiscount ? "update" : "create"
        } discount.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (discount: DiscountOffer) => {
    setEditingDiscount(discount);
    setIsFormOpen(true);
  };

  const handleDelete = async (discountId: string, discountCode: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the discount code "${discountCode}"?`
      )
    ) {
      return;
    }
    // Show loading indicator on the specific row/action if possible
    setIsLoading(true); // Use main loading or add specific delete loading state
    try {
      const success = await deleteDiscount(discountId);
      if (success) {
        setDiscounts((prev) => prev.filter((d) => d.id !== discountId));
        toast({
          title: "Discount Deleted",
          description: `Code "${discountCode}" has been deleted.`,
        });
      } else {
        throw new Error("Deletion failed");
      }
    } catch (err) {
      console.error("Failed to delete discount:", err);
      toast({
        title: "Delete Failed",
        description: `Could not delete discount code.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingDiscount(null);
    setIsFormOpen(true);
  };

  const getStatusBadgeVariant = (isActive: boolean): "default" | "outline" => {
    return isActive ? "default" : "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Manage Discounts & Offers
        </h1>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingDiscount(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={openCreateForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>
                {editingDiscount ? "Edit Discount" : "Add New Discount"}
              </DialogTitle>
              <DialogDescription>
                {editingDiscount
                  ? "Modify the details of the discount code."
                  : "Create a new discount code or offer."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editingDiscount?.code ?? ""}
                  className="col-span-3 uppercase"
                  required
                  placeholder="e.g., SUMMER20"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountPercentage" className="text-right">
                  Percentage
                </Label>
                <Input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  defaultValue={editingDiscount?.discountPercentage ?? ""}
                  className="col-span-3"
                  required
                  placeholder="e.g., 15"
                />
                <p className="col-start-2 col-span-3 text-xs text-muted-foreground -mt-2">
                  % discount
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingDiscount?.description ?? ""}
                  className="col-span-3"
                  placeholder="Optional description"
                />
              </div>
              {/* TODO: Add Valid From/Until Date Pickers */}
              {/* TODO: Add Usage Limit Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="isActive"
                    name="isActive"
                    defaultChecked={editingDiscount?.isActive ?? true}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {editingDiscount ? "Save Changes" : "Create Discount"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
          <CardDescription>
            Manage promo codes and special offers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Loading discounts...</p>
            </div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : discounts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No discount codes created yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell className="font-mono font-medium">
                        {discount.code}
                      </TableCell>
                      <TableCell>{discount.discountPercentage}%</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {discount.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(discount.isActive)}
                        >
                          {discount.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {discount.timesUsed !== undefined
                          ? `${discount.timesUsed}${
                              discount.usageLimit
                                ? ` / ${discount.usageLimit}`
                                : " times"
                            }`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {discount.validUntil
                          ? format(new Date(discount.validUntil), "MMM d, yyyy")
                          : "No Limit"}
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
                              onClick={() => handleEdit(discount)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                handleDelete(discount.id, discount.code)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
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
      </Card>
    </div>
  );
}
