
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Eye, Edit, Trash2, ShieldBan, ShieldCheck, Search, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Define the structure of a user (Admin View)
interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'organizer' | 'handler'; // Example roles
  status: 'active' | 'suspended' | 'pending_verification';
  createdAt: string; // ISO date string
  lastLogin?: string; // ISO date string
  bookingCount: number; // Example additional info
}

// --- Placeholder for User Management Service ---
async function fetchAdminUsers(filters: { search?: string }): Promise<AdminUser[]> {
    console.log('Fetching admin users with filters:', filters);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Sample Data
    const allUsers: AdminUser[] = [
        { id: 'user1', name: 'Alice', email: 'alice@example.com', avatarUrl: 'https://picsum.photos/seed/alice/100', role: 'user', status: 'active', createdAt: '2024-01-15T10:00:00Z', lastLogin: '2024-07-20T12:30:00Z', bookingCount: 5 },
        { id: 'user2', name: 'Bob', email: 'bob@example.com', role: 'user', status: 'active', createdAt: '2024-02-20T11:00:00Z', lastLogin: '2024-07-19T09:00:00Z', bookingCount: 2 },
        { id: 'user3', name: 'Charlie Organizer', email: 'charlie@org.com', role: 'organizer', status: 'active', createdAt: '2024-01-01T08:00:00Z', lastLogin: '2024-07-21T08:00:00Z', bookingCount: 0 },
        { id: 'user4', name: 'David Suspended', email: 'david@example.com', role: 'user', status: 'suspended', createdAt: '2024-03-10T14:00:00Z', bookingCount: 1 },
        { id: 'user5', name: 'Eve Handler', email: 'eve@handler.com', role: 'handler', status: 'active', createdAt: '2024-05-05T16:00:00Z', lastLogin: '2024-07-18T15:00:00Z', bookingCount: 0 },
        { id: 'user6', name: 'Frank Pending', email: 'frank@pending.com', role: 'user', status: 'pending_verification', createdAt: '2024-07-21T10:00:00Z', bookingCount: 0 },
    ];

     let filtered = allUsers;
     if (filters.search) {
         const query = filters.search.toLowerCase();
         filtered = filtered.filter(u =>
             u.name.toLowerCase().includes(query) ||
             u.email.toLowerCase().includes(query) ||
             u.id.toLowerCase().includes(query)
         );
     }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function updateUserStatus(userId: string, status: AdminUser['status']): Promise<boolean> {
    console.log(`Updating status for user ${userId} to ${status}`);
    await new Promise(resolve => setTimeout(resolve, 700));
     console.log('Status updated (simulated)');
    return true; // Assume success
}

async function deleteUser(userId: string): Promise<boolean> {
    console.log(`Deleting user ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
     console.log('User deleted (simulated)');
    return true; // Assume success
}
// --- End Placeholders ---

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track loading for actions
  const { toast } = useToast();

  const fetchAndSetUsers = async () => {
      setIsLoading(true);
      setError(null);
      setActionLoading(null);
      try {
          const fetchedUsers = await fetchAdminUsers({ search: searchTerm });
          setUsers(fetchedUsers);
      } catch (err) {
          console.error("Failed to load users:", err);
          setError("Could not load users. Please try again later.");
          toast({ title: "Error", description: "Could not load users.", variant: "destructive" });
      } finally {
          setIsLoading(false);
      }
  };

   useEffect(() => {
        fetchAndSetUsers();
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Fetch on initial load

   const handleSearch = (event: React.FormEvent) => {
      event.preventDefault();
      fetchAndSetUsers();
   }

    const handleStatusUpdate = async (userId: string, newStatus: AdminUser['status'], userName: string) => {
        const actionText = newStatus === 'active' ? 'activate' : 'suspend';
        if (!confirm(`Are you sure you want to ${actionText} user "${userName}"?`)) return;
        setActionLoading(userId);
        try {
            const success = await updateUserStatus(userId, newStatus);
            if (success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
                toast({ title: "User Status Updated", description: `User ${userName} has been ${newStatus}.` });
            } else {
                throw new Error("Status update failed");
            }
        } catch (err) {
             console.error("Failed to update user status:", err);
             toast({ title: "Update Failed", description: "Could not update user status.", variant: "destructive" });
        } finally {
            setActionLoading(null);
        }
    };

   const handleDelete = async (userId: string, userName: string) => {
       if (!confirm(`Are you sure you want to delete user "${userName}"? This is permanent!`)) return;
       setActionLoading(userId);
       try {
           const success = await deleteUser(userId);
           if (success) {
               setUsers(prev => prev.filter(u => u.id !== userId));
               toast({ title: "User Deleted", description: `User ${userName} has been deleted.` });
           } else {
               throw new Error("Deletion failed");
           }
       } catch (err) {
            console.error("Failed to delete user:", err);
            toast({ title: "Delete Failed", description: "Could not delete user.", variant: "destructive" });
       } finally {
           setActionLoading(null);
       }
   };

   const getStatusBadgeVariant = (status: AdminUser['status']): "default" | "secondary" | "destructive" | "outline" => {
      switch (status) {
          case 'active': return 'default'; // Or green
          case 'suspended': return 'destructive';
          case 'pending_verification': return 'secondary';
          default: return 'outline';
      }
   }

    const getRoleBadgeVariant = (role: AdminUser['role']): "default" | "secondary" | "outline" => {
       switch (role) {
           case 'organizer': return 'default'; // Primary for organizer
           case 'handler': return 'secondary'; // Secondary for handler
           case 'user': return 'outline'; // Outline for regular user
           default: return 'outline';
       }
    }


  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">Manage Users</h1>

      {/* Search */}
       <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Name, Email, or User ID..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Search Users
          </Button>
           {/* Optional: Add Role/Status Filters */}
        </form>

       {/* Users Table */}
       <Card>
         <CardHeader>
           <CardTitle>Registered Users</CardTitle>
           <CardDescription>View and manage user accounts.</CardDescription>
         </CardHeader>
         <CardContent>
           {isLoading ? (
             <div className="flex justify-center items-center py-16">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">Loading users...</p>
             </div>
           ) : error ? (
               <p className="text-destructive text-center">{error}</p>
           ) : users.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No users found matching your criteria.</p>
           ) : (
             <div className="overflow-x-auto">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Name</TableHead>
                     <TableHead>Email</TableHead>
                     <TableHead>Role</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Bookings</TableHead>
                     <TableHead>Joined Date</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {users.map((user) => (
                     <TableRow key={user.id} className={actionLoading === user.id ? 'opacity-50' : ''}>
                       <TableCell>
                          <div className="flex items-center gap-3">
                             <Avatar className="h-8 w-8">
                               <AvatarImage src={user.avatarUrl} alt={user.name} />
                               <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <span className="font-medium">{user.name}</span>
                           </div>
                       </TableCell>
                       <TableCell>{user.email}</TableCell>
                       <TableCell>
                           <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">{user.role}</Badge>
                       </TableCell>
                       <TableCell>
                         <Badge variant={getStatusBadgeVariant(user.status)} className="capitalize">
                           {user.status.replace('_', ' ')}
                         </Badge>
                       </TableCell>
                       <TableCell>{user.bookingCount}</TableCell>
                       <TableCell className="text-xs">{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                       <TableCell className="text-right">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button aria-haspopup="true" size="icon" variant="ghost" disabled={actionLoading === user.id}>
                               {actionLoading === user.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                               <span className="sr-only">Toggle menu</span>
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                             {/* <DropdownMenuItem>
                                 <Eye className="mr-2 h-4 w-4" /> View Profile
                             </DropdownMenuItem>
                              <DropdownMenuItem>
                                 <Edit className="mr-2 h-4 w-4" /> Edit Role (Coming Soon)
                             </DropdownMenuItem> */}
                             <DropdownMenuSeparator />
                             {user.status === 'active' ? (
                               <DropdownMenuItem
                                  className="text-orange-600 focus:text-orange-600"
                                   onClick={() => handleStatusUpdate(user.id, 'suspended', user.name)}
                                >
                                 <ShieldBan className="mr-2 h-4 w-4" /> Suspend User
                               </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                    className="text-green-600 focus:text-green-600"
                                    onClick={() => handleStatusUpdate(user.id, 'active', user.name)}
                                >
                                  <ShieldCheck className="mr-2 h-4 w-4" /> Activate User
                                </DropdownMenuItem>
                              )}
                             <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(user.id, user.name)}
                              >
                               <Trash2 className="mr-2 h-4 w-4" /> Delete User
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
           {/* Optional: Add Pagination */}
       </Card>

       {/* TODO: Add ability to create Event Handler accounts */}
        <Card>
            <CardHeader>
                <CardTitle>Create Handler Account</CardTitle>
                <CardDescription>Create accounts for staff managing specific events.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">Handler account creation form will be added here.</p>
                 {/* Form elements for creating handler accounts */}
                 <Button disabled className="mt-4">Create Handler (Coming Soon)</Button>
             </CardContent>
        </Card>
    </div>
  );
}

// Helper type or interface for user filters
interface UserFilters {
    search?: string;
    // Add role or status filters if needed
}
