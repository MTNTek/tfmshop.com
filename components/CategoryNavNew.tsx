'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CategoryNav = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data: Category[] = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to static categories if API fails
        setCategories([
          { id: '1', name: 'Electronics', slug: 'electronics', isActive: true, createdAt: '', updatedAt: '' },
          { id: '2', name: 'Clothing', slug: 'clothing', isActive: true, createdAt: '', updatedAt: '' },
          { id: '3', name: 'Home & Garden', slug: 'home-garden', isActive: true, createdAt: '', updatedAt: '' },
          { id: '4', name: 'Sports', slug: 'sports', isActive: true, createdAt: '', updatedAt: '' },
          { id: '5', name: 'Books', slug: 'books', isActive: true, createdAt: '', updatedAt: '' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <nav className="bg-[#001f14] border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center space-x-1 py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-600 animate-pulse rounded h-8 w-24"
              />
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#001f14] border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex items-center space-x-1 py-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className="text-white hover:bg-[#000f0a] whitespace-nowrap text-[14px] px-3 py-1"
              suppressHydrationWarning={true}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
