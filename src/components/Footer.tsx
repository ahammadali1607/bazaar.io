"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Bazaar</h3>
                <p className="text-xs text-gray-400">Village Grocery Store</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Delivering fresh groceries to every village doorstep. Quality products at affordable prices.
            </p>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition cursor-pointer">
                <span className="text-xs">📘</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition cursor-pointer">
                <span className="text-xs">📸</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition cursor-pointer">
                <span className="text-xs">🐦</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-primary transition">All Products</Link></li>
              <li><Link href="/track" className="hover:text-primary transition">Track Order</Link></li>
              <li><Link href="/checkout" className="hover:text-primary transition">Checkout</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=1" className="hover:text-primary transition">Vegetables</Link></li>
              <li><Link href="/products?category=2" className="hover:text-primary transition">Fruits</Link></li>
              <li><Link href="/products?category=3" className="hover:text-primary transition">Dairy & Eggs</Link></li>
              <li><Link href="/products?category=5" className="hover:text-primary transition">Rice, Atta & Dal</Link></li>
              <li><Link href="/products?category=4" className="hover:text-primary transition">Spices</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>Main Market, Village Bazaar, Uttar Pradesh - 226001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <span>hello@bazaargrocery.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© 2026 Bazaar Grocery. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Villages
          </span>
        </div>
      </div>
    </footer>
  );
}
