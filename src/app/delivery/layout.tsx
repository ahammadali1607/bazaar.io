"use client";

import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-700 text-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Bazaar Delivery</h1>
              <p className="text-[10px] text-purple-200">Partner App</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-purple-200 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Store
          </Link>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
