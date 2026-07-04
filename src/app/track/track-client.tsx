"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  Phone,
} from "lucide-react";

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  village: string | null;
  items: OrderItem[];
  subtotal: string;
  deliveryFee: string;
  total: string;
  status: string;
  paymentMethod: string | null;
  createdAt: string | null;
}

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock, color: "text-amber-500" },
  { key: "confirmed", label: "Confirmed", icon: Package, color: "text-blue-500" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck, color: "text-purple-500" },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, color: "text-green-500" },
];

export default function TrackClient() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = searchParams.get("order");
    if (id) {
      setOrderId(id);
      fetchOrder(id);
    }
  }, [searchParams]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch {
      setError("Order not found. Please check the order ID.");
      setOrder(null);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      fetchOrder(orderId.trim());
    }
  };

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Track Your Order
      </h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter Order ID (e.g., 1, 2, 3...)"
            className="w-full pl-12 pr-28 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition"
          >
            Track
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Looking up your order...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12 bg-red-50 rounded-2xl">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {order && (
        <div className="animate-fade-in space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg text-gray-900">
                  {order.orderNumber}
                </h2>
                <p className="text-sm text-gray-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "out_for_delivery"
                    ? "bg-purple-100 text-purple-700"
                    : order.status === "confirmed"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>

            {/* Progress Steps */}
            {order.status !== "cancelled" && (
              <div className="flex items-center justify-between mt-6">
                {STATUS_STEPS.map((step, i) => {
                  const isCompleted = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-400"
                          } ${isCurrent ? "ring-4 ring-primary/20 animate-pulse-dot" : ""}`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-[10px] mt-1.5 font-medium ${
                            isCompleted ? "text-primary" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 ${
                            i < currentStepIndex ? "bg-primary" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Delivery Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-gray-600">{order.address}{order.village ? `, ${order.village}` : ""}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-600">{order.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="font-semibold text-sm">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{parseFloat(order.subtotal).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span>{parseFloat(order.deliveryFee) === 0 ? "FREE" : `₹${parseFloat(order.deliveryFee).toFixed(0)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-dashed">
                <span>Total</span>
                <span className="text-primary">₹{parseFloat(order.total).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
