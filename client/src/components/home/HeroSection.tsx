import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative">
      <div 
        className="h-[500px] md:h-[600px] lg:h-[700px] bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl text-white">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Elegant Traditions, Modern Grace
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Discover our exclusive collection of handcrafted sarees that blend timeless traditions with contemporary elegance.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                asChild
                className="bg-primary hover:bg-primary-dark text-white"
                size="lg"
              >
                <Link href="/products">
                  <a>Shop Collection</a>
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white"
                size="lg"
              >
                <Link href="/about">
                  <a>Explore Styles</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
