import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercentage(price: number, discountPrice: number | null | undefined): number | null {
  if (!discountPrice) return null;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function generateAvatarInitials(name: string): string {
  if (!name) return 'XX';
  
  const parts = name.split(' ');
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function getRandomColor(): string {
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-primary-light',
    'bg-secondary-light'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getStockStatusText(stockQuantity: number): string {
  if (stockQuantity > 10) return 'In Stock';
  if (stockQuantity > 0) return `Only ${stockQuantity} left`;
  return 'Out of Stock';
}

export function getStockStatusColor(stockQuantity: number): string {
  if (stockQuantity > 10) return 'text-success';
  if (stockQuantity > 0) return 'text-warning';
  return 'text-error';
}
