# Group 31 Project

## Project Overview

Northstar Retail Co., a mid-size e-commerce company, was experiencing high volumes of repetitive support tickets related to order status inquiries and stock availability questions. Their support team was spending excessive time manually responding to these common queries, reducing their capacity to handle more complex customer issues.

This project delivers a **self-service support dashboard MVP** that empowers customers to independently check their order status and product availability, significantly reducing the manual ticket handling burden on Northstar's support team.

The prototype serves as a proof of concept, demonstrating that a simple, well-designed self-service tool can deflect a meaningful portion of support tickets while improving customer experience through instant access to information.

---

## Project Goal

To build a working MVP that reduces manual ticket handling for at least two of the three identified support categories by providing customers with a self-service dashboard to independently resolve their queries.

**Success Criteria:**
- Customers can check order status without contacting support
- Customers can verify product availability without contacting support
- The prototype is demoable end-to-end from the browser
- The codebase is well-documented and ready for handover to Northstar's team

---

## MVP

The Minimum Viable Product focuses on two core customer support functions:

1. **Order Status Lookup**
2. **Stock Availability Lookup**

The prototype allows users to check order information using an order ID and search product availability using relevant product information. Both features are accessible via a simple tab navigation interface on the `/dashboard` route.

A brand-aligned home page has also been implemented to showcase Northstar's product catalogue, stock levels, and contact information.

---

## Core Features

### Order Status Lookup

Users will be able to:

- Enter an order ID (`NS1001`–`NS1020`).
- Retrieve the current order status with a colour‑coded badge (Processing, Confirmed, Shipped, Out for Delivery, Delivered, Cancelled).
- View relevant delivery information including order date and expected delivery date.
- View product name, image, and customer name associated with the order.
- Receive an appropriate response when an order cannot be found.
- Receive escalation instructions with support contact details where required.

### Stock Availability Lookup

Users will be able to:

- Search for a product by name or SKU (e.g., "Nike" or "P001").
- Check product availability across the full inventory of 20 products.
- Check relevant size information (all available sizes displayed).
- View stock status with colour‑coded indicators (Green = in stock, Orange = low stock, Red = out of stock).
- View product price, category, description, and image.
- Receive appropriate responses for unavailable products.
- Receive escalation instructions with support contact details where required.

---

## Technology Stack

The project uses the following technologies:

- **Frontend**: Next.js 16 (App Router) with React and TypeScript
- **Styling**: Tailwind CSS v4 (dark theme with red accent colour scheme)
- **Icons**: Lucide React and React Icons
- **Data**: Static mock data (JSON arrays in `src/data/`)
- **Development tools**: Turbopack for fast development builds
- **Version control**: Git with GitHub
- **Project management**: GitHub Projects (Kanban board)
- **Deployment**: Netlify

---

## Project Structure

```text
group31/
├── .next/                          # Next.js build output
├── backend/                        # Backend files (if applicable)
├── docs/                           # Project documentation
│   ├── design/                     # Design assets and mockups
│   ├── Evidence/                   # Screenshots and evidence
│   ├── readinessNote/              # Go-live readiness documentation
│   ├── Team Charter/               # Team charter documents
│   └── testing/                    # Testing documentation
├── node_modules/                   # Dependencies
├── public/                         # Static assets
│   ├── Evidence/                   # Screenshots for documentation
│   │   ├── Contribution Graph.png
│   │   ├── Order not found.png
│   │   ├── Order status lookup - successful order lookup.png
│   │   ├── Order status lookup.png
│   │   ├── stock availability.png
│   │   ├── Stock not found.png
│   │   └── successful stock lookup.png
│   ├── shoes/                      # Product images
│   │   ├── Adidas-Samba-OG.jpg
│   │   ├── adidas-ultraboost-light.jpg
│   │   ├── adidas-yeezy-boost-350-v2.jpg
│   │   ├── air-jordan-1-retro-high-og.jpg
│   │   ├── air-jordan-4-retro-bred.jpg
│   │   ├── Alexander-McQueen-Oversized-Sneaker.jpg
│   │   ├── balenciaga-triple-s.jpg
│   │   ├── birkensstock-arizona-sandals.jpg
│   │   ├── christian-louboutin-so-kate-pumps.jpg
│   │   ├── clarks-desert-boots.jpg
│   │   ├── converse-chuck-taylor-all-star.jpg
│   │   ├── crocs-classic-clog.jpg
│   │   ├── new-balance-550.jpg
│   │   ├── Nike-Air-Force-1.jpg
│   │   ├── nike-air-max-270.jpg
│   │   ├── Puma-Suede-Classic.jpg
│   │   ├── puma-velocity-nitro-2.jpg
│   │   ├── vans-old-skool.jpg
│   │   └── zara-mule-heels.jpg
│   └── northstar-logo.png          # Brand logo
├── src/                            # Source code
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # API routes
│   │   ├── dashboard/              # Dashboard page
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css             # Global styles (Tailwind v4)
│   │   ├── layout.tsx              # Root layout with navigation
│   │   └── page.tsx                # Home page
│   ├── components/                 # React components
│   │   ├── home/                   # Home page sections
│   │   │   ├── ContactSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ShopSection.tsx
│   │   │   └── StockDashboard.tsx
│   │   ├── shared/                 # Reusable components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   └── StockBar.tsx
│   │   ├── EmptyState.tsx          # Empty state component
│   │   ├── ErrorState.tsx          # Error state component
│   │   ├── LoadingState.tsx        # Loading state component
│   │   ├── NavigationBar.tsx       # Main navigation
│   │   ├── OrderLookup.tsx         # Order status lookup
│   │   ├── OrderResult.tsx         # Order result display
│   │   ├── StockLookup.tsx         # Stock availability lookup
│   │   ├── StockResult.tsx         # Stock result display
│   │   └── SupportMessage.tsx      # Support escalation message
│   ├── data/                       # Mock data
│   │   ├── inventory.ts            # Product inventory data
│   │   └── orders.ts               # Order data
│   ├── features/                   # Feature-specific code
│   ├── lib/                        # Utility functions
│   └── types/                      # TypeScript type definitions
│       ├── inventory.ts            # Inventory type definitions
│       └── order.ts                # Order type definitions
├── package.json                    # Project dependencies
├── package-lock.json               # Locked dependencies
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation