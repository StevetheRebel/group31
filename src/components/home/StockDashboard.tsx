"use client";

import { inventoryItems } from "@/src/data/inventory";
import StockBar from "../shared/StockBar";
import SectionHeader from "../shared/SectionHeader";




export default function StockDashboard() {
  return (
    <section className="py-20 bg-black" id="stock">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          eyebrow="Availability"
          title="Live Stock"
          subtitle="Real-time stock levels for all products."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {inventoryItems.map((item) => (
            <div
              key={item.product_id}
              className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-red-500/30 transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white text-sm flex-1">{item.name}</h4>
                <span className="font-display text-xl text-red-500">{item.stock_quantity}</span>
              </div>
              <p className="text-xs text-red-400 uppercase tracking-wider mb-3">
                {item.category}
              </p>
              <StockBar stock={item.stock_quantity} maxStock={20} showLabel />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}