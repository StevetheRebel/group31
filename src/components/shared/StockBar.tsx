interface StockBarProps {
  stock: number;
  maxStock?: number;
  showLabel?: boolean;
}

export default function StockBar({
  stock,
  maxStock = 100,
  showLabel = true,
}: StockBarProps) {
  const percent = Math.min(100, Math.round((stock / maxStock) * 100));
  let level: "high" | "medium" | "low" | "empty" = "empty";
  if (stock === 0) level = "empty";
  else if (stock > maxStock * 0.5) level = "high";
  else if (stock > maxStock * 0.2) level = "medium";
  else level = "low";

  const barColor = {
    high: "bg-green-500",
    medium: "bg-yellow-500",
    low: "bg-red-500",
    empty: "bg-gray-600",
  }[level];

  const labelText =
    stock === 0
      ? "Sold Out"
      : stock <= 3
        ? `Only ${stock} left!`
        : stock <= 8
          ? `${stock} pairs remaining`
          : `${stock} pairs available`;

  return (
    <div className="space-y-1">
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: stock === 0 ? "100%" : `${percent}%` }}
        />
      </div>
      {showLabel && (
        <p
          className={`text-xs font-semibold ${
            level === "high"
              ? "text-green-400"
              : level === "medium"
                ? "text-yellow-400"
                : level === "low"
                  ? "text-red-400"
                  : "text-gray-500"
          }`}
        >
          {labelText}
        </p>
      )}
    </div>
  );
}
