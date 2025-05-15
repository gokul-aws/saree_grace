import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

// Define cart item type
export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

// Define cart context type
type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  addToCart: (product: Product, quantity: number) => void;
  updateCartItemQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
};

// Create cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart ID counter
let nextCartItemId = 1;

// Cart provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Calculate cart total and count
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        
        // Find the highest ID to set the counter properly
        if (parsedCart.length > 0) {
          const maxId = Math.max(...parsedCart.map((item: CartItem) => item.id));
          nextCartItemId = maxId + 1;
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        toast({
          title: "Item updated in cart",
          description: `${product.name} quantity updated to ${updatedItems[existingItemIndex].quantity}`,
        });
        
        return updatedItems;
      } else {
        // Add new item if product doesn't exist
        toast({
          title: "Item added to cart",
          description: `${product.name} has been added to your cart`,
        });
        
        return [...prevItems, { id: nextCartItemId++, product, quantity }];
      }
    });
    
    // Open cart after adding item
    setIsCartOpen(true);
  };

  // Update cart item quantity
  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      
      if (itemToRemove) {
        toast({
          title: "Item removed from cart",
          description: `${itemToRemove.product.name} has been removed from your cart`,
        });
      }
      
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
