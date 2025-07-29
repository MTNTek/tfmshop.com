'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Truck, Shield, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string;
  category?: string;
  category_id?: string;
  image?: string;
  images?: string[];
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
}

export default function ProductPage() {
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.slug) {
      loadProduct(params.slug as string);
    }
  }, [params.slug]);

  const loadProduct = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const productRes = await fetch(`/api/products/${slug}`);
      if (!productRes.ok) {
        throw new Error('Product not found');
      }
      
      const productData = await productRes.json();
      setProduct(productData);

      if (productData.category_id) {
        try {
          const relatedRes = await fetch(`/api/products?category=${productData.category}&limit=4`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            const filtered = relatedData.products.filter((p: RelatedProduct) => p.id !== productData.id);
            setRelatedProducts(filtered.slice(0, 4));
          }
        } catch (err) {
          console.error('Failed to load related products:', err);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const productImages = product.images || [product.image || '/api/placeholder/600/600'];
  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="aspect-square mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg border"
              />
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="ml-2">
                      -{discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <Button
                onClick={addToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  2 Year Warranty
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw className="h-4 w-4" />
                  Easy Returns
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              {product.specifications && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">SKU:</span>
                    <span className="text-gray-600">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Category:</span>
                    <span className="text-gray-600">{product.category || 'General'}</span>
                  </div>
                </div>
              </div>

              {product.tags && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <a
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="bg-white rounded-lg shadow border hover:shadow-lg transition-shadow"
                >
                  <img
                    src={relatedProduct.image || '/api/placeholder/300/300'}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-medium mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <p className="text-green-600 font-bold">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
