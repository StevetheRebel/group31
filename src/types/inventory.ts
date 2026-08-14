export type InventoryItem = {
  product_id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  available_sizes: number[];
  stock_quantity: number;
  image?: string;
};