// components/StockResult.tsx
import { InventoryItem } from "../types/inventory";
import Image from "next/image";

type Props = {
  item: InventoryItem;
};

const stockColor = (quantity: number) => {
  if (quantity === 0) return "text-red-600 bg-red-50 border-red-200";
  if (quantity < 5) return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-green-600 bg-green-50 border-green-200";
};

export default function StockResult({ item }: Props) {
  const availabilityColor = stockColor(item.stock_quantity);

  return (
    <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-end gap-4">
        {/* Product Image with fallback */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={item.image || "/placeholder-image.png"}  // fallback added
            alt={item.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 relative">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {item.name}
            </h3>
            <span className={`px-2.5 absolute -top-5 right-0 py-0.5 text-xs font-medium rounded-full border ${availabilityColor}`}>
              {item.stock_quantity === 0
                ? "Out of Stock"
                : `${item.stock_quantity} in stock`}
            </span>
          </div>
          <p className="text-sm text-gray-500">Product #{item.product_id}</p>
          <p className="text-sm text-gray-600">Category: {item.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-sm font-medium">K{item.price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Available Sizes</p>
          <p className="text-sm font-medium">
            {item.available_sizes.length > 0
              ? item.available_sizes.join(", ")
              : "None available"}
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-400">{item.description}</div>
    </div>
  );
}