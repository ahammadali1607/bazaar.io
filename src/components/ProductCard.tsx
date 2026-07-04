"use client";

import { useCart } from "@/store/cart-context";
import { Star, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    mrp: string | null;
    unit: string;
    image: string | null;
    rating: string | null;
    reviewCount: number | null;
    tags: string[] | null;
    isFeatured: boolean | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.productId === product.id);
  const discount =
    product.mrp && parseFloat(product.mrp) > parseFloat(product.price)
      ? Math.round(
          ((parseFloat(product.mrp) - parseFloat(product.price)) /
            parseFloat(product.mrp)) *
            100
        )
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 group flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              ⭐ FEATURED
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 text-accent fill-accent" />
              <span className="text-xs font-semibold text-green-800">
                {parseFloat(product.rating).toFixed(1)}
              </span>
            </div>
            {product.reviewCount != null && product.reviewCount > 0 && (
              <span className="text-[10px] text-gray-400">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5 line-clamp-2 hover:text-primary transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mb-2">{product.unit}</p>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <span className="text-base font-bold text-gray-900">
              ₹{parseFloat(product.price).toFixed(0)}
            </span>
            {product.mrp &&
              parseFloat(product.mrp) > parseFloat(product.price) && (
                <span className="text-xs text-gray-400 line-through ml-1.5">
                  ₹{parseFloat(product.mrp).toFixed(0)}
                </span>
              )}
          </div>

          {cartItem ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  updateQuantity(product.id, cartItem.quantity - 1)
                }
                className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-sm font-bold text-primary">
                {cartItem.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(product.id, cartItem.quantity + 1)
                }
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: parseFloat(product.price),
                  mrp: product.mrp ? parseFloat(product.mrp) : undefined,
                  image: product.image || "",
                  unit: product.unit,
                  quantity: 1,
                })
              }
              className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-2 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
