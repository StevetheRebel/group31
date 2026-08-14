"use client";

import { useState, FormEvent } from "react";
import { InventoryItem } from "../types/inventory";
import { findInventoryItem } from "../data/inventory";
import StockResult from "./StockResult";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import SupportMessage from "./SupportMessage";
import { Search, Boxes } from "lucide-react";

type LookupState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; item: InventoryItem }
  | { type: "notFound" }
  | { type: "error"; message: string }
  | { type: "invalid"; message: string };

export default function StockLookup() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<LookupState>({ type: "idle" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setState({
        type: "invalid",
        message: "Please enter a product name or SKU.",
      });
      return;
    }

    setState({ type: "loading" });

    await new Promise((resolve) => setTimeout(resolve, 600));

    const item = findInventoryItem(trimmedQuery);

    if (item) {
      setState({ type: "success", item });
    } else {
      setState({ type: "notFound" });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Boxes className="w-5 h-5 text-primary-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900">
            Stock Availability Lookup
          </h2>
        </div>
        <p className="text-sm text-gray-500">
          Search by product name or SKU to check current stock levels.
        </p>
      </div>

      <div className="px-6 py-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="stockQuery"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Product Name or SKU
            </label>
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center ">
              <div className="relative w-full">
                <input
                  id="stockQuery"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Nike Air Max 270 or P001"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  aria-describedby="stockQueryHelp"
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
                    <span className="w-4 h-4 border-2 border-red-500/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" aria-hidden="true" />
                    Check Stock
                  </>
                )}
              </button>
            </div>
            <p id="stockQueryHelp" className="mt-1.5 text-xs text-gray-500">
              Try: Nike, Air Jordan, P001, P002, etc.
            </p>
          </div>
        </form>
      </div>

      <div className="px-6 pb-6">
        {state.type === "idle" && (
          <EmptyState
            title="No Product Selected"
            message="Search for a product above to view its stock availability and details."
          />
        )}

        {state.type === "loading" && (
          <LoadingState message="Checking stock levels..." />
        )}

        {state.type === "success" && <StockResult item={state.item} />}

        {state.type === "notFound" && (
          <div className="space-y-4">
            <ErrorState
              title="Product Not Found"
              message="We couldn't find a matching product. Please check your search details and try again."
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
