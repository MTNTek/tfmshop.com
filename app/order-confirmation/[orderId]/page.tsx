'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HeaderNew from '@/components/HeaderNew';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment_method: {
    type: string;
    cardNumber?: string;
  };
  items: Array<{
    id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    total: number;
  }>;
  created_at: number;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.orderId && session?.user) {
      loadOrder(params.orderId as string);
    }
  }, [params.orderId, session]);

  const loadOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders-enhanced?id=${orderId}`);
      if (!response.ok) {
        throw new Error('Order not found');
      }
      
      const orderData = await response.json();
      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderNew />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your order.</p>
            <a
              href="/auth/signin"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Sign In
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderNew />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderNew />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
            <a
              href="/account/orders"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 mr-4"
            >
              View All Orders
            </a>
            <a
              href="/"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Continue Shopping
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNew />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Order #{order.id.slice(0, 8)}</h2>
                  <p className="text-gray-600">Placed on {formatDate(order.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">
                        ${item.product_price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">${item.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Order Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                  <div className="text-gray-700">
                    <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                    <p>{order.shipping_address.address}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
                  <div className="text-gray-700">
                    {order.payment_method.type === 'card' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💳</span>
                        <div>
                          <p>Credit Card</p>
                          <p className="text-sm">**** **** **** {order.payment_method.cardNumber?.slice(-4)}</p>
                        </div>
                      </div>
                    )}
                    {order.payment_method.type === 'paypal' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔵</span>
                        <p>PayPal</p>
                      </div>
                    )}
                    {order.payment_method.type === 'apple_pay' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🍎</span>
                        <p>Apple Pay</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                You'll receive an email confirmation shortly
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                We'll notify you when your order ships
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Expected delivery: 3-5 business days
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/account/orders"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
            >
              View All Orders
            </a>
            <a
              href="/"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
            >
              Continue Shopping
            </a>
          </div>

          {/* Support */}
          <div className="text-center mt-8 pt-8 border-t">
            <p className="text-gray-600 mb-2">Need help with your order?</p>
            <div className="flex justify-center gap-4">
              <a href="/support" className="text-green-600 hover:text-green-700 font-medium">
                Contact Support
              </a>
              <span className="text-gray-400">|</span>
              <a href="/faq" className="text-green-600 hover:text-green-700 font-medium">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
