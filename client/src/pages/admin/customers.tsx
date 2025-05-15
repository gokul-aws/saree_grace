import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, Users, Package, MoreVertical, Search, 
  AlertCircle, Eye, Mail, User as UserIcon
} from 'lucide-react';
import { Link } from 'wouter';

// Admin panel sidebar (same as in other admin pages)
const AdminSidebar = ({ activePage = 'customers' }) => {
  const links = [
    { name: 'Dashboard', href: '/admin', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
  ];
  
  return (
    <div className="w-full md:w-64 bg-white shadow-sm rounded-lg p-4">
      <div className="text-xl font-display font-bold text-primary mb-6">Admin Panel</div>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = activePage === link.name.toLowerCase();
          return (
            <Link key={link.href} href={link.href}>
              <a className={`flex items-center px-4 py-3 rounded-md text-sm font-medium ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
              }`}>
                <link.icon className="h-5 w-5 mr-3" />
                {link.name}
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default function AdminCustomers() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Fetch all users
  const { data: users, isLoading } = useQuery<Partial<User>[]>({
    queryKey: ['/api/admin/users'],
    enabled: isAuthenticated && user?.isAdmin,
  });
  
  // Filter users based on search
  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Open user details dialog
  const openViewDialog = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (isAuthenticated && !user?.isAdmin) {
      navigate('/');
    }
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-error" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page</p>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Customer Management - Saree Grace Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-light min-h-screen py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-6">Customer Management</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <AdminSidebar activePage="customers" />
            
            {/* Main Content */}
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>Manage your customer accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, email or username..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 bg-gray-200 rounded w-full"></div>
                      ))}
                    </div>
                  ) : filteredUsers && filteredUsers.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center text-sm font-bold">
                                    {getUserInitials(user.fullName || 'User')}
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.fullName}</p>
                                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.createdAt && formatDate(user.createdAt)}</TableCell>
                              <TableCell>
                                <Badge variant={user.isAdmin ? "destructive" : "secondary"}>
                                  {user.isAdmin ? 'Admin' : 'Customer'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => openViewDialog(user as User)}>
                                      <Eye className="h-4 w-4 mr-2" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => window.location.href = `mailto:${user.email}`}
                                    >
                                      <Mail className="h-4 w-4 mr-2" /> Email Customer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No customers found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery 
                          ? 'Try adjusting your search query' 
                          : 'No customer accounts have been created yet'}
                      </p>
                      {searchQuery && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Account information for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold">
                  {getUserInitials(selectedUser.fullName || 'User')}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.fullName}</h3>
                  <Badge variant={selectedUser.isAdmin ? "destructive" : "secondary"}>
                    {selectedUser.isAdmin ? 'Admin' : 'Customer'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <UserIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Username</p>
                    <p>{selectedUser.username}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p>{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Created</p>
                    <p>{formatDate(selectedUser.createdAt || new Date())}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${selectedUser.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" /> Email Customer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Calendar icon component
const Calendar = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
};
