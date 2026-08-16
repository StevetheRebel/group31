"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Loader2
        className="w-8 h-8 text-white/50 animate-spin mb-3"
        aria-hidden="true"
      />
      <p className="text-sm text-white/70">{message}</p>
    </div>
  );
}
