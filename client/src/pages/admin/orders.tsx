import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
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
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingBag, Users, Package, Eye, MoreVertical, 
  Search, AlertCircle, Edit, Calendar
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Link } from 'wouter';

// Admin panel sidebar (same as in other admin pages)
const AdminSidebar = ({ activePage = 'orders' }) => {
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

// Status badge component for orders
const OrderStatusBadge = ({ status }: { status: string }) => {
  let variant = '';
  
  switch(status) {
    case 'pending':
      variant = 'bg-yellow-100 text-yellow-800';
      break;
    case 'processing':
      variant = 'bg-blue-100 text-blue-800';
      break;
    case 'shipped':
      variant = 'bg-purple-100 text-purple-800';
      break;
    case 'delivered':
      variant = 'bg-green-100 text-green-800';
      break;
    case 'cancelled':
      variant = 'bg-red-100 text-red-800';
      break;
    default:
      variant = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // Fetch all orders (admin view)
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders', { all: true }],
    enabled: isAuthenticated && user?.isAdmin,
  });
  
  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: string }) => {
      await apiRequest('PUT', `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setIsUpdateDialogOpen(false);
      toast({ title: 'Order status updated successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to update order status', 
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  });
  
  // Filter orders based on search and status filter
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toString().includes(searchQuery) || 
      order.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle order status update
  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      updateStatusMutation.mutate({ 
        orderId: selectedOrder.id, 
        status: newStatus 
      });
    }
  };
  
  // Open update status dialog
  const openUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsUpdateDialogOpen(true);
  };
  
  // Open view order dialog
  const openViewDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <title>Order Management - Saree Grace Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-light min-h-screen py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-6">Order Management</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <AdminSidebar activePage="orders" />
            
            {/* Main Content */}
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by order ID or address..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {isLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 bg-gray-200 rounded w-full"></div>
                      ))}
                    </div>
                  ) : filteredOrders && filteredOrders.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">#{order.id}</TableCell>
                              <TableCell>{formatDate(order.createdAt)}</TableCell>
                              <TableCell>User #{order.userId}</TableCell>
                              <TableCell>{formatPrice(order.total)}</TableCell>
                              <TableCell>
                                <OrderStatusBadge status={order.status} />
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
                                    <DropdownMenuItem onClick={() => openViewDialog(order)}>
                                      <Eye className="h-4 w-4 mr-2" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openUpdateDialog(order)}>
                                      <Edit className="h-4 w-4 mr-2" /> Update Status
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
                      <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery || filterStatus !== 'all'
                          ? 'Try adjusting your filters'
                          : 'No orders have been placed yet'}
                      </p>
                      {(searchQuery || filterStatus !== 'all') && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchQuery('');
                            setFilterStatus('all');
                          }}
                        >
                          Clear Filters
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

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label>Current Status</Label>
            <div className="mt-1">
              {selectedOrder && <OrderStatusBadge status={selectedOrder.status} />}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="new-status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending || newStatus === selectedOrder?.status}
            >
              {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id} placed on {selectedOrder && formatDate(selectedOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <OrderStatusBadge status={selectedOrder.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Date:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="font-medium">{formatPrice(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                
                {/* Customer & Shipping Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer ID:</span>
                      <span>#{selectedOrder.userId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Shipping Address:</span>
                      <p className="mt-1">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          <div className="flex flex-col items-center">
                            <Calendar className="h-5 w-5 mb-2" />
                            Item details not available in this view
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  className="mr-auto"
                  onClick={() => openUpdateDialog(selectedOrder)}
                >
                  Update Status
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Label component for forms
const Label = ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className="text-sm font-medium" {...props}>
      {children}
    </label>
  );
};
