"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart-context";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  MapPin,
  Truck,
  User,
  ShieldCheck,
} from "lucide-react";

export default function Header() {
  const { totalItems, subtotal, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" /> Free delivery on orders above ₹299
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-1 hover:text-primary-light transition">
              <ShieldCheck className="w-3 h-3" /> Admin Panel
            </Link>
            <Link href="/delivery" className="flex items-center gap-1 hover:text-primary-light transition">
              <Truck className="w-3 h-3" /> Delivery Partner
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Bazaar</h1>
              <p className="text-[10px] text-gray-500 leading-tight flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> Village Grocery Store
              </p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <form
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for atta, dal, rice, vegetables..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition px-3 py-2 rounded-lg hover:bg-green-50"
            >
              <User className="w-4 h-4" />
              <span>Track Order</span>
            </Link>

            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <>
                  <span className="hidden sm:inline">
                    {totalItems} item{totalItems > 1 ? "s" : ""}
                  </span>
                  <span className="hidden sm:inline font-bold">₹{subtotal.toFixed(0)}</span>
                  <span className="sm:hidden absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                </>
              )}
            </button>

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  setMenuOpen(false);
                }
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <Link href="/products" className="block py-2 text-sm text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>
              All Products
            </Link>
            <Link href="/track" className="block py-2 text-sm text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>
              Track Order
            </Link>
            <Link href="/admin" className="block py-2 text-sm text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>
              Admin Panel
            </Link>
            <Link href="/delivery" className="block py-2 text-sm text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>
              Delivery Partner
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
