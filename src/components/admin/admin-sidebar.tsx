"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"; // Adjust import path as needed
import {
  Banknote,
  BarChart3,
  Clapperboard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PanelLeftClose, // Icon for collapse
  PanelRightOpen,
  Percent,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/shows", label: "Shows", icon: Clapperboard },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/payments", label: "Payments", icon: Banknote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { state: sidebarState, toggleSidebar } = useSidebar(); // Get state and toggle function

  const isActive = (href: string) => {
    // Handle exact match for dashboard, prefix match otherwise
    return href === "/admin" ? pathname === href : pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" side="left">
      {/* Adjusted SidebarHeader to blend with the sidebar background */}
      <SidebarHeader className="bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2 p-2">
          <Clapperboard className="w-6 h-6 text-sidebar-primary" />
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden text-sidebar-foreground transition-opacity duration-200">
            Admin Panel
          </span>
          {/* Mobile trigger shown only inside the sidebar on mobile */}
          <SidebarTrigger className="ml-auto md:hidden text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent" />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label} // Show tooltip when collapsed
                className="transition-colors duration-200"
              >
                <Link href={item.href} className="flex items-center space-x-2">
                  <item.icon className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          {/* Add Collapse/Expand Trigger for Desktop */}
          <SidebarMenuItem className="hidden md:block">
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={
                sidebarState === "expanded"
                  ? "Collapse Sidebar"
                  : "Expand Sidebar"
              }
              aria-label={
                sidebarState === "expanded"
                  ? "Collapse Sidebar"
                  : "Expand Sidebar"
              }
              className="justify-start" // Align the icon and text to the left
            >
              {sidebarState === "expanded" ? (
                <PanelLeftClose className="shrink-0" />
              ) : (
                <PanelRightOpen className="shrink-0" />
              )}
              <span>{sidebarState === "expanded" ? "Collapse" : "Expand"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout Button */}
          <SidebarMenuItem>
            <SidebarMenuButton
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive justify-start" // Align the icon and text to the left
              tooltip="Logout" // Tooltip for logout
            >
              {/* TODO: Implement Logout Logic */}
              <LogOut className="shrink-0" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
