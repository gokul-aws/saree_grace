import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You have successfully subscribed to our newsletter.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Join Our Newsletter
        </h2>
        <p className="max-w-2xl mx-auto mb-8">
          Subscribe to receive updates on new collections, exclusive offers, and styling tips.
        </p>
        
        <form 
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-secondary text-neutral-dark"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="bg-secondary hover:bg-secondary-dark text-white font-medium whitespace-nowrap"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
