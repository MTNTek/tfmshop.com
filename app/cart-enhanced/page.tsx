import React from 'react';
import HeaderNew from '@/components/HeaderNew';
import ShoppingCartEnhanced from '@/components/ShoppingCartEnhanced';
import Footer from '@/components/Footer';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNew />
      
      <main className="flex-1">
        <ShoppingCartEnhanced />
      </main>

      <Footer />
    </div>
  );
}
