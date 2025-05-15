import React from 'react';
import { Link } from 'wouter';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@shared/schema';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    // Wishlist functionality would be implemented here
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md group">
      <div className="relative card-zoom">
        <Link href={`/products/${product.id}`}>
          <a>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-80 object-cover"
            />
          </a>
        </Link>
        
        {/* Product badges */}
        <div className="absolute top-4 left-4">
          {product.isNewArrival && (
            <Badge variant="new" className="text-xs font-medium">New</Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="bestseller" className="text-xs font-medium ml-2">Bestseller</Badge>
          )}
        </div>
        
        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            className="bg-white text-primary p-3 rounded-full mx-2 hover:bg-primary hover:text-white transition" 
            aria-label="Quick view"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            className="bg-white text-primary p-3 rounded-full mx-2 hover:bg-primary hover:text-white transition" 
            aria-label="Add to wishlist"
            onClick={handleAddToWishlist}
          >
            <Heart className="h-4 w-4" />
          </button>
          <button 
            className="bg-white text-primary p-3 rounded-full mx-2 hover:bg-primary hover:text-white transition" 
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <a>
            <h3 className="font-display text-lg font-semibold mb-1 text-neutral-dark hover:text-primary transition">
              {product.name}
            </h3>
          </a>
        </Link>
        
        <p className="text-sm text-gray-600 mb-2">
          {/* Replace with actual category name when available */}
          {product.categoryId === 1 ? 'Traditional' : 
           product.categoryId === 2 ? 'Contemporary' :
           product.categoryId === 3 ? 'Bridal' : 'Casual'}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-primary">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            
            {product.discountPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <StarRating rating={product.rating} />
        </div>
      </div>
    </div>
  );
}
