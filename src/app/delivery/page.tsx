"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Truck,
  Navigation,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  village: string | null;
  items: OrderItem[];
  total: string;
  status: string;
  createdAt: string | null;
}

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "delivered">("pending");
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const statusMap = {
      pending: "confirmed",
      active: "out_for_delivery",
      delivered: "delivered",
    };
    const res = await fetch(`/api/orders?status=${statusMap[activeTab]}`);
    setOrders(await res.json());
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Deliveries</h1>
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Truck className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["pending", "active", "delivered"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition capitalize ${
              activeTab === tab
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {tab === "pending" ? "To Pickup" : tab === "active" ? "On Route" : "Completed"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shimmer h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Package className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <p className="font-medium text-gray-800 mb-1">No orders here</p>
          <p className="text-sm text-gray-500">
            {activeTab === "pending"
              ? "No orders to pick up right now"
              : activeTab === "active"
              ? "No active deliveries"
              : "No completed deliveries yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
                <span className="font-bold text-primary text-lg">₹{parseFloat(order.total).toFixed(0)}</span>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1.5">
                <p className="text-sm font-medium">{order.customerName}</p>
                <div className="flex items-start gap-1.5 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{order.address}{order.village ? `, ${order.village}` : ""}</span>
                </div>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center gap-1.5 text-xs text-purple-600 font-medium"
                >
                  <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
                </a>
              </div>

              {/* Items */}
              <div className="text-xs text-gray-500 mb-3">
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} ×{item.quantity}
                    {i < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {activeTab === "pending" && (
                  <button
                    onClick={() => updateStatus(order.id, "out_for_delivery")}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
                  >
                    <Navigation className="w-4 h-4" /> Start Delivery
                  </button>
                )}
                {activeTab === "active" && (
                  <button
                    onClick={() => updateStatus(order.id, "delivered")}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Delivered
                  </button>
                )}
                {activeTab === "delivered" && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Delivered Successfully
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
