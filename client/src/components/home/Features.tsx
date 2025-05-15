import React from 'react';
import { Truck, RefreshCw, Shield, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders above ₹5000'
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '10-day return policy'
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Multiple payment options'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Dedicated customer service'
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
