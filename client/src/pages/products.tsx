import React, { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from '@/components/product/ProductFilter';
import QuickView from '@/components/product/QuickView';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Products() {
  const [location] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  const categoryParam = searchParams.get('category') || undefined;
  const newParam = searchParams.get('new') === 'true';
  const bestSellerParam = searchParams.get('bestseller') === 'true';
  const saleParam = searchParams.get('sale') === 'true';
  const minPriceParam = parseInt(searchParams.get('minPrice') || '0');
  const maxPriceParam = parseInt(searchParams.get('maxPrice') || '50000');
  const searchQueryParam = searchParams.get('q') || undefined;
  const sortParam = searchParams.get('sort') || 'newest';
  
  const [filters, setFilters] = useState({
    category: categoryParam,
    priceRange: [minPriceParam, maxPriceParam] as [number, number],
    newArrivals: newParam,
    bestSellers: bestSellerParam,
    sale: saleParam,
    search: searchQueryParam,
    sort: sortParam
  });
  
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  // Query to fetch products with filters
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', {
      category: filters.category,
      featured: filters.sale,
      newArrival: filters.newArrivals,
      bestSeller: filters.bestSellers,
      search: filters.search,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1]
    }],
  });
  
  const sortProducts = (products: Product[] | undefined) => {
    if (!products) return [];
    
    const productsCopy = [...products];
    
    switch(filters.sort) {
      case 'price-low':
        return productsCopy.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      case 'price-high':
        return productsCopy.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      case 'name':
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return productsCopy;
    }
  };
  
  const sortedProducts = sortProducts(products);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Update URL with new filters
    const params = new URLSearchParams();
    
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.newArrivals) params.set('new', 'true');
    if (newFilters.bestSellers) params.set('bestseller', 'true');
    if (newFilters.sale) params.set('sale', 'true');
    if (newFilters.priceRange) {
      params.set('minPrice', newFilters.priceRange[0].toString());
      params.set('maxPrice', newFilters.priceRange[1].toString());
    }
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.search) params.set('q', filters.search);
    
    window.history.replaceState({}, '', `${location}?${params.toString()}`);
  };
  
  const handleSortChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sort: value
    }));
  };
  
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };
  
  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };
  
  // Get page title based on filters
  const getPageTitle = () => {
    if (filters.category) {
      return `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Sarees`;
    } else if (filters.newArrivals) {
      return 'New Arrivals';
    } else if (filters.bestSellers) {
      return 'Best Sellers';
    } else if (filters.sale) {
      return 'Sale Items';
    } else if (filters.search) {
      return `Search Results for "${filters.search}"`;
    } else {
      return 'All Products';
    }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} - Saree Grace</title>
        <meta 
          name="description" 
          content={`Browse our collection of ${getPageTitle().toLowerCase()}. Handcrafted sarees with premium quality and unique designs.`} 
        />
        <meta property="og:title" content={`${getPageTitle()} - Saree Grace`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-neutral-light py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold">{getPageTitle()}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Product Filters */}
          <ProductFilter 
            selectedCategory={filters.category}
            minPrice={0}
            maxPrice={50000}
            onFilter={handleFilterChange}
          />
          
          {/* Product Listing */}
          <div className="flex-1">
            {/* Sort and Total Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-gray-500 mb-2 sm:mb-0">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : error ? (
                  'Error loading products'
                ) : (
                  `Showing ${sortedProducts.length} product${sortedProducts.length !== 1 ? 's' : ''}`
                )}
              </p>
              
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">Sort by:</span>
                <Select 
                  defaultValue={filters.sort} 
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <Skeleton className="w-full h-80" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-2/3 mb-2" />
                      <Skeleton className="h-4 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-error mb-4">Failed to load products. Please try again.</p>
                <Button onClick={() => window.location.reload()}>Refresh</Button>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-lg mb-2">No products found</p>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={() => handleFilterChange({})}>Clear All Filters</Button>
              </div>
            )}
            
            {/* Pagination - For future implementation */}
            {sortedProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <span>...</span>
                  <Button variant="outline" size="sm">10</Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickView 
        product={quickViewProduct} 
        isOpen={isQuickViewOpen} 
        onClose={closeQuickView} 
      />
    </>
  );
}
