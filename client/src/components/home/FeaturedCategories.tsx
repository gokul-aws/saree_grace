import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedCategories() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fallback data if API is not available
  const fallbackCategories = [
    {
      id: 1,
      name: 'Traditional',
      slug: 'traditional',
      description: 'Timeless elegance in silk and heritage weaves',
      imageUrl: 'https://pixabay.com/get/g9d3692017c224cac8370705f3becf7283dc130a6a11a503d5d47a6710b50baa61b504bee4d8b3f7a0d62cd70b12037845cb1313df7e4f58b82803890421b6659_1280.jpg'
    },
    {
      id: 2,
      name: 'Contemporary',
      slug: 'contemporary',
      description: 'Modern designs for the confident woman',
      imageUrl: 'https://pixabay.com/get/g11ab50d59a35e5a5b2276b896aa77db409d62882275fe4926f55e729f3bfb31a8548816f67625b96134376c8aee2b2f1e536f62aede1c80ab40d6e106330ff4d_1280.jpg'
    },
    {
      id: 3,
      name: 'Bridal',
      slug: 'bridal',
      description: 'Luxurious pieces for your special day',
      imageUrl: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80'
    },
    {
      id: 4,
      name: 'Casual',
      slug: 'casual',
      description: 'Everyday comfort with effortless style',
      imageUrl: 'https://pixabay.com/get/g170c1ff2ed34336117c124b162f4adbeeddce594ba340d64361bc1c5061ef5d3cb5c32b85f7bfd6745c0a4f00aba7ca2822cfd5b99781bd96df41954560a66af_1280.jpg'
    }
  ];

  const displayCategories = categories || fallbackCategories;

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
        Our Featured Collections
      </h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg">
              <Skeleton className="w-full h-80" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-error">
          Failed to load categories. Please try again later.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <div key={category.id} className="relative overflow-hidden rounded-lg group card-zoom">
              <img 
                src={category.imageUrl} 
                alt={`${category.name} Collection`} 
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-display text-xl font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-white text-sm mb-4">
                  {category.description}
                </p>
                <Link href={`/products?category=${category.slug}`}>
                  <a className="inline-block text-white border-b border-white hover:border-secondary transition">
                    Explore Collection
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
