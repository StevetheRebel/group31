"use client";

import { useState } from "react";
import SectionHeader from "../shared/SectionHeader";
import ProductCard from "./ProductCard";
import { inventoryItems } from "@/src/data/inventory";
// import { ProductCard } from "./ProductCard";
// import { SectionHeader } from "@/components/shared/SectionHeader";
// import { Button } from "@/components/shared/Button";

type Category = "all" | "sneakers" | "running" | "casual" | "heels" | "luxury";

const categories: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Sneakers", value: "sneakers" },
  { label: "Running", value: "running" },
  { label: "Casual", value: "casual" },
  { label: "Heels", value: "heels" },
  { label: "Luxury", value: "luxury" },
];

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredProducts =
    activeCategory === "all"
      ? inventoryItems
      : inventoryItems.filter(
          (p) => p.category.toLowerCase() === activeCategory,
        );

  return (
    <section className="py-20 bg-gray-900" id="shop">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          eyebrow="Our Collection"
          title="Fresh Drops"
          subtitle="Authentic footwear, real prices. Pick your pair."
        />

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider md:text-sm transition-all ${
                activeCategory === cat.value
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-transparent border border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
