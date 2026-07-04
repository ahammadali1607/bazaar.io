"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, Truck, XCircle, Package } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
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
  paymentMethod: string | null;
  createdAt: string | null;
}

const STATUS_OPTIONS = ["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: Package,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : "";
    const res = await fetch(`/api/orders${params}`);
    setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
            !filter ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"
          }`}
        >
          All Orders
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize whitespace-nowrap ${
              filter === s ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shimmer h-24" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const Icon = STATUS_ICONS[order.status] || Clock;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {order.customerName} · {order.customerPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                    <span className="font-bold text-primary">₹{parseFloat(order.total).toFixed(0)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">
                    <p>{order.items.length} items · {order.address}{order.village ? `, ${order.village}` : ""}</p>
                    <p className="mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                      {order.paymentMethod ? ` · ${order.paymentMethod.toUpperCase()}` : ""}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary/30 outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
