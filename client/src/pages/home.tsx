import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import PromoBanner from '@/components/home/PromoBanner';
import Bestsellers from '@/components/home/Bestsellers';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Saree Grace - Premium Saree Collection</title>
        <meta name="description" content="Discover our exclusive collection of handcrafted sarees that blend timeless traditions with contemporary elegance at Saree Grace." />
        <meta property="og:title" content="Saree Grace - Premium Saree Collection" />
        <meta property="og:description" content="Discover our exclusive collection of handcrafted sarees that blend timeless traditions with contemporary elegance." />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroSection />
      <FeaturedCategories />
      <NewArrivals />
      <PromoBanner />
      <Bestsellers />
      <Features />
      <Testimonials />
      <Newsletter />
    </>
  );
}
