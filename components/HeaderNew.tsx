'use client';

import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, User, Package, MapPin, ChevronDown, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const Header = () => {
  const { data: session, status } = useSession();
  const [cartCount] = useState(3);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-[#000f0a] text-white">
      {/* Top bar */}
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex items-center justify-between py-2 md:py-3">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg md:text-xl font-bold hover:text-orange-400 transition-colors">
              TFMshop<span className="text-orange-400">.com</span>
            </Link>
          </div>

          {/* Location (hidden on mobile) */}
          <div className="hidden md:flex items-center text-xs">
            <MapPin className="w-4 h-4 mr-1" />
            <div>
              <div className="text-xs text-gray-300 text-[11px]">Deliver to</div>
              <div className="font-semibold text-sm">New York 10001</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-r-none border-gray-300 bg-gray-100 text-black hover:bg-gray-200 px-3 hidden md:flex items-center"
                    suppressHydrationWarning={true}
                  >
                    All
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Departments</DropdownMenuItem>
                  <DropdownMenuItem>Electronics</DropdownMenuItem>
                  <DropdownMenuItem>Clothing</DropdownMenuItem>
                  <DropdownMenuItem>Home & Garden</DropdownMenuItem>
                  <DropdownMenuItem>Sports</DropdownMenuItem>
                  <DropdownMenuItem>Books</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Input
                type="text"
                placeholder="Search products..."
                className="flex-1 rounded-none border-gray-300 md:rounded-l-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                suppressHydrationWarning={true}
              />
              
              <Button 
                className="bg-orange-500 hover:bg-orange-600 rounded-l-none px-4"
                suppressHydrationWarning={true}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Language/Country Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="hidden md:flex items-center text-white hover:bg-gray-800 p-2"
                  suppressHydrationWarning={true}
                >
                  <div className="w-5 h-3 mr-1 bg-red-500 bg-gradient-to-b from-red-500 via-white to-red-500 border border-gray-300"></div>
                  EN
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
                <DropdownMenuItem>🇪🇸 Español</DropdownMenuItem>
                <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex flex-col md:flex-row items-center text-white hover:bg-gray-800 p-2"
                  suppressHydrationWarning={true}
                >
                  <User className="w-4 h-4 md:mr-1" />
                  <div className="hidden md:block text-left">
                    <div className="text-xs">
                      {status === 'loading' ? 'Loading...' : 
                       status === 'authenticated' ? `Hello, ${session?.user?.name || 'User'}` : 
                       'Hello, Sign in'}
                    </div>
                    <div className="text-sm font-semibold">Account & Lists</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {status === 'authenticated' ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="w-full">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    {session?.user?.email === 'admin@tfmshop.com' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/orders" className="w-full">
                            <Package className="mr-2 h-4 w-4" />
                            Manage Orders
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signin" className="w-full">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signup" className="w-full">
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Orders */}
            <Button 
              variant="ghost" 
              className="hidden md:flex flex-col items-center text-white hover:bg-gray-800 p-2"
              suppressHydrationWarning={true}
              asChild
            >
              <Link href="/orders">
                <Package className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs">Returns</div>
                  <div className="text-sm font-semibold">& Orders</div>
                </div>
              </Link>
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              className="flex items-center text-white hover:bg-gray-800 p-2 relative"
              suppressHydrationWarning={true}
              asChild
            >
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:block ml-1">
                  <div className="text-xs">Cart</div>
                </div>
              </Link>
            </Button>

            {/* Mobile menu */}
            <Button 
              variant="ghost" 
              className="md:hidden text-white hover:bg-gray-800"
              suppressHydrationWarning={true}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
