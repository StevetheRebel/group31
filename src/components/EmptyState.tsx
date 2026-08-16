"use client";

import { Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = "Ready to Search",
  message = "Enter your search details above to get started.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-white/60" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-white/70 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs text-pretty">{message}</p>
    </div>
  );
}
