"use client";

import { useCart } from "@/store/cart-context";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, setCartOpen, updateQuantity, removeItem, totalItems, subtotal } = useCart();

  const deliveryFee = subtotal >= 299 ? 0 : 30;
  const total = subtotal + deliveryFee;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">My Cart</h2>
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
              {totalItems} items
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-4">Start adding items to your cart</p>
              <button
                onClick={() => setCartOpen(false)}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 bg-gray-50 rounded-xl p-3 animate-fade-in"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">{item.unit}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-bold text-sm text-primary">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-red-500" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-primary font-medium" : ""}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-amber-600">
                  Add ₹{(299 - subtotal).toFixed(0)} more for free delivery!
                </p>
              )}
              <div className="flex justify-between font-bold text-base pt-1.5 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(0)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/20"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
