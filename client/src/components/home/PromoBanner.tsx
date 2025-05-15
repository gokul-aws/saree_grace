import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function PromoBanner() {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="bg-primary rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Exclusive Bridal Collection
            </h2>
            <p className="text-white/90 mb-6">
              Discover our handcrafted bridal sarees, perfect for making your special day even more memorable. 
              Featuring intricate embroidery and premium fabrics.
            </p>
            <div>
              <Button
                asChild
                className="bg-white text-primary hover:bg-neutral-light"
              >
                <Link href="/products?category=bridal">
                  <a>Explore Collection</a>
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Exclusive Bridal Collection" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
