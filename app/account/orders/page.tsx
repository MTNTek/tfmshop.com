'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import HeaderNew from '@/components/HeaderNew';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: number;
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
  }>;
}

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [session]);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders-enhanced');
      if (!response.ok) {
        throw new Error('Failed to load orders');
      }
      
      const ordersData = await response.json();
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderNew />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to view your order history.
            </p>
            <a
              href="/auth/signin"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
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
            <p>Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNew />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your order history</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛍️</div>
              <h2 className="text-2xl font-semibold mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <a
                href="/"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <span className="text-2xl">{getStatusIcon(order.status)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Placed on {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="font-semibold text-lg">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={item.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {item.quantity}× {item.product_name}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <a
                        href={`/order-confirmation/${order.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center text-sm"
                      >
                        View Details
                      </a>
                      
                      {(order.status === 'delivered') && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                          Reorder
                        </button>
                      )}
                      
                      {(order.status === 'shipped' || order.status === 'delivered') && (
                        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                          Track Package
                        </button>
                      )}
                      
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <button className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm">
                          Cancel Order
                        </button>
                      )}

                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Statistics */}
          {orders.length > 0 && (
            <div className="mt-12 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {orders.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {orders.filter(o => o.status === 'delivered').length}
                  </div>
                  <div className="text-sm text-gray-600">Delivered</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Need help with an order?</p>
            <div className="flex justify-center gap-4">
              <a href="/support" className="text-green-600 hover:text-green-700 font-medium">
                Contact Support
              </a>
              <span className="text-gray-400">|</span>
              <a href="/faq" className="text-green-600 hover:text-green-700 font-medium">
                Order FAQ
              </a>
              <span className="text-gray-400">|</span>
              <a href="/returns" className="text-green-600 hover:text-green-700 font-medium">
                Returns & Exchanges
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
