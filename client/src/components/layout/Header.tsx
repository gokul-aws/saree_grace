import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Menu, Search, User, ShoppingBag, ChevronDown, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const { user } = useAuth();
  const { cartItems, toggleCart } = useCart();
  const [location] = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCollections = () => setIsCollectionsOpen(!isCollectionsOpen);
  
  const categories = [
    { name: 'Traditional', slug: '/products?category=traditional' },
    { name: 'Contemporary', slug: '/products?category=contemporary' },
    { name: 'Bridal', slug: '/products?category=bridal' },
    { name: 'Casual', slug: '/products?category=casual' }
  ];
  
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden flex items-center"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="text-primary font-display text-2xl md:text-3xl font-bold">Saree Grace</a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/">
              <a className={`font-medium ${isActive('/') ? 'text-primary' : 'hover:text-primary'} transition`}>
                Home
              </a>
            </Link>
            
            <div className="relative group">
              <button 
                className="font-medium hover:text-primary transition flex items-center"
                onClick={() => {}}
              >
                Collections <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10 hidden group-hover:block">
                {categories.map((category) => (
                  <Link key={category.slug} href={category.slug}>
                    <a className="block px-4 py-2 hover:bg-neutral-light">
                      {category.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
            
            <Link href="/products?new=true">
              <a className={`font-medium ${isActive('/products?new=true') ? 'text-primary' : 'hover:text-primary'} transition`}>
                New Arrivals
              </a>
            </Link>
            
            <Link href="/products?sale=true">
              <a className={`font-medium ${isActive('/products?sale=true') ? 'text-primary' : 'hover:text-primary'} transition`}>
                Sale
              </a>
            </Link>
            
            <Link href="/about">
              <a className={`font-medium ${isActive('/about') ? 'text-primary' : 'hover:text-primary'} transition`}>
                About Us
              </a>
            </Link>
            
            <Link href="/contact">
              <a className={`font-medium ${isActive('/contact') ? 'text-primary' : 'hover:text-primary'} transition`}>
                Contact
              </a>
            </Link>
          </nav>
          
          {/* Search, Account, Cart */}
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <a className="hover:text-primary transition" aria-label="Search">
                <Search className="h-5 w-5" />
              </a>
            </Link>
            
            <Link href={user ? "/account" : "/login"}>
              <a className="hover:text-primary transition" aria-label="Account">
                <User className="h-5 w-5" />
              </a>
            </Link>
            
            <button
              onClick={toggleCart}
              className="hover:text-primary transition relative" 
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link href="/">
              <a className="block py-2 font-medium">Home</a>
            </Link>
            
            <div className="py-2">
              <button 
                className="flex w-full justify-between items-center font-medium"
                onClick={toggleCollections}
              >
                Collections <ChevronDown className={`h-4 w-4 transition-transform ${isCollectionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCollectionsOpen && (
                <div className="pl-4 pt-2 space-y-2">
                  {categories.map((category) => (
                    <Link key={category.slug} href={category.slug}>
                      <a className="block py-1">{category.name}</a>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link href="/products?new=true">
              <a className="block py-2 font-medium">New Arrivals</a>
            </Link>
            
            <Link href="/products?sale=true">
              <a className="block py-2 font-medium">Sale</a>
            </Link>
            
            <Link href="/about">
              <a className="block py-2 font-medium">About Us</a>
            </Link>
            
            <Link href="/contact">
              <a className="block py-2 font-medium">Contact</a>
            </Link>
          </div>
          
          <button 
            onClick={toggleMenu} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </header>
  );
}
