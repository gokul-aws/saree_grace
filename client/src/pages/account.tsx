import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Order } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Package, User, LogOut } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function Account() {
  const [, navigate] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Fetch orders for the user
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: isAuthenticated,
  });
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access your account</p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>My Account - Saree Grace</title>
        <meta name="description" content="Manage your account settings, view orders, and track shipments at Saree Grace." />
        <meta property="og:title" content="My Account - Saree Grace" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-neutral-light py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold">My Account</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1 mb-4 md:mb-0">
                    <Label>Full Name</Label>
                    <div className="font-medium">{user?.fullName}</div>
                  </div>
                  
                  <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold">
                    {user?.fullName?.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Username</Label>
                    <div className="font-medium">{user?.username}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-1">
                  <Label htmlFor="current-password">Password</Label>
                  <div className="flex items-center">
                    <Input 
                      id="current-password" 
                      type="password" 
                      value="************" 
                      disabled 
                      className="max-w-sm"
                    />
                    <Button variant="link" className="ml-2">
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={logout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
                      <div className="h-4 w-32 bg-gray-200 mb-2 rounded"></div>
                      <div className="h-3 w-48 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <p className="font-display font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="mt-2 md:mt-0">
                            <span className={`inline-block px-3 py-1 text-xs rounded-full 
                              ${order.status === 'delivered' ? 'bg-success/10 text-success' : 
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                                order.status === 'cancelled' ? 'bg-error/10 text-error' : 
                                'bg-yellow-100 text-yellow-700'}`
                            }>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="font-medium">{formatPrice(order.total)}</span>
                          </div>
                          
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/account/orders/${order.id}`}>View Details</a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="font-display text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">When you place your first order, it will appear here</p>
                    <Button asChild>
                      <a href="/products">Start Shopping</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Manage your shipping addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="font-display text-lg font-medium mb-2">No addresses saved</h3>
                  <p className="text-gray-500 mb-6">Add a shipping address for faster checkout</p>
                  <Button>Add New Address</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
