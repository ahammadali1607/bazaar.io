"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  unit: string;
  image: string | null;
  stock: number | null;
  isActive: boolean | null;
  isFeatured: boolean | null;
  rating: string | null;
  reviewCount: number | null;
  categoryId: number | null;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = selectedCategory ? `?category=${selectedCategory}` : "";
    fetch(`/api/products${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory]);

  const getCategoryName = (id: number | null) =>
    categories.find((c) => c.id === id)?.name || "—";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products Catalog</h1>
        <span className="text-sm text-gray-500">{products.length} products</span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
            !selectedCategory ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id.toString())}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              selectedCategory === c.id.toString() ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shimmer h-24" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:shadow-sm transition"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                {p.image && (
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500">{getCategoryName(p.categoryId)} · {p.unit}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm">₹{parseFloat(p.price).toFixed(0)}</p>
                    {p.mrp && parseFloat(p.mrp) > parseFloat(p.price) && (
                      <p className="text-xs text-gray-400 line-through">₹{parseFloat(p.mrp).toFixed(0)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs">
                  {p.rating && (
                    <span className="flex items-center gap-0.5 text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {parseFloat(p.rating).toFixed(1)}
                    </span>
                  )}
                  <span className="text-gray-400">Stock: {p.stock}</span>
                  {p.isFeatured && (
                    <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      FEATURED
                    </span>
                  )}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
