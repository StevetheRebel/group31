# Northstar Support Dashboard – Go-Live Readiness Note

## 1. What Currently Works
The customer self-service dashboard is fully functional for two core support ticket types:

- **Order Status Lookup**: Customers can enter an order ID (`NS1001` – `NS1020`) and view:
  - Product name and image
  - Customer name, order date, and expected delivery
  - Colour‑coded status badge (Processing, Shipped, Delivered, Cancelled, etc.)
  - Clear error messages for empty or invalid IDs

- **Stock Availability Lookup**: Customers can search by product name or SKU and view:
  - All matching products (e.g., searching "Nike" returns all Nike variants)
  - Product image, category, price, and description
  - Real‑time stock quantity with colour‑coded status (Green = in stock, Orange = low stock, Red = out of stock)
  - Available sizes
  - Clear error and empty‑state messaging

- **Tab Navigation**: Both tools are accessible via a simple toggle interface on the `/dashboard` route.

- **Responsive Design**: The dashboard adapts to mobile, tablet, and desktop screens.

- **Support Escalation**: When a lookup fails, a "Contact Support" message is displayed with email and phone details.

---

## 2. Known-Broken or Incomplete
- **No live backend API** – all data is currently hardcoded in `src/data/orders.ts` and `src/data/inventory.ts`.
- **Order placement** – the dashboard is read‑only; customers cannot place new orders.
- **Return/refund requests** – this third ticket type is not yet implemented.
- **User authentication** – no login or session management is present.
- **Persistent order history** – orders are not stored across sessions.
- **Product images** – some images may be missing; a fallback placeholder is used.

---

## 3. What Data the System Uses
- **Orders**: Static array in `src/data/orders.ts` (20 mock orders with fields: `order_id`, `customer_name`, `product`, `status`, etc.)
- **Products / Inventory**: Static array in `src/data/inventory.ts` (20 mock products with fields: `product_id`, `name`, `category`, `price`, `stock_quantity`, `available_sizes`, `image`)
- **Images**: All product images are stored in `/public/shoes/` and referenced by path in the data files.

---

## 4. What Northstar's Team Needs to Take Over
- **Access to the repository** (GitHub) with full read/write permissions.
- **Local development environment**: Node.js (v18+), npm/yarn, a code editor (VS Code recommended).
- **To run the project**:
  ```bash
  npm install
  npm run dev