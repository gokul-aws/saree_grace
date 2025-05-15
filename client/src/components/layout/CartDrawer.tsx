import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  X, Trash2, Plus, Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    updateCartItemQuantity, 
    removeFromCart,
    cartTotal
  } = useCart();
  
  if (!isCartOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div 
        className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-display text-xl font-bold">
            Your Cart ({cartItems.length})
          </h2>
          <button 
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-4">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <ShoppingBag className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-gray-500 text-center mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button
              onClick={toggleCart}
              className="w-full max-w-xs"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-grow p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex py-4 border-b border-gray-200">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.product.category}
                    </p>
                    <div className="flex justify-between items-center mt-2">
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
                      <span className="font-semibold">
                        {formatPrice(item.product.discountPrice || item.product.price)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="ml-2 text-gray-400 hover:text-error" 
                    aria-label="Remove item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span className="text-success">
                  {cartTotal >= 5000 ? 'Free' : formatPrice(99)}
                </span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>{formatPrice(cartTotal >= 5000 ? cartTotal : cartTotal + 99)}</span>
              </div>
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full"
                >
                  <Link href="/checkout">
                    <a>Checkout</a>
                  </Link>
                </Button>
                <Button
                  onClick={toggleCart}
                  variant="outline"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// For empty cart state
function ShoppingBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
