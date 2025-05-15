import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingBag, Users, Package, Edit, MoreVertical, 
  Trash2, Plus, Search, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Link } from 'wouter';

// Admin panel sidebar (same as in dashboard)
const AdminSidebar = ({ activePage = 'products' }) => {
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

export default function AdminProducts() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Fetch products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: isAuthenticated && user?.isAdmin,
  });
  
  // Fetch categories for dropdown
  const { data: categories } = useQuery<any[]>({
    queryKey: ['/api/categories'],
    enabled: isAuthenticated && user?.isAdmin,
  });
  
  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest('DELETE', `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsDeleteDialogOpen(false);
      toast({ title: 'Product deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to delete product', 
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  });
  
  // Filtered products based on search query
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle product delete
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };
  
  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAddDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
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
        <title>Product Management - Saree Grace Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-light min-h-screen py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-6">Product Management</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <AdminSidebar activePage="products" />
            
            {/* Main Content */}
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Products</CardTitle>
                      <CardDescription>Manage your product inventory</CardDescription>
                    </div>
                    <Button onClick={() => {
                      setSelectedProduct(null);
                      setIsAddDialogOpen(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" /> Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full max-w-lg grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
                      <TabsTrigger value="new">New Arrivals</TabsTrigger>
                      <TabsTrigger value="featured">Featured</TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-4">
                      {isLoading ? (
                        <div className="animate-pulse space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-14 bg-gray-200 rounded w-full"></div>
                          ))}
                        </div>
                      ) : filteredProducts && filteredProducts.length > 0 ? (
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className="h-10 w-10 rounded object-cover"
                                      />
                                      <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {categories?.find(c => c.id === product.categoryId)?.name || 
                                     `Category ${product.categoryId}`}
                                  </TableCell>
                                  <TableCell>
                                    {formatPrice(product.discountPrice || product.price)}
                                    {product.discountPrice && (
                                      <span className="text-xs text-gray-500 line-through ml-1">
                                        {formatPrice(product.price)}
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <span className={
                                      product.stock > 10 
                                        ? 'text-success' 
                                        : product.stock > 0 
                                          ? 'text-warning' 
                                          : 'text-error'
                                    }>
                                      {product.stock}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      {product.isNewArrival && (
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mr-1">
                                          New
                                        </span>
                                      )}
                                      {product.isBestSeller && (
                                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded mr-1">
                                          Best
                                        </span>
                                      )}
                                      {product.featured && (
                                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                                          Featured
                                        </span>
                                      )}
                                    </div>
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
                                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                          <Edit className="h-4 w-4 mr-2" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openDeleteDialog(product)}>
                                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => window.open(`/products/${product.id}`, '_blank')}
                                        >
                                          <Eye className="h-4 w-4 mr-2" /> View
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
                          <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No products found</h3>
                          <p className="text-gray-500 mb-4">
                            {searchQuery ? 'Try adjusting your search query' : 'Add your first product to get started'}
                          </p>
                          {searchQuery && (
                            <Button variant="outline" onClick={() => setSearchQuery('')}>
                              Clear Search
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {filteredProducts?.length || 0} of {products?.length || 0} products
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Update product details' : 'Fill in the details for your new product'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product details go here */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" defaultValue={selectedProduct?.name} />
              </div>
              
              <div>
                <Label htmlFor="product-category">Category</Label>
                <Select defaultValue={selectedProduct?.categoryId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-price">Regular Price</Label>
                  <Input 
                    id="product-price" 
                    type="number" 
                    defaultValue={selectedProduct?.price}
                  />
                </div>
                <div>
                  <Label htmlFor="product-sale-price">Sale Price (Optional)</Label>
                  <Input 
                    id="product-sale-price" 
                    type="number" 
                    defaultValue={selectedProduct?.discountPrice}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="product-stock">Stock Quantity</Label>
                <Input 
                  id="product-stock" 
                  type="number" 
                  defaultValue={selectedProduct?.stock}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-description">Description</Label>
                <Textarea 
                  id="product-description"
                  rows={5}
                  defaultValue={selectedProduct?.description}
                />
              </div>
              
              <div>
                <Label htmlFor="product-image">Image URL</Label>
                <Input 
                  id="product-image" 
                  defaultValue={selectedProduct?.imageUrl}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Product Status</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is-new" 
                      defaultChecked={selectedProduct?.isNewArrival}
                    />
                    <label 
                      htmlFor="is-new"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      New Arrival
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is-bestseller" 
                      defaultChecked={selectedProduct?.isBestSeller}
                    />
                    <label 
                      htmlFor="is-bestseller"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Bestseller
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is-featured" 
                      defaultChecked={selectedProduct?.featured}
                    />
                    <label 
                      htmlFor="is-featured"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Featured
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="flex items-center space-x-3 py-2">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                className="h-14 w-14 rounded object-cover"
              />
              <div>
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-sm text-gray-500">ID: {selectedProduct.id}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
