import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Check } from 'lucide-react';

// Registration form schema
const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, navigate] = useLocation();
  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form setup
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !success) {
      navigate('/account');
    }
  }, [isAuthenticated, navigate, success]);
  
  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError('');
    
    try {
      const success = await register(data.username, data.password, data.email, data.fullName);
      
      if (success) {
        setSuccess(true);
        toast({
          title: 'Registration successful!',
          description: 'Your account has been created.',
        });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      if (error.message && error.message.includes('Username already exists')) {
        setError('Username already exists. Please choose another one.');
      } else if (error.message && error.message.includes('Email already exists')) {
        setError('Email already exists. Please use another email or log in.');
      } else {
        setError('An error occurred. Please try again.');
        console.error('Registration error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  if (success) {
    return (
      <div className="bg-neutral-light min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-display text-center">Registration Successful</CardTitle>
              <CardDescription className="text-center">
                Your account has been created successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-gray-600">
                Thank you for joining Saree Grace! You can now log in to your account and start shopping.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">
                  <a>Log In</a>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Create Account - Saree Grace</title>
        <meta name="description" content="Join Saree Grace and create your account to enjoy personalized shopping experience, order tracking, and exclusive offers." />
        <meta property="og:title" content="Create Account - Saree Grace" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-neutral-light min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <Link href="/">
            <a className="block text-center mb-8">
              <h1 className="text-primary font-display text-3xl font-bold">Saree Grace</h1>
            </a>
          </Link>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Create Account</CardTitle>
              <CardDescription>
                Sign up to get started with Saree Grace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-sm">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" {...field} />
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
                          <Input type="email" placeholder="Your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login">
                  <a className="font-medium text-primary hover:text-primary-dark">
                    Log in
                  </a>
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
