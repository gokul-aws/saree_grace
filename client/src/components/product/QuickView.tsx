import React, { useState } from 'react';
import { Link } from 'wouter';
import { X, Check, Heart, Minus, Plus } from 'lucide-react';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      onClose();
    }
  };
  
  if (!isOpen || !product) return null;
  
  const discountPercentage = getDiscountPercentage(product.price, product.discountPrice);
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(product.images || [product.imageUrl]).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${product.name} - View ${index + 1}`}
                  className="w-full h-24 object-cover rounded cursor-pointer"
                />
              ))}
            </div>
          </div>
          
          {/* Product Information */}
          <div>
            <span className="text-sm text-primary font-medium mb-2 inline-block">
              {/* Replace with actual category name when available */}
              {product.categoryId === 1 ? 'Traditional' : 
              product.categoryId === 2 ? 'Contemporary' :
              product.categoryId === 3 ? 'Bridal' : 'Casual'}
            </span>
            
            <h2 className="font-display text-2xl font-bold mb-2">{product.name}</h2>
            
            <div className="flex items-center mb-4">
              <StarRating rating={product.rating} showScore={true} reviewCount={product.reviewCount} />
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              
              {product.discountPrice && (
                <>
                  <span className="text-gray-500 line-through ml-2">
                    {formatPrice(product.price)}
                  </span>
                  {discountPercentage && (
                    <span className="bg-success/10 text-success text-sm font-medium px-2 py-1 rounded ml-2">
                      Save {discountPercentage}%
                    </span>
                  )}
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Highlights:</h3>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                  <span>Pure handwoven fabric</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                  <span>Traditional design elements</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                  <span>Premium quality craftsmanship</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 mt-0.5" />
                  <span>Includes matching blouse piece</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <label className="font-semibold mr-4">Quantity:</label>
                <div className="flex items-center border rounded">
                  <button 
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-grow"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <Link href={`/products/${product.id}`}>
                <a className="text-primary hover:text-primary-dark font-medium">
                  View Full Details
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
