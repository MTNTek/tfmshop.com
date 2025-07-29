'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  badge?: string;
}

export default function ProductCard({
  id,
  image,
  name,
  price,
  originalPrice,
  rating = 0,
  reviewCount = 0,
  badge,
}: ProductCardProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-orange-400 text-orange-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const addToCart = async () => {
    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart/add', {
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
        toast({
          title: 'Success',
          description: 'Item added to cart',
        });
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsInWishlist(false);
          toast({
            title: 'Success',
            description: 'Removed from wishlist',
          });
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: id,
          }),
        });

        if (response.ok) {
          setIsInWishlist(true);
          toast({
            title: 'Success',
            description: 'Added to wishlist',
          });
        } else {
          const data = await response.json();
          if (data.error === 'Item already in wishlist') {
            setIsInWishlist(true);
            toast({
              title: 'Info',
              description: 'Item already in wishlist',
            });
          } else {
            throw new Error('Failed to add to wishlist');
          }
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wishlist',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200 h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-white p-4">
          {badge && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
              {badge}
            </span>
          )}
          <Button
            onClick={toggleWishlist}
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 z-10 p-1 h-8 w-8 rounded-full ${
              isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            disabled={isAddingToWishlist}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
          <Link href={`/product/${id}`}>
            <img
              src={image}
              alt={name}
              className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <Link href={`/product/${id}`}>
            <h3 className="text-sm md:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-2">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-gray-600">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center mb-3 mt-auto">
            <span className="text-lg md:text-xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={addToCart}
          disabled={isAddingToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          {isAddingToCart ? (
            'Adding...'
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
}
