import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewArrivals() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', { newArrival: true }],
  });
  
  const categories = ['all', 'traditional', 'contemporary', 'bridal', 'casual'];
  
  // Filter products by category if a specific one is selected
  const filteredProducts = products?.filter(product => 
    activeFilter === 'all' || product.categoryId === categories.indexOf(activeFilter)
  );

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold">New Arrivals</h2>
          <Link href="/products?new=true">
            <a className="hidden md:block text-primary hover:text-primary-dark font-medium transition">
              View All <span aria-hidden="true">→</span>
            </a>
          </Link>
        </div>
        
        {/* Product Filter Tabs */}
        <div className="flex overflow-x-auto space-x-6 mb-8 pb-2 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              className={`
                whitespace-nowrap font-medium pb-2 border-b-2 
                ${activeFilter === category 
                  ? 'text-primary border-primary' 
                  : 'text-neutral-dark hover:text-primary border-transparent'
                }
              `}
              onClick={() => setActiveFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-80" />
                <div className="p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-error">
            Failed to load products. Please try again later.
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No products found in this category.</p>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Button asChild className="md:hidden">
            <Link href="/products?new=true">
              <a>View All Products</a>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
