import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal, X } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';

interface ProductFilterProps {
  selectedCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  onFilter: (filters: {
    category?: string;
    priceRange?: [number, number];
    newArrivals?: boolean;
    bestSellers?: boolean;
    sale?: boolean;
  }) => void;
}

export default function ProductFilter({ 
  selectedCategory, 
  minPrice = 0, 
  maxPrice = 50000,
  onFilter 
}: ProductFilterProps) {
  const [, setLocation] = useLocation();
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [category, setCategory] = useState<string | undefined>(selectedCategory);
  const [newArrivals, setNewArrivals] = useState(false);
  const [bestSellers, setBestSellers] = useState(false);
  const [sale, setSale] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fallback categories if API is not available
  const fallbackCategories = [
    { id: 1, name: 'Traditional', slug: 'traditional' },
    { id: 2, name: 'Contemporary', slug: 'contemporary' },
    { id: 3, name: 'Bridal', slug: 'bridal' },
    { id: 4, name: 'Casual', slug: 'casual' }
  ];
  
  const displayCategories = categories || fallbackCategories;
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  const handleCategoryChange = (slug: string) => {
    setCategory(category === slug ? undefined : slug);
  };
  
  const handleApplyFilters = () => {
    onFilter({
      category,
      priceRange,
      newArrivals,
      bestSellers,
      sale
    });
    
    setIsOpen(false);
  };
  
  const handleClearFilters = () => {
    setCategory(undefined);
    setPriceRange([minPrice, maxPrice]);
    setNewArrivals(false);
    setBestSellers(false);
    setSale(false);
    
    onFilter({});
  };
  
  const handleApplyMobileFilters = () => {
    handleApplyFilters();
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:block w-64 pr-8">
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {displayCategories.map((cat) => (
                <div key={cat.id} className="flex items-center">
                  <Checkbox 
                    id={`category-${cat.slug}`}
                    checked={category === cat.slug}
                    onCheckedChange={() => handleCategoryChange(cat.slug)}
                  />
                  <Label 
                    htmlFor={`category-${cat.slug}`}
                    className="ml-2 cursor-pointer"
                  >
                    {cat.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Price Range</h3>
            <Slider 
              defaultValue={[priceRange[0], priceRange[1]]}
              min={minPrice}
              max={maxPrice}
              step={100}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handlePriceChange}
              className="mb-6"
            />
            <div className="flex justify-between items-center">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Filter By</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="new-arrivals"
                  checked={newArrivals}
                  onCheckedChange={(checked) => setNewArrivals(checked === true)}
                />
                <Label 
                  htmlFor="new-arrivals"
                  className="ml-2 cursor-pointer"
                >
                  New Arrivals
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="best-sellers"
                  checked={bestSellers}
                  onCheckedChange={(checked) => setBestSellers(checked === true)}
                />
                <Label 
                  htmlFor="best-sellers"
                  className="ml-2 cursor-pointer"
                >
                  Best Sellers
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="sale"
                  checked={sale}
                  onCheckedChange={(checked) => setSale(checked === true)}
                />
                <Label 
                  htmlFor="sale"
                  className="ml-2 cursor-pointer"
                >
                  On Sale
                </Label>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button 
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Filter */}
      <div className="md:hidden w-full mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter Products
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle className="font-display text-xl">Filter Products</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold mb-4">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {displayCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center">
                      <Checkbox 
                        id={`mobile-category-${cat.slug}`}
                        checked={category === cat.slug}
                        onCheckedChange={() => handleCategoryChange(cat.slug)}
                      />
                      <Label 
                        htmlFor={`mobile-category-${cat.slug}`}
                        className="ml-2 cursor-pointer"
                      >
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-display text-lg font-semibold mb-4">Price Range</h3>
                <Slider 
                  defaultValue={[priceRange[0], priceRange[1]]}
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="mb-6"
                />
                <div className="flex justify-between items-center">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-display text-lg font-semibold mb-4">Filter By</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="mobile-new-arrivals"
                      checked={newArrivals}
                      onCheckedChange={(checked) => setNewArrivals(checked === true)}
                    />
                    <Label 
                      htmlFor="mobile-new-arrivals"
                      className="ml-2 cursor-pointer"
                    >
                      New Arrivals
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="mobile-best-sellers"
                      checked={bestSellers}
                      onCheckedChange={(checked) => setBestSellers(checked === true)}
                    />
                    <Label 
                      htmlFor="mobile-best-sellers"
                      className="ml-2 cursor-pointer"
                    >
                      Best Sellers
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="mobile-sale"
                      checked={sale}
                      onCheckedChange={(checked) => setSale(checked === true)}
                    />
                    <Label 
                      htmlFor="mobile-sale"
                      className="ml-2 cursor-pointer"
                    >
                      On Sale
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 pt-4">
                <Button onClick={handleApplyMobileFilters}>
                  Apply Filters
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
