"use client";

import { MessageCircle } from "lucide-react";

interface SupportMessageProps {
  message?: string;
}

export default function SupportMessage({
  message = "If you still need help, please contact customer support at +1 000 000 001",
}: SupportMessageProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
      <MessageCircle
        className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}
