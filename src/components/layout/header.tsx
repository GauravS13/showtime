import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Banknote,
  BarChart3,
  Clapperboard,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Percent,
  Settings,
  Ticket,
  Users,
} from "lucide-react"; // Ensure all needed icons are imported
import Link from "next/link";

export default function Header() {
  // --- Placeholder for Authentication State ---
  // Replace this with your actual authentication context/logic
  const isLoggedIn = true; // Set to true to test logged-in view, false for logged-out
  const isAdmin = true; // Example flag for admin user
  const userName = "Admin User"; // Example user name
  const userAvatar = `https://picsum.photos/seed/${userName}/100`; // Example avatar
  // --- End Placeholder ---

  const publicNavItems = [
    { href: "/", label: "Home" },
    { href: "/shows", label: "Shows" },
  ];

  const userNavItems = [
    { href: "/bookings", label: "My Bookings" },
    { href: "/wishlist", label: "Wishlist" },
  ];

  // Define Admin Navigation Items
  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/shows", label: "Manage Shows", icon: Clapperboard },
    { href: "/admin/bookings", label: "Manage Bookings", icon: Ticket },
    { href: "/admin/discounts", label: "Manage Discounts", icon: Percent },
    { href: "/admin/reviews", label: "Moderate Reviews", icon: MessageSquare },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/analytics", label: "View Analytics", icon: BarChart3 },
    { href: "/admin/payments", label: "View Payments", icon: Banknote },
    { href: "/admin/settings", label: "App Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-primary">
              Showtime Tickets
            </span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {/* Public links */}
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/80 transition-colors hover:text-foreground font-medium"
              >
                {item.label}
              </Link>
            ))}
            {/* Admin-specific links - Desktop */}
            {isLoggedIn && isAdmin && (
              <>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground/80 transition-colors hover:text-foreground font-medium"
                    title={`Admin: ${item.label}`} // Add title for clarity
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {" "}
                {/* Increased width */}
                <DropdownMenuLabel>
                  <div className="font-semibold">{userName}</div>
                  <div className="text-xs text-muted-foreground">
                    Account Menu
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookings" className="flex items-center gap-2">
                    <History className="h-4 w-4" /> My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                </DropdownMenuItem>
                {/* Admin Routes Section - Dropdown */}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                      Admin Panel
                    </DropdownMenuLabel>
                    {adminNavItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" /> {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                  {/* TODO: Implement Logout Logic */}
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                {/* Use SheetTitle for accessibility, hide it visually if needed */}
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                {/* Optional: Add Logo inside mobile menu */}
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <Ticket className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg text-primary">
                    Showtime Tickets
                  </span>
                </Link>
              </SheetHeader>
              <nav className="grid gap-4 text-base font-medium mt-8">
                {/* Public links */}
                {publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                {/* User-specific links */}
                {isLoggedIn &&
                  userNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}

                <Separator className="my-2" />

                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" /> Profile Settings
                    </Link>
                    {/* Admin Links - Mobile */}
                    {isAdmin && (
                      <>
                        <Separator className="my-2" />
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                          Admin Panel
                        </div>
                        {adminNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
                          >
                            <item.icon className="h-4 w-4" /> {item.label}
                          </Link>
                        ))}
                      </>
                    )}
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      className="justify-start text-destructive hover:text-destructive p-0 h-auto text-base font-medium"
                    >
                      {/* TODO: Implement Logout Logic */}
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
