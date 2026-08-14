// components/OrderLookup.tsx
"use client";

import { useState, FormEvent } from "react";
import { Order } from "../types/order";
import { findOrderById } from "../data/orders";
import OrderResult from "./OrderResult";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import SupportMessage from "./SupportMessage";
import { Search, Package } from "lucide-react";

type LookupState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; order: Order }
  | { type: "notFound" }
  | { type: "error"; message: string }
  | { type: "invalid"; message: string };

export default function OrderLookup() {
  const [orderId, setOrderId] = useState("");
  const [state, setState] = useState<LookupState>({ type: "idle" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedId = orderId.trim();

    if (!trimmedId) {
      setState({ type: "invalid", message: "Please enter your order ID." });
      return;
    }

    setState({ type: "loading" });

    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const order = findOrderById(trimmedId);

    if (order) {
      setState({ type: "success", order });
    } else {
      setState({ type: "notFound" });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Package className="w-5 h-5 text-primary-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900">
            Order Status Lookup
          </h2>
        </div>
        <p className="text-sm text-gray-500">
          Enter your order ID to check the current status and delivery estimate.
        </p>
      </div>

      <div className="px-6 py-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Order ID
            </label>
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center ">
              <div className="relative w-full">
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. NS1001" // ← updated
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  aria-describedby="orderIdHelp"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <button
                type="submit"
                disabled={state.type === "loading"}
                className="border shrink-0 disabled:border-red-100 rounded-lg text-black flex gap-2 px-2 py-2 items-center shadow-md"
              >
                {state.type === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" aria-hidden="true" />
                    Check Order Status
                  </>
                )}
              </button>
            </div>
            <p id="orderIdHelp" className="mt-1.5 text-xs text-gray-500">
              Try: NS1001, NS1002, NS1003, NS1004, NS1005, NS1006 // ← updated
            </p>
          </div>
        </form>
      </div>

      <div className="px-6 pb-6">
        {state.type === "idle" && (
          <EmptyState
            title="No Order Selected"
            message="Enter an order ID above to view its details and current status."
          />
        )}

        {state.type === "loading" && (
          <LoadingState message="Looking up your order..." />
        )}

        {state.type === "success" && <OrderResult order={state.order} />}

        {state.type === "notFound" && (
          <div className="space-y-4">
            <ErrorState
              title="Order Not Found"
              message="We couldn't find an order with this ID. Please check the ID and try again."
            />
            <SupportMessage />
          </div>
        )}

        {state.type === "invalid" && (
          <ErrorState title="Invalid Input" message={state.message} />
        )}

        {state.type === "error" && (
          <div className="space-y-4">
            <ErrorState message={state.message} />
            <SupportMessage />
          </div>
        )}
      </div>
    </div>
  );
}
