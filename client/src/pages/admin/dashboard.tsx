import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { 
  ShoppingBag, Users, Package, TrendingUp, DollarSign, 
  ArrowRight, AlertCircle, Activity, Calendar, BarChart2
} from 'lucide-react';
import { Link } from 'wouter';

// Admin panel sidebar
const AdminSidebar = ({ activePage = 'dashboard' }) => {
  const links = [
    { name: 'Dashboard', href: '/admin', icon: Activity },
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

// Dashboard stats data type
interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: {
    id: number;
    date: string;
    total: number;
    status: string;
  }[];
  topProducts: {
    id: number;
    name: string;
    sold: number;
    revenue: number;
  }[];
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Fetch admin stats
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: isAuthenticated && user?.isAdmin,
  });
  
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
        <title>Admin Dashboard - Saree Grace</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-light min-h-screen py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <AdminSidebar activePage="dashboard" />
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {isLoading ? (
                          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                          formatPrice(stats?.totalRevenue || 0)
                        )}
                      </h3>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {isLoading ? (
                          <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                          stats?.totalOrders || 0
                        )}
                      </h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Customers</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {isLoading ? (
                          <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                          stats?.totalCustomers || 0
                        )}
                      </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {isLoading ? (
                          <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                          stats?.totalProducts || 0
                        )}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Dashboard Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest customer orders</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="flex justify-between animate-pulse">
                                <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
                                <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                              </div>
                            ))}
                          </div>
                        ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
                          <div className="space-y-4">
                            {stats.recentOrders.map((order) => (
                              <div key={order.id} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Order #{order.id}</p>
                                  <p className="text-sm text-gray-500">{order.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatPrice(order.total)}</p>
                                  <p className={`text-sm ${
                                    order.status === 'delivered' ? 'text-success' : 
                                    order.status === 'cancelled' ? 'text-error' : 
                                    'text-yellow-600'
                                  }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            
                            <Button variant="ghost" asChild className="w-full text-primary">
                              <Link href="/admin/orders">
                                <a className="flex items-center justify-center">
                                  View All Orders <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p>No recent orders</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Top Products */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                        <CardDescription>Best selling items</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="flex justify-between animate-pulse">
                                <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
                                <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                              </div>
                            ))}
                          </div>
                        ) : stats?.topProducts && stats.topProducts.length > 0 ? (
                          <div className="space-y-4">
                            {stats.topProducts.map((product) => (
                              <div key={product.id} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-gray-500">{product.sold} sold</p>
                                </div>
                                <p className="font-medium">{formatPrice(product.revenue)}</p>
                              </div>
                            ))}
                            
                            <Button variant="ghost" asChild className="w-full text-primary">
                              <Link href="/admin/products">
                                <a className="flex items-center justify-center">
                                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p>No product data available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Sales Analytics Tab */}
                <TabsContent value="sales">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Overview</CardTitle>
                      <CardDescription>Monthly revenue analytics</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium mb-2">Analytics Coming Soon</p>
                        <p className="text-gray-500">
                          Sales analytics visualization will be available in the next update
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Products Tab */}
                <TabsContent value="products">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Inventory</CardTitle>
                      <CardDescription>Manage your products</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium mb-2">Product Management</p>
                        <p className="text-gray-500 mb-4">
                          Add, edit, and manage your product inventory from the product page
                        </p>
                        <Button asChild>
                          <Link href="/admin/products">
                            <a>Go to Products</a>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
