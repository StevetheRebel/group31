"use client";

import OrderLookup from "@/src/components/OrderLookup";
import StockLookup from "@/src/components/StockLookup";
import { useState } from "react";

type Tab = "order" | "stock";

export default function dashboard() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeTab, setActiveTab] = useState<Tab>("order");

  return (
    <section className="max-w-5xl mx-auto px-4 pt-16 md:px-8 lg:px-12 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2 mt-12">
        <p className="text-xs font-semibold tracking-widest text-gray-500">
          CUSTOMER SELF-SERVICE
        </p>
        <h1 className="font-bold text-3xl text-red-500">
          How can we help you today?
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl">
          Track an order or check product availability in seconds. If you
          can&apos;t find what you need, our support team is one click away.
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("order")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "order"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Order Status
        </button>
        <button
          onClick={() => setActiveTab("stock")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "stock"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Stock Availability
        </button>
      </div>

      {/* Active Form */}
      <div className="mt-4">
        {activeTab === "order" ? <OrderLookup key="order" /> : <StockLookup key="stock" />}
      </div>
    </section>
  );
}
