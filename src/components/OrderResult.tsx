// components/OrderResult.tsx
import { Order } from "../types/order";
import Image from "next/image";

type Props = {
  order: Order;
};

const statusColors = {
  Processing: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  "Out for Delivery": "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function OrderResult({ order }: Props) {
  const statusColor = statusColors[order.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-end gap-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={order.image || "/placeholder-image.png"}
            alt={order.product}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 ">
          <div className="relative flex flex-wrap items-center justify-between gap-2 ">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 ">
              {order.product}
            </h3>
            <span
              className={`px-2.5 py-0.5 text-xs absolute -top-5 right-0 font-medium rounded-full ${statusColor}`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-500">Order #{order.order_id}</p>
          <p className="text-sm text-gray-600 line-clamp-1 ">Customer: {order.customer_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Order Date</p>
          <p className="text-sm font-medium">
            {new Date(order.order_date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Expected Delivery</p>
          <p className="text-sm font-medium">
            {order.expected_delivery
              ? new Date(order.expected_delivery).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}