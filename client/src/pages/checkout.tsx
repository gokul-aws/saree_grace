import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Checkout form schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  pincode: z.string().min(6, { message: 'Valid pincode is required' }),
  paymentMethod: z.enum(['cod', 'card', 'upi'], { required_error: 'Payment method is required' }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  
  const shippingFee = cartTotal >= 5000 ? 0 : 99;
  const totalWithShipping = cartTotal + shippingFee;
  
  // Form setup
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      paymentMethod: 'cod',
    },
  });
  
  // Redirect to cart if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderSuccess]);
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && !orderSuccess) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to checkout',
        variant: 'destructive',
      });
      navigate('/login?redirect=checkout');
    }
  }, [isAuthenticated, navigate, toast, orderSuccess]);
  
  async function onSubmit(data: CheckoutFormValues) {
    if (cartItems.length === 0) {
      setOrderError('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    setOrderError('');
    
    try {
      // Create the shipping address string
      const shippingAddress = `${data.address}, ${data.city}, ${data.state} - ${data.pincode}`;
      
      // Submit order
      const response = await apiRequest('POST', '/api/orders', {
        total: totalWithShipping,
        shippingAddress,
        paymentMethod: data.paymentMethod,
      });
      
      if (response.ok) {
        const orderData = await response.json();
        setOrderSuccess(true);
        clearCart();
        
        toast({
          title: 'Order placed successfully!',
          description: `Your order #${orderData.id} has been confirmed.`,
        });
      } else {
        const errorData = await response.json();
        setOrderError(errorData.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      setOrderError('An unexpected error occurred. Please try again later.');
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (orderSuccess) {
    return (
      <>
        <Helmet>
          <title>Order Confirmation - Saree Grace</title>
          <meta name="description" content="Your order has been successfully placed. Thank you for shopping with Saree Grace." />
        </Helmet>
        
        <div className="bg-neutral-light py-6">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-3xl md:text-4xl font-bold">Order Confirmation</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-4">Thank You for Your Order!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been received and is now being processed. We'll send you a confirmation email with your order details.
            </p>
            <div className="space-y-4 mb-8">
              <Button asChild className="px-8">
                <a href="/account/orders">View Orders</a>
              </Button>
              <Button asChild variant="outline" className="px-8">
                <a href="/">Continue Shopping</a>
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              If you have any questions about your order, please contact our customer support team.
            </p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout - Saree Grace</title>
        <meta name="description" content="Complete your purchase securely at Saree Grace. Easy checkout process with multiple payment options." />
        <meta property="og:title" content="Checkout - Saree Grace" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-neutral-light py-6">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Checkout</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-display text-xl font-bold mb-6">Shipping Information</h2>
              
              {orderError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p className="text-red-700">{orderError}</p>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="Pincode" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="font-display text-xl font-bold mb-4">Payment Method</h2>
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-3"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="cod" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Cash on Delivery
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="card" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Credit/Debit Card
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="upi" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  UPI Payment
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-start">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-3 mb-6">
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
              
              <p className="text-xs text-gray-500 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
