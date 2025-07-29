'use client'

import React, { useState } from 'react';
import { Star, StarHalf, ShoppingCart, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  stock?: number;
  slug?: string;
}

const ProductCardNew: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  badge,
  stock = 0,
  slug,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-orange-400 text-orange-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (stock <= 0) {
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Could show a toast notification here
        console.log('Product added to cart successfully');
      } else {
        const error = await response.json();
        console.error('Failed to add to cart:', error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const productUrl = `/product/${slug || id}`;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200 h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-white p-4">
          {badge && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600"
            >
              {badge}
            </Badge>
          )}
          
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 p-2 h-auto bg-white hover:bg-gray-100 shadow-sm"
            suppressHydrationWarning={true}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </Button>

          <Link href={productUrl}>
            <div className="relative aspect-square">
              <Image
                src={image || '/placeholder-product.jpg'}
                alt={title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col">
          <Link href={productUrl}>
            <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-gray-600">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center mb-3">
            <span className="text-lg font-bold text-gray-900 mr-2">
              ${price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-3">
            {stock > 0 ? (
              <span className="text-sm text-green-600">
                {stock > 10 ? 'In Stock' : `Only ${stock} left`}
              </span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || stock <= 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          suppressHydrationWarning={true}
        >
          {isAddingToCart ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : stock <= 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCardNew;
