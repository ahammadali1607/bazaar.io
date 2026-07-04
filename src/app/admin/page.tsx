"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Truck,
  IndianRupee,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
} from "lucide-react";

interface Stats {
  products: number;
  categories: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  revenue: number;
  deliveryPersons: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shimmer h-32" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Products", value: stats.products, icon: Package, color: "bg-blue-500", bg: "bg-blue-50" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-green-500", bg: "bg-green-50" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "bg-amber-500", bg: "bg-amber-50" },
    { label: "Delivered", value: stats.deliveredOrders, icon: CheckCircle2, color: "bg-emerald-500", bg: "bg-emerald-50" },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: "bg-purple-500", bg: "bg-purple-50" },
    { label: "Categories", value: stats.categories, icon: TrendingUp, color: "bg-pink-500", bg: "bg-pink-50" },
    { label: "Delivery Partners", value: stats.deliveryPersons, icon: Truck, color: "bg-indigo-500", bg: "bg-indigo-50" },
    { label: "Active Users", value: "1.2K+", icon: Users, color: "bg-teal-500", bg: "bg-teal-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/admin/orders"
            className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition"
          >
            <Clock className="w-8 h-8 text-amber-500" />
            <div>
              <p className="font-semibold text-sm">Pending Orders</p>
              <p className="text-xs text-gray-500">{stats.pendingOrders} orders waiting</p>
            </div>
          </a>
          <a
            href="/admin/products"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
          >
            <Package className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-semibold text-sm">Manage Products</p>
              <p className="text-xs text-gray-500">{stats.products} products listed</p>
            </div>
          </a>
          <a
            href="/admin/delivery"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
          >
            <Truck className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-semibold text-sm">Delivery Team</p>
              <p className="text-xs text-gray-500">{stats.deliveryPersons} active partners</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
