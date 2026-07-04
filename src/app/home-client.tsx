"use client";

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import {
  Truck,
  Clock,
  Shield,
  Leaf,
  ChevronRight,
  Zap,
  ArrowRight,
  Timer,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  mrp: string | null;
  unit: string;
  image: string | null;
  images: string[] | null;
  categoryId: number | null;
  stock: number | null;
  isActive: boolean | null;
  isFeatured: boolean | null;
  rating: string | null;
  reviewCount: number | null;
  tags: string[] | null;
  createdAt: Date | null;
}

interface Props {
  categories: Category[];
  featured: Product[];
  products: Product[];
}

export default function HomeClient({ categories, featured, products }: Props) {
  const needsSeed = categories.length === 0 && products.length === 0;

  const handleSeed = async () => {
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      window.location.reload();
    } else {
      alert("Seeding failed: " + data.error);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Seed Prompt */}
      {needsSeed && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Bazaar!</h2>
            <p className="text-gray-500 mb-6">
              The store is empty. Click below to seed the database with demo products, categories, and reviews.
            </p>
            <button
              onClick={handleSeed}
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/20"
            >
              🌱 Seed Database
            </button>
          </div>
        </div>
      )}

      {!needsSeed && (
        <>
          {/* Hero Banner */}
          <section className="relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-medium">Delivering to your village!</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                    Fresh Groceries,
                    <br />
                    <span className="text-yellow-300">Village Prices</span>
                  </h1>
                  <p className="text-lg text-green-100 mb-8 max-w-lg">
                    Get farm-fresh vegetables, fruits, dairy, and daily essentials
                    delivered right to your doorstep. Quality you can trust!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/products"
                      className="bg-white text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 hover:text-green-900 transition shadow-lg flex items-center gap-2"
                    >
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                      <Timer className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm font-semibold">Delivery in 30 mins</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block relative">
                  <div className="relative w-full aspect-square max-w-md mx-auto">
                    <div className="absolute inset-4 bg-white/10 rounded-full" />
                    <Image
                      src="https://images.pexels.com/photos/9070106/pexels-photo-9070106.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=500&w=500"
                      alt="Fresh Groceries"
                      fill
                      className="object-cover rounded-full p-6"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    {/* Floating badges */}
                    <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-xl p-3 animate-bounce-subtle">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🥬</span>
                        <div>
                          <p className="text-xs font-bold text-gray-900">100% Fresh</p>
                          <p className="text-[10px] text-gray-500">Farm to door</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-10 left-0 bg-white rounded-2xl shadow-xl p-3 animate-bounce-subtle" style={{ animationDelay: "0.5s" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🚛</span>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Free Delivery</p>
                          <p className="text-[10px] text-gray-500">Orders above ₹299</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Strip */}
          <section className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Truck, title: "Free Delivery", desc: "On orders ₹299+" },
                  { icon: Clock, title: "30 Min Delivery", desc: "Ultra fast service" },
                  { icon: Shield, title: "Quality Assured", desc: "Freshness guaranteed" },
                  { icon: Leaf, title: "Farm Fresh", desc: "Direct from farms" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
                <p className="text-sm text-gray-500 mt-0.5">Browse our wide range of products</p>
              </div>
              <Link
                href="/products"
                className="flex items-center gap-1 text-primary font-medium text-sm hover:underline"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                    {cat.image && (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-sm">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Products */}
          {featured.length > 0 && (
            <section className="bg-white border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      ⭐ Featured Products
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Handpicked bestsellers for you</p>
                  </div>
                  <Link
                    href="/products"
                    className="flex items-center gap-1 text-primary font-medium text-sm hover:underline"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {featured.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Promo Banner */}
          <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-3xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 items-center p-8 md:p-12">
                <div className="text-white">
                  <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Limited Offer
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3">
                    Save up to 40%<br />on Fresh Produce!
                  </h2>
                  <p className="text-white/80 mb-6">
                    Farm-fresh vegetables and fruits at unbeatable prices.
                    Order now and get free delivery!
                  </p>
                  <Link
                    href="/products?category=1"
                    className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition"
                  >
                    Shop Vegetables <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="hidden md:flex justify-center">
                  <div className="relative w-64 h-64">
                    <Image
                      src="https://images.pexels.com/photos/12298301/pexels-photo-12298301.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400"
                      alt="Fresh Produce"
                      fill
                      className="object-cover rounded-2xl rotate-3 shadow-2xl"
                      sizes="256px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* All Products */}
          {products.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 pb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🛒 All Products</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Browse our complete range</p>
                </div>
                <Link
                  href="/products"
                  className="flex items-center gap-1 text-primary font-medium text-sm hover:underline"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Trust Section */}
          <section className="bg-green-50 border-t border-green-100">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Why Choose Bazaar?</h2>
                <p className="text-gray-500 text-sm mt-1">Trusted by 10,000+ village families</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    emoji: "🌾",
                    title: "Direct from Farms",
                    desc: "We source directly from local farmers, ensuring freshness and supporting the local community.",
                  },
                  {
                    emoji: "💰",
                    title: "Village-Friendly Prices",
                    desc: "Fair pricing with no hidden charges. Save up to 30% compared to retail stores.",
                  },
                  {
                    emoji: "🚚",
                    title: "Doorstep Delivery",
                    desc: "We deliver to every street in the village. No need to travel to the market anymore!",
                  },
                ].map(({ emoji, title, desc }) => (
                  <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                    <span className="text-4xl">{emoji}</span>
                    <h3 className="font-bold text-gray-900 mt-3 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
