# Dashboard Screen States – Design Documentation

## Overview
This document defines all possible screen states for the customer self‑service dashboard, covering both **Order Status** and **Stock Availability** lookups.

---

## 1. Order Status Lookup – States

### 1.1 Idle / Initial State

**Description:** The default state before any action is taken.

**Visual:**
- Heading: **Order Status Lookup**
- Subtext: *Enter your order ID to check the current status and delivery estimate.*
- Input field with label: **Order ID**
- Helper text: *Try: NS1001, NS1002, NS1003…*
- Button: **Check Order Status** (enabled when input has text)
- Empty state message: *No Order Selected – Enter an order ID above to view its details and current status.*

**Screenshot:** <img src="../../public/Evidence/Order status lookup - successful order lookup.png" width="1360" height="742">

---

### 1.2 Loading State

**Description:** Displayed while the system is looking up the order.

**Visual:**
- Input field is disabled.
- Button shows a spinner and changes label to **Searching…**
- Loading message: *Looking up your order…*



---

### 1.3 Successful Order Lookup

**Description:** Valid order ID found.

**Visual:**
- Product image (80×80px, rounded)
- Product name (bold)
- Order ID (e.g., `#NS1001`)
- Customer name
- Status badge (color‑coded):
  - **Processing:** Yellow
  - **Confirmed:** Blue
  - **Shipped:** Purple
  - **Out for Delivery:** Orange
  - **Delivered:** Green
  - **Cancelled:** Red
- Order date and expected delivery (formatted)
- If cancelled, expected delivery shows `—`

**Screenshot:** <img src="../../public/Evidence/Order status lookup - successful order lookup.png" width="1236" height="622">

---

### 1.4 Order Not Found

**Description:** Valid input but no matching order ID.

**Visual:**
- ErrorState: **Order Not Found** – *We couldn't find an order with this ID. Please check the ID and try again.*
- SupportMessage component: *Still need help? Contact our support team at support@northstar.com or call +254 700 123 456.*

**Screenshot:** <img src="../../public/Evidence/Order not found.png" width="1320" height="687">

---

## 2. Stock Availability Lookup – States

### 2.1 Idle / Initial State

**Description:** Default state before searching.

**Visual:**
- Heading: **Stock Availability Lookup**
- Subtext: *Search by product name or SKU to check current stock levels.*
- Input field with label: **Product Name or SKU**
- Helper text: *Try: Nike, Air Jordan, P001, P002…*
- Button: **Check Stock** (enabled when input has text)
- Empty state message: *No Product Selected – Search for a product above to view its stock availability and details.*

**Screenshot:**  <img src="../../public/Evidence/stock availability.png" width="1227" height="677">

---

### 2.2 Loading State

**Description:** Search in progress.

**Visual:**
- Input field is disabled.
- Button shows spinner and label: **Searching…**
- Message: *Checking stock levels…*



---

### 2.3 Successful Stock Lookup (In Stock)

**Description:** Product found and available.

**Visual:**
- Product image (80×80px, rounded)
- Product name (bold)
- Product ID (e.g., `#P001`)
- Category
- Stock badge (color‑coded):
  - **5+ units:** Green – *X in stock*
  - **1‑4 units:** Orange – *X in stock (low stock)*
  - **0 units:** Red – *Out of Stock*
- Price (formatted, e.g., *K1,800*)
- Available sizes (comma‑separated or *None available*)
- Description (small, italic/grey)

**Screenshot:** <img src="../../public/Evidence/succesful stock lookup.png" width="1290" height="642">

---

### 2.4 Product Not Found

**Description:** Valid input but no matching product.

**Visual:**
- ErrorState: **Product Not Found** – *We couldn't find a matching product. Please check your search details and try again.*
- SupportMessage: *Still need help? Contact our support team at support@northstar.com or call +254 700 123 456.*

**Screenshot:** <img src="../../public/Evidence/Stock not found.png" width="1237" height="600">

---## 3. Summary Table of All States

| Feature | State | Visual Indicator | Action Required |
|---------|-------|------------------|------------------|
| Order Status | Idle | EmptyState | User enters order ID |
| Order Status | Loading | Spinner + "Searching…" | Wait |
| Order Status | Success | Order card with details | Read / take action |
| Order Status | Empty input | Red error text | User enters order ID |
| Order Status | Not Found | ErrorState + SupportMessage | Contact support |
| Stock Availability | Idle | EmptyState | User enters product name/SKU |
| Stock Availability | Loading | Spinner + "Searching…" | Wait |
| Stock Availability | Success | Stock card with details | Read / take action |
| Stock Availability | Empty input | Red error text | User enters product name/SKU |
| Stock Availability | Not Found | ErrorState + SupportMessage | Contact support |

---

## 4. Design Deliverables

| Deliverable | Status |
|-------------|--------|
| All major result states are designed | ✅ Completed |
| Error states are designed | ✅ Completed |
| Escalation state is designed | ✅ Completed |
| Designs are shared with frontend and testing members |✅ Completed   |
| Designs are saved in Google Drive | ✅ Completed  |

---

## Status
Ready for review and handoff to frontend and testing teams.

