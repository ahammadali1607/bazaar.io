"use client";

import { useState } from "react";
import { useCart } from "@/store/cart-context";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  CreditCard,
  Banknote,
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  Truck,
} from "lucide-react";

export default function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    village: "",
    pincode: "",
    notes: "",
    paymentMethod: "cod",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const deliveryFee = subtotal >= 299 ? 0 : 30;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          subtotal,
          deliveryFee,
          total,
        }),
      });
      const order = await res.json();
      setOrderPlaced(order.orderNumber);
      setOrderId(order.id);
      clearCart();
    } catch {
      alert("Failed to place order. Please try again.");
    }
    setSubmitting(false);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-500 mb-2">
            Your order <span className="font-bold text-primary">{orderPlaced}</span> has been placed.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            We&apos;ll deliver your groceries soon. Thank you for shopping with Bazaar!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/track?order=${orderId}`}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" /> Track Order
            </Link>
            <Link
              href="/"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to checkout</p>
        <Link
          href="/products"
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Delivery Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      value={form.customerEmail}
                      onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      required
                      rows={2}
                      placeholder="House no, street, landmark..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Village / Town
                  </label>
                  <input
                    type="text"
                    placeholder="Village name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    value={form.village}
                    onChange={(e) => setForm({ ...form, village: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit pincode"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Order Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      rows={2}
                      placeholder="Any special instructions..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: "cod" })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                    form.paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Banknote className={`w-6 h-6 ${form.paymentMethod === "cod" ? "text-primary" : "text-gray-400"}`} />
                  <div className="text-left">
                    <p className="font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: "upi" })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                    form.paymentMethod === "upi"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${form.paymentMethod === "upi" ? "text-primary" : "text-gray-400"}`} />
                  <div className="text-left">
                    <p className="font-semibold text-sm">UPI / Online</p>
                    <p className="text-xs text-gray-500">Pay via UPI or card</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit - Mobile */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : `Place Order · ₹${total.toFixed(0)}`}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:order-last">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-32">
            <h2 className="font-bold text-lg text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ₹{item.price.toFixed(0)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-primary font-medium" : ""}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(0)}</span>
              </div>
            </div>

            {/* Desktop Place Order */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.customerName || !form.customerPhone || !form.address}
              className="hidden lg:flex w-full items-center justify-center bg-primary text-white py-3.5 rounded-xl font-bold mt-4 hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {submitting ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
