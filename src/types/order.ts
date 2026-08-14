// types/order.ts
export type Order = {
  order_id: string;
  customer_name: string;
  product: string;
  size: number;
  status: "Processing" | "Confirmed" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";
  order_date: string;
  expected_delivery: string | null;
  image?: string;
};