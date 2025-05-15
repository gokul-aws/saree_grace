import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { Check, Heart, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailProps {
  productId: number;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });
  
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
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full h-[500px] rounded-lg" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-full h-20" />
              ))}
            </div>
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-5 w-1/3 mb-4" />
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-error">Failed to load product details. Please try again later.</p>
        <Button asChild className="mt-4">
          <Link href="/products">
            <a>Back to Products</a>
          </Link>
        </Button>
      </div>
    );
  }
  
  const discountPercentage = getDiscountPercentage(product.price, product.discountPrice);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/">
          <a className="hover:text-primary">Home</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/products">
          <a className="hover:text-primary">Products</a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-700">{product.name}</span>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="mb-4">
            <img 
              src={product.images?.[selectedImage] || product.imageUrl} 
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {(product.images || [product.imageUrl]).map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${product.name} - View ${index + 1}`}
                className={`w-full h-24 object-cover rounded cursor-pointer ${
                  selectedImage === index ? 'border-2 border-primary' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Product Information */}
        <div className="lg:w-1/2">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {product.isNewArrival && <Badge variant="new">New</Badge>}
              {product.isBestSeller && <Badge variant="bestseller">Bestseller</Badge>}
              
              {/* Replace with actual category name when available */}
              <Badge variant="outline">
                {product.categoryId === 1 ? 'Traditional' : 
                product.categoryId === 2 ? 'Contemporary' :
                product.categoryId === 3 ? 'Bridal' : 'Casual'}
              </Badge>
            </div>
            
            <h1 className="font-display text-3xl font-bold mb-2">{product.name}</h1>
            
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
                  <span className="bg-success/10 text-success text-sm font-medium px-2 py-1 rounded ml-2">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
          </div>
          
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
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  onClick={incrementQuantity}
                >
                  +
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              {product.stock > 10 
                ? <span className="text-success">In Stock</span>
                : product.stock > 0
                  ? <span className="text-warning">Only {product.stock} left</span>
                  : <span className="text-error">Out of Stock</span>
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              className="flex-grow"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
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
          
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-600 mt-2">
                Crafted with attention to detail, this saree represents the perfect blend of tradition and contemporary style, making it a versatile addition to your wardrobe.
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2">
                  <span className="font-medium">Fabric</span>
                </div>
                <div className="p-2">
                  <span>Premium Silk</span>
                </div>
                <div className="bg-gray-50 p-2">
                  <span className="font-medium">Length</span>
                </div>
                <div className="p-2">
                  <span>6.3 meters</span>
                </div>
                <div className="bg-gray-50 p-2">
                  <span className="font-medium">Blouse Piece</span>
                </div>
                <div className="p-2">
                  <span>Included</span>
                </div>
                <div className="bg-gray-50 p-2">
                  <span className="font-medium">Care</span>
                </div>
                <div className="p-2">
                  <span>Dry Clean Only</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                {product.reviewCount > 0 ? (
                  <p className="text-gray-600">Reviews will be displayed here.</p>
                ) : (
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
