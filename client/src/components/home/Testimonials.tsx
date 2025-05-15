import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Testimonial } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Skeleton } from '@/components/ui/skeleton';

export default function Testimonials() {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // Fallback testimonials if the API is not yet available
  const fallbackTestimonials = [
    {
      id: 1,
      name: 'Riya Sharma',
      location: 'Delhi',
      rating: 5,
      comment: 'I ordered a traditional silk saree for my wedding and was amazed by the quality and craftsmanship. The detailed embroidery and rich color exceeded my expectations. Will definitely shop again!',
      avatarInitials: 'RS',
      avatarColor: 'bg-primary',
      featured: true
    },
    {
      id: 2,
      name: 'Anita Patel',
      location: 'Mumbai',
      rating: 4.5,
      comment: 'Fast delivery and excellent customer service. The contemporary saree I purchased fits perfectly and the color is exactly as shown on the website. Love the modern design with traditional elements.',
      avatarInitials: 'AP',
      avatarColor: 'bg-secondary',
      featured: true
    },
    {
      id: 3,
      name: 'Lakshmi Rao',
      location: 'Bangalore',
      rating: 5,
      comment: 'This was my third purchase from Saree Grace and I am consistently impressed by their collection. The casual cotton sarees are perfect for everyday wear and the quality is outstanding for the price.',
      avatarInitials: 'LR',
      avatarColor: 'bg-primary-light',
      featured: true
    }
  ];

  const displayTestimonials = testimonials || fallbackTestimonials;
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-24 w-full mb-6" />
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-error">
            Failed to load testimonials. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <p className="text-gray-600 mb-6">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center text-white font-semibold mr-4`}>
                      {testimonial.avatarInitials}
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
