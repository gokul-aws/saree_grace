import React from 'react';
import { Link } from 'wouter';
import { 
  MapPin, Phone, Mail, Clock, 
  Facebook, Instagram, Twitter, 
  CreditCard, Coins
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-display text-xl font-bold mb-6">Saree Grace</h3>
            <p className="text-gray-300 mb-6">
              Celebrating the artistry and elegance of traditional Indian sarees with a contemporary twist.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-secondary transition" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-gray-300 hover:text-white transition">Shop</a>
                </Link>
              </li>
              <li>
                <Link href="/products?new=true">
                  <a className="text-gray-300 hover:text-white transition">Collections</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-white transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-white transition">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-display text-xl font-bold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/account">
                  <a className="text-gray-300 hover:text-white transition">My Account</a>
                </Link>
              </li>
              <li>
                <Link href="/account/orders">
                  <a className="text-gray-300 hover:text-white transition">Track Order</a>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <a className="text-gray-300 hover:text-white transition">Returns & Exchanges</a>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <a className="text-gray-300 hover:text-white transition">Shipping Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-300 hover:text-white transition">FAQs</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-display text-xl font-bold mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-secondary mt-1 mr-3" />
                <span className="text-gray-300">
                  123 Fashion Street, Textile Market, Mumbai, India - 400001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-secondary mr-3" />
                <span className="text-gray-300">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-secondary mr-3" />
                <span className="text-gray-300">info@sareegrace.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-secondary mr-3" />
                <span className="text-gray-300">Monday-Saturday: 10AM - 8PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Payment Methods and Copyright */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Saree Grace. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <CreditCard className="h-6 w-6 text-gray-300" />
              <CreditCard className="h-6 w-6 text-gray-300" />
              <Coins className="h-6 w-6 text-gray-300" />
              <CreditCard className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
