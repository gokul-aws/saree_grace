import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { 
    cartItems, 
    updateCartItemQuantity, 
    removeFromCart, 
    cartTotal,
    cartCount
  } = useCart();
  
  const shippingFee = cartTotal >= 5000 ? 0 : 99;
  const totalWithShipping = cartTotal + shippingFee;
  
  return (
    <>
      <Helmet>
        <title>Shopping Cart - Saree Grace</title>
        <meta name="description" content="Review and manage the items in your shopping cart before proceeding to checkout." />
        <meta property="og:title" content="Shopping Cart - Saree Grace" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-neutral-light py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Shopping Cart</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {cartCount > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="hidden md:grid md:grid-cols-12 mb-4 text-sm font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Subtotal</div>
                </div>
                
                <Separator className="mb-6 hidden md:block" />
                
                {cartItems.map((item) => (
                  <div key={item.id} className="py-6 border-b border-gray-100 last:border-b-0">
                    <div className="md:grid md:grid-cols-12 flex flex-col gap-4">
                      {/* Product */}
                      <div className="col-span-6 flex">
                        <Link href={`/products/${item.product.id}`}>
                          <a className="w-20 h-20 rounded overflow-hidden">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </a>
                        </Link>
                        <div className="ml-4">
                          <Link href={`/products/${item.product.id}`}>
                            <a className="font-display font-medium hover:text-primary transition">
                              {item.product.name}
                            </a>
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.product.categoryId === 1 ? 'Traditional' : 
                            item.product.categoryId === 2 ? 'Contemporary' :
                            item.product.categoryId === 3 ? 'Bridal' : 'Casual'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 flex md:justify-center md:items-center">
                        <span className="md:hidden text-sm font-medium mr-2">Price:</span>
                        <span className="text-gray-900">
                          {formatPrice(item.product.discountPrice || item.product.price)}
                        </span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2 flex md:justify-center md:items-center">
                        <span className="md:hidden text-sm font-medium mr-2">Quantity:</span>
                        <div className="flex items-center border rounded">
                          <button 
                            className="px-2 py-1 text-gray-600"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 py-1">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 text-gray-600"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="col-span-2 flex justify-between md:justify-center items-center">
                        <span className="md:hidden text-sm font-medium">Subtotal:</span>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                          </span>
                          <button 
                            className="ml-4 text-gray-400 hover:text-error transition"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Continue Shopping */}
                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/products">
                      <a className="flex items-center">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Continue Shopping
                      </a>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shippingFee === 0 ? 'text-success' : ''}>
                      {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg">{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>
                
                <Button asChild className="w-full mb-3">
                  <Link href="/checkout">
                    <a>Proceed to Checkout</a>
                  </Link>
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Free shipping on all orders above ₹5,000
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto">
            <div className="rounded-full bg-gray-100 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild className="px-8">
              <Link href="/products">
                <a>Start Shopping</a>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
