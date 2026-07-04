"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart-context";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Clock,
} from "lucide-react";

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: string | null;
}

interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  mrp: string | null;
  unit: string;
  image: string | null;
  images: string[] | null;
  rating: string | null;
  reviewCount: number | null;
  tags: string[] | null;
  isFeatured: boolean | null;
  stock: number | null;
  reviews: Review[];
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { items, addItem, updateQuantity } = useCart();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square shimmer rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 shimmer rounded w-3/4" />
            <div className="h-4 shimmer rounded w-1/2" />
            <div className="h-10 shimmer rounded w-1/3" />
            <div className="h-20 shimmer rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">😔</p>
        <h2 className="text-xl font-bold mb-2">Product not found</h2>
        <Link href="/products" className="text-primary hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const cartItem = items.find((i) => i.productId === product.id);
  const discount =
    product.mrp && parseFloat(product.mrp) > parseFloat(product.price)
      ? Math.round(
          ((parseFloat(product.mrp) - parseFloat(product.price)) /
            parseFloat(product.mrp)) *
            100
        )
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-200"
        }`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                {discount}% OFF
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-primary bg-white shrink-0"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(parseFloat(product.rating))}</div>
              <span className="text-sm font-semibold text-gray-700">
                {parseFloat(product.rating).toFixed(1)}
              </span>
              {product.reviewCount != null && product.reviewCount > 0 && (
                <span className="text-sm text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500 mb-4">{product.unit}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-gray-900">
              ₹{parseFloat(product.price).toFixed(0)}
            </span>
            {product.mrp &&
              parseFloat(product.mrp) > parseFloat(product.price) && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{parseFloat(product.mrp).toFixed(0)}
                </span>
              )}
            {discount > 0 && (
              <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded">
                Save ₹{(parseFloat(product.mrp!) - parseFloat(product.price)).toFixed(0)}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            {cartItem ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(product.id, cartItem.quantity - 1)
                  }
                  className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center text-xl font-bold">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(product.id, cartItem.quantity + 1)
                  }
                  className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-dark transition"
                >
                  <Plus className="w-5 h-5" />
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
                className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/20"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, label: "Free Delivery", sub: "Above ₹299" },
              { icon: Clock, label: "30 Min", sub: "Fast delivery" },
              { icon: RotateCcw, label: "Easy Return", sub: "No questions" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="bg-gray-50 rounded-xl p-3 text-center"
              >
                <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-800">{label}</p>
                <p className="text-[10px] text-gray-500">{sub}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> About this product
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 rounded-xl p-4 animate-fade-in"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {review.customerName.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-sm text-gray-900">
                      {review.customerName}
                    </span>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 ml-10">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
