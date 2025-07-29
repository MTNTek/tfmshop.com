'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeaderNew from '@/components/HeaderNew';
import Footer from '@/components/Footer';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  quantity: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple_pay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export default function CheckoutEnhancedPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [processing, setProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/checkout-enhanced');
      return;
    }
    loadCart();
  }, [session, router]);

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to load cart');
      
      const data = await response.json();
      setCartItems(data.items || []);
      
      if (data.items?.length === 0) {
        router.push('/cart');
        return;
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping form
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const isValid = required.every(field => shippingAddress[field as keyof ShippingAddress]);
    
    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }
    
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod.type === 'card') {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      const isValid = required.every(field => paymentMethod[field as keyof PaymentMethod]);
      
      if (!isValid) {
        alert('Please fill in all payment details');
        return;
      }
    }
    
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    
    try {
      const orderData = {
        items: cartItems,
        shippingAddress,
        paymentMethod,
        totals: calculateTotals()
      };

      const response = await fetch('/api/orders-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to place order');
      
      const order = await response.json();
      
      // Clear cart
      await fetch('/api/cart/clear', { method: 'POST' });
      
      // Redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderNew />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNew />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              {['shipping', 'payment', 'review'].map((s, index) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step === s ? 'bg-green-600 text-white' :
                    ['shipping', 'payment', 'review'].indexOf(step) > index ? 'bg-green-200 text-green-800' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 font-medium ${
                    step === s ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                  {index < 2 && <div className="flex-1 h-px bg-gray-300 mx-4"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Shipping Information */}
              {step === 'shipping' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                  <form onSubmit={handleShippingSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          required
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Payment Information */}
              {step === 'payment' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { type: 'card', label: 'Credit Card', icon: '💳' },
                        { type: 'paypal', label: 'PayPal', icon: '🔵' },
                        { type: 'apple_pay', label: 'Apple Pay', icon: '🍎' }
                      ].map((method) => (
                        <button
                          key={method.type}
                          type="button"
                          onClick={() => setPaymentMethod({...paymentMethod, type: method.type as any})}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            paymentMethod.type === method.type
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{method.icon}</div>
                          <div className="font-medium">{method.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit}>
                    {paymentMethod.type === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentMethod.cardholderName}
                            onChange={(e) => setPaymentMethod({...paymentMethod, cardholderName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="1234 5678 9012 3456"
                            value={paymentMethod.cardNumber}
                            onChange={(e) => setPaymentMethod({...paymentMethod, cardNumber: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={paymentMethod.expiryDate}
                              onChange={(e) => setPaymentMethod({...paymentMethod, expiryDate: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="123"
                              value={paymentMethod.cvv}
                              onChange={(e) => setPaymentMethod({...paymentMethod, cvv: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod.type === 'paypal' && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🔵</div>
                        <p className="text-gray-600">You will be redirected to PayPal to complete your payment.</p>
                      </div>
                    )}

                    {paymentMethod.type === 'apple_pay' && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🍎</div>
                        <p className="text-gray-600">Use Touch ID or Face ID to pay with Apple Pay.</p>
                      </div>
                    )}

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep('shipping')}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Back to Shipping
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Review Order
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Order Review */}
              {step === 'review' && (
                <div className="space-y-6">
                  {/* Shipping Summary */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    <div className="text-gray-700">
                      <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p>{shippingAddress.address}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                      <p>{shippingAddress.country}</p>
                      <p className="mt-2">{shippingAddress.email}</p>
                      {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
                    </div>
                    <button
                      onClick={() => setStep('shipping')}
                      className="text-green-600 hover:text-green-700 font-medium mt-2"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                    <div className="flex items-center gap-3">
                      {paymentMethod.type === 'card' && (
                        <>
                          <span className="text-2xl">💳</span>
                          <div>
                            <p className="font-medium">Credit Card</p>
                            <p className="text-gray-600">**** **** **** {paymentMethod.cardNumber?.slice(-4)}</p>
                          </div>
                        </>
                      )}
                      {paymentMethod.type === 'paypal' && (
                        <>
                          <span className="text-2xl">🔵</span>
                          <p className="font-medium">PayPal</p>
                        </>
                      )}
                      {paymentMethod.type === 'apple_pay' && (
                        <>
                          <span className="text-2xl">🍎</span>
                          <p className="font-medium">Apple Pay</p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setStep('payment')}
                      className="text-green-600 hover:text-green-700 font-medium mt-2"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Place Order */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Processing Order...' : `Place Order - $${totals.total.toFixed(2)}`}
                    </button>
                    <p className="text-sm text-gray-500 text-center mt-3">
                      By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.productImage || '/api/placeholder/60/60'}
                        alt={item.productName}
                        className="w-15 h-15 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.productPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
