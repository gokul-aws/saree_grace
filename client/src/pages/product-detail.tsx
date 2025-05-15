import React from 'react';
import { Helmet } from 'react-helmet';
import { useRoute } from 'wouter';
import ProductDetail from '@/components/product/ProductDetail';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
  const [match, params] = useRoute('/products/:id');
  const productId = match ? parseInt(params.id) : 0;
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: productId > 0,
  });
  
  // Related products query
  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ['/api/products', { 
      category: product?.categoryId,
      limit: 4,
      exclude: productId
    }],
    enabled: !!product,
  });
  
  if (!match) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/products">Go to Products</a>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      {product && (
        <Helmet>
          <title>{product.name} - Saree Grace</title>
          <meta 
            name="description" 
            content={product.description.substring(0, 160)} 
          />
          <meta property="og:title" content={`${product.name} - Saree Grace`} />
          <meta property="og:description" content={product.description.substring(0, 160)} />
          <meta property="og:image" content={product.imageUrl} />
          <meta property="og:type" content="product" />
          <meta property="product:price:amount" content={`${product.discountPrice || product.price}`} />
          <meta property="product:price:currency" content="INR" />
        </Helmet>
      )}
      
      <ProductDetail productId={productId} />
      
      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-12 bg-neutral-light">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
              You May Also Like
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <a href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                  <div className="p-4">
                    <a 
                      href={`/products/${product.id}`}
                      className="font-display text-lg font-semibold hover:text-primary transition"
                    >
                      {product.name}
                    </a>
                    <p className="text-primary font-medium mt-1">
                      ₹{product.discountPrice || product.price}
                      {product.discountPrice && (
                        <span className="text-gray-500 text-sm line-through ml-2">
                          ₹{product.price}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
