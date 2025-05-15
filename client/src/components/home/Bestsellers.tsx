import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/ui/star-rating';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'wouter';

export default function Bestsellers() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', { bestSeller: true }],
  });

  const { addToCart } = useCart();
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          Our Bestsellers
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-96" />
                <div className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-5 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-error">
            Failed to load bestsellers. Please try again later.
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md group">
                <div className="relative card-zoom">
                  <Link href={`/products/${product.id}`}>
                    <a>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-96 object-cover"
                      />
                    </a>
                  </Link>
                  <div className="absolute top-4 right-4">
                    <button 
                      className="bg-white/80 text-primary p-2 rounded-full hover:bg-primary hover:text-white transition" 
                      aria-label="Add to wishlist"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      className="w-full"
                      onClick={() => addToCart(product, 1)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex mb-2">
                    <StarRating 
                      rating={product.rating} 
                      showScore={true} 
                      reviewCount={product.reviewCount} 
                    />
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <a>
                      <h3 className="font-display text-lg font-semibold mb-1 text-neutral-dark hover:text-primary transition">
                        {product.name}
                      </h3>
                    </a>
                  </Link>
                  <p className="text-primary font-semibold mb-2">
                    {formatPrice(product.discountPrice || product.price)}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No bestsellers available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
