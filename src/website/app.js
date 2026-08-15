/**
 * NorthShoes — Main Frontend JavaScript
 * ======================================
 * Handles: product loading, filtering, order form, stock display,
 * order history, navigation, and all DOM interactions.
 *
 * Architecture: vanilla JS, async/await, fetch() API.
 */

"use strict";

/* ─────────────────────────────────────────────────────────
   STATE — app-level data store
───────────────────────────────────────────────────────── */
const State = {
  products:        [],     // All products from API
  filteredProducts: [],    // After category filter
  selectedProduct:  null,  // Currently selected product object
  selectedSize:     null,  // Currently selected size string
  orderCount:       0,     // Total orders placed this session
};


/* ─────────────────────────────────────────────────────────
   DOM HELPERS
───────────────────────────────────────────────────────── */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

function show(el) { if (el) el.classList.remove("hidden"); }
function hide(el) { if (el) el.classList.add("hidden"); }
function toggle(el, condition) { condition ? show(el) : hide(el); }

/** Format a number as KES currency */
function formatKES(amount) {
  return `KES ${Number(amount).toLocaleString("en-KE")}`;
}

/** Format ISO date string to readable date */
function formatDate(isoStr) {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });
}


/* ─────────────────────────────────────────────────────────
   STOCK HELPERS — compute level/class from stock values
───────────────────────────────────────────────────────── */
function getStockLevel(stock, maxStock) {
  if (stock === 0)              return "empty";
  const ratio = stock / maxStock;
  if (ratio > 0.5)              return "high";
  if (ratio > 0.2)              return "medium";
  return "low";
}

function getStockPercent(stock, maxStock) {
  if (!maxStock) return 0;
  return Math.min(100, Math.round((stock / maxStock) * 100));
}

function getStockText(stock) {
  if (stock === 0)    return "Sold Out";
  if (stock <= 3)     return `Only ${stock} left!`;
  if (stock <= 8)     return `${stock} pairs remaining`;
  return `${stock} pairs available`;
}


/* ─────────────────────────────────────────────────────────
   HEADER — scroll, nav highlighting, hamburger
───────────────────────────────────────────────────────── */
function initHeader() {
  const header    = $("#header");
  const hamburger = $("#hamburger");
  const mobileMenu= $("#mobile-menu");
  const navLinks  = $$(".nav-link, .mobile-nav-link");

  // Scroll → add .scrolled class
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    toggle($("#back-to-top"), window.scrollY > 400);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("open", isOpen);
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });

  // Close mobile menu on any link click
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });

  // Active nav link on scroll (IntersectionObserver)
  const sections = $$("section[id], div[id]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        $$(".nav-link").forEach(a => {
          a.classList.toggle("active", a.dataset.section === id);
        });
      }
    });
  }, { rootMargin: "-50% 0px -50% 0px" });

  sections.forEach(s => observer.observe(s));

  // Back to top
  $("#back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Cart button → scroll to order form
  $("#cart-btn").addEventListener("click", () => {
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  });
}


/* ─────────────────────────────────────────────────────────
   API — fetch wrapper with error handling
───────────────────────────────────────────────────────── */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}


/* ─────────────────────────────────────────────────────────
   PRODUCTS — load, render, filter
───────────────────────────────────────────────────────── */
async function loadProducts() {
  const grid    = $("#product-grid");
  const loader  = $("#shop-loader");
  const errEl   = $("#shop-error");
  const emptyEl = $("#shop-empty");

  show(loader);
  hide(errEl);
  hide(emptyEl);

  try {
    const { ok, data } = await apiFetch("/api/products");

    if (!ok || !data.success) throw new Error(data.message || "Failed to load products");

    State.products         = data.products;
    State.filteredProducts = [...State.products];

    // Update stat counter in hero
    const statEl = $("#stat-products");
    if (statEl) statEl.textContent = State.products.length;

    populateProductDropdown(State.products);
    renderProducts(State.products);
    renderStockDashboard(State.products);

  } catch (err) {
    console.error("Product load error:", err);
    hide(loader);
    show(errEl);
  }
}

/** Build product cards and inject into grid */
function renderProducts(products) {
  const grid   = $("#product-grid");
  const loader = $("#shop-loader");
  const empty  = $("#shop-empty");

  // Remove existing cards (keep loader/states)
  $$(".product-card", grid).forEach(c => c.remove());

  hide(loader);

  if (!products || products.length === 0) {
    show(empty);
    return;
  }

  hide(empty);

  products.forEach(product => {
    const card = buildProductCard(product);
    grid.appendChild(card);
  });
}

/** Create a single product card DOM element */
function buildProductCard(p) {
  const level   = getStockLevel(p.stock, p.max_stock);
  const pct     = getStockPercent(p.stock, p.max_stock);
  const text    = getStockText(p.stock);
  const outOfStock = p.stock === 0;

  // Badge colour mapping
  const badgeClass = {
    "New":      "badge--new",
    "Trending": "badge--trending",
    "Hot":      "badge--hot",
    "Limited":  "badge--limited",
  }[p.badge] || "badge--trending";

  // Sizes display (show up to 6)
  const sizesHTML = p.sizes.slice(0, 6).map(s =>
    `<span class="size-tag">${s}</span>`
  ).join("") + (p.sizes.length > 6 ? `<span class="size-tag">+${p.sizes.length - 6}</span>` : "");

  const card = document.createElement("article");
  card.className = `product-card${outOfStock ? " product-card--out-of-stock" : ""}`;
  card.setAttribute("role", "listitem");
  card.setAttribute("data-id", p.id);
  card.innerHTML = `
    <div class="card-badge">
      <span class="badge ${outOfStock ? "badge--sold" : badgeClass}">
        ${outOfStock ? "Sold Out" : p.badge}
      </span>
    </div>

    <div class="card-img-wrap">
      <img
        src="${p.image}"
        alt="${p.name} — ${p.category}"
        class="card-img"
        loading="lazy"
        onerror="this.src='/static/images/northshoes-logo.png'; this.style.objectFit='contain'; this.style.padding='20px';"
      />
    </div>

    <div class="card-body">
      <span class="card-category">${p.category}</span>
      <h3 class="card-name">${p.name}</h3>
      <p class="card-price">${formatKES(p.price)}</p>
      <p class="card-desc">${p.description}</p>

      <div class="card-sizes" aria-label="Available sizes">
        ${sizesHTML}
      </div>

      <div class="card-stock" aria-label="Stock availability">
        <div class="stock-bar-wrap">
          <div class="stock-bar stock-bar--${level}"
               style="width: ${pct}%;"
               role="progressbar"
               aria-valuenow="${p.stock}"
               aria-valuemax="${p.max_stock}"
               aria-label="Stock level"></div>
        </div>
        <span class="stock-text stock-text--${level}">${text}</span>
      </div>
    </div>

    <div class="card-footer">
      <button
        class="card-order-btn"
        data-id="${p.id}"
        ${outOfStock ? "disabled aria-disabled='true'" : ""}
        aria-label="Order ${p.name}">
        ${outOfStock ? "Out of Stock" : "Order Now →"}
      </button>
    </div>
  `;

  // "Order Now" click → scroll to form and pre-select product
  if (!outOfStock) {
    card.querySelector(".card-order-btn").addEventListener("click", () => {
      selectProductInForm(p.id);
      document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
    });
  }

  return card;
}

/** Fill the product <select> dropdown in the order form */
function populateProductDropdown(products) {
  const select = $("#product-select");
  select.innerHTML = '<option value="">— Select a shoe —</option>';

  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.disabled = p.stock === 0;
    opt.textContent = `${p.name} (${formatKES(p.price)})${p.stock === 0 ? " — Sold Out" : ""}`;
    select.appendChild(opt);
  });
}

/** Pre-select a product in the order form by ID */
function selectProductInForm(productId) {
  const select = $("#product-select");
  select.value = productId;
  select.dispatchEvent(new Event("change"));
}


/* ─────────────────────────────────────────────────────────
   CATEGORY FILTER
───────────────────────────────────────────────────────── */
function initFilters() {
  const filterBtns = $$(".filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Toggle active
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.dataset.cat;

      if (cat === "all") {
        State.filteredProducts = [...State.products];
      } else {
        State.filteredProducts = State.products.filter(
          p => p.category.toLowerCase() === cat.toLowerCase()
        );
      }

      renderProducts(State.filteredProducts);
    });
  });
}


/* ─────────────────────────────────────────────────────────
   ORDER FORM — product selection, sizes, preview, validation
───────────────────────────────────────────────────────── */
function initOrderForm() {
  const productSelect = $("#product-select");
  const sizeGrid      = $("#size-grid");
  const sizeHidden    = $("#selected-size");
  const qtyInput      = $("#quantity");
  const qtyMinus      = $("#qty-minus");
  const qtyPlus       = $("#qty-plus");
  const form          = $("#order-form");

  // Product selection → update sizes and preview
  productSelect.addEventListener("change", () => {
    const id = parseInt(productSelect.value);
    State.selectedProduct = State.products.find(p => p.id === id) || null;
    State.selectedSize    = null;
    sizeHidden.value      = "";

    clearError("product");

    if (State.selectedProduct) {
      renderSizeButtons(State.selectedProduct.sizes);
      updatePreview();
    } else {
      sizeGrid.innerHTML = '<p class="size-placeholder">Select a shoe to see available sizes</p>';
      resetPreview();
    }
  });

  /** Build size selector buttons */
  function renderSizeButtons(sizes) {
    sizeGrid.innerHTML = "";
    sizes.forEach(size => {
      const btn = document.createElement("button");
      btn.type      = "button";
      btn.className = "size-btn";
      btn.textContent = size;
      btn.setAttribute("aria-label", `Size ${size}`);
      btn.addEventListener("click", () => {
        $$(".size-btn", sizeGrid).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        State.selectedSize = size;
        sizeHidden.value   = size;
        clearError("size");
        updatePreview();
      });
      sizeGrid.appendChild(btn);
    });
  }

  // Quantity buttons
  qtyMinus.addEventListener("click", () => {
    const v = parseInt(qtyInput.value) || 1;
    if (v > 1) {
      qtyInput.value = v - 1;
      updatePreview();
    }
  });

  qtyPlus.addEventListener("click", () => {
    const v = parseInt(qtyInput.value) || 1;
    const max = State.selectedProduct ? State.selectedProduct.stock : 99;
    if (v < max) {
      qtyInput.value = v + 1;
      updatePreview();
    }
  });

  qtyInput.addEventListener("input", () => {
    clearError("qty");
    updatePreview();
  });

  // Form submit
  form.addEventListener("submit", handleOrderSubmit);
}


/* ─────────────────────────────────────────────────────────
   ORDER PREVIEW PANEL
───────────────────────────────────────────────────────── */
function updatePreview() {
  const p    = State.selectedProduct;
  const qty  = parseInt($("#quantity").value) || 1;

  const previewEmpty   = $("#preview-empty");
  const previewContent = $("#preview-content");

  if (!p) {
    resetPreview();
    return;
  }

  hide(previewEmpty);
  show(previewContent);

  $("#preview-img").src       = p.image;
  $("#preview-img").alt       = p.name;
  $("#preview-name").textContent  = p.name;
  $("#preview-cat").textContent   = p.category;
  $("#preview-price").textContent = formatKES(p.price) + " / pair";

  // Stock bar in preview
  const level   = getStockLevel(p.stock, p.max_stock);
  const pct     = getStockPercent(p.stock, p.max_stock);
  const stockBar = $("#stock-bar");
  stockBar.className = `stock-bar stock-bar--${level}`;
  stockBar.style.width = `${pct}%`;
  $("#stock-label-text").textContent = getStockText(p.stock);

  // Running total
  const total = p.price * qty;
  $("#preview-total").textContent = `Total: ${formatKES(total)}`;
}

function resetPreview() {
  const previewEmpty   = $("#preview-empty");
  const previewContent = $("#preview-content");
  show(previewEmpty);
  hide(previewContent);
}


/* ─────────────────────────────────────────────────────────
   FORM VALIDATION HELPERS
───────────────────────────────────────────────────────── */
function showError(field, msg) {
  const el = $(`#err-${field}`);
  if (el) { el.textContent = msg; }
  const input = $(`#${field === "name" ? "customer-name" : field === "qty" ? "quantity" : field === "product" ? "product-select" : field}`);
  if (input) input.classList.add("error");
}

function clearError(field) {
  const el = $(`#err-${field}`);
  if (el) { el.textContent = ""; }
}

function clearAllErrors() {
  ["name", "phone", "product", "size", "qty"].forEach(f => clearError(f));
  $$(".form-input, .form-select").forEach(el => el.classList.remove("error"));
  const global = $("#form-global-error");
  hide(global);
  global.textContent = "";
}

function validateForm() {
  let valid = true;
  clearAllErrors();

  const name  = $("#customer-name").value.trim();
  const phone = $("#phone").value.trim();
  const qty   = parseInt($("#quantity").value);

  if (!name || name.length < 2) {
    showError("name", "Please enter your full name.");
    valid = false;
  }

  const phoneClean = phone.replace(/[\s\-()]/g, "");
  if (!phoneClean) {
    showError("phone", "Phone number is required.");
    valid = false;
  } else if (!/^\+?\d{9,15}$/.test(phoneClean)) {
    showError("phone", "Enter a valid phone number (e.g. 0712345678).");
    valid = false;
  }

  if (!State.selectedProduct) {
    showError("product", "Please select a shoe.");
    valid = false;
  }

  if (!State.selectedSize) {
    showError("size", "Please select a size.");
    valid = false;
  }

  if (!qty || qty < 1) {
    showError("qty", "Quantity must be at least 1.");
    valid = false;
  } else if (State.selectedProduct && qty > State.selectedProduct.stock) {
    showError("qty", `Only ${State.selectedProduct.stock} pair(s) available.`);
    valid = false;
  }

  return valid;
}


/* ─────────────────────────────────────────────────────────
   ORDER SUBMISSION
───────────────────────────────────────────────────────── */
async function handleOrderSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const submitBtn  = $("#submit-order-btn");
  const btnText    = submitBtn.querySelector(".btn-text");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");

  // Show loading state
  submitBtn.disabled = true;
  hide(btnText);
  show(btnSpinner);

  const orderPayload = {
    customer_name: $("#customer-name").value.trim(),
    phone:         $("#phone").value.trim(),
    email:         $("#email").value.trim(),
    location:      $("#location").value.trim(),
    notes:         $("#notes").value.trim(),
    product_id:    State.selectedProduct.id,
    size:          State.selectedSize,
    quantity:      parseInt($("#quantity").value),
  };

  try {
    const { ok, data } = await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });

    if (!ok || !data.success) {
      // Show backend error message
      const globalErr = $("#form-global-error");
      globalErr.textContent = data.message || "Something went wrong. Please try again.";
      show(globalErr);
      return;
    }

    // ✅ Order placed successfully
    handleOrderSuccess(data);

  } catch (err) {
    console.error("Order submission error:", err);
    const globalErr = $("#form-global-error");
    globalErr.textContent = "Network error. Please check your connection and try again.";
    show(globalErr);

  } finally {
    // Restore button
    submitBtn.disabled = false;
    show(btnText);
    hide(btnSpinner);
  }
}

function handleOrderSuccess(data) {
  const order = data.order;

  // 1. Update order counter
  State.orderCount++;
  $("#cart-count").textContent = State.orderCount;

  // 2. Refresh product stock in local state
  const product = State.products.find(p => p.id === order.product_id);
  if (product) {
    product.stock = data.stock_remaining;
    // Re-render to reflect stock change
    renderProducts(State.filteredProducts.length > 0 ? State.filteredProducts : State.products);
    renderStockDashboard(State.products);
    populateProductDropdown(State.products);
  }

  // 3. Update status panel
  updateStatusPanel(order);

  // 4. Show order result overlay/modal
  showOrderResult(order);

  // 5. Reset form
  resetOrderForm();

  // 6. Refresh orders table
  loadOrders();
}

/** Reset the order form to initial state */
function resetOrderForm() {
  $("#order-form").reset();
  State.selectedProduct = null;
  State.selectedSize    = null;
  $("#selected-size").value = "";
  $("#size-grid").innerHTML = '<p class="size-placeholder">Select a shoe to see available sizes</p>';
  resetPreview();
  clearAllErrors();
}


/* ─────────────────────────────────────────────────────────
   STATUS PANEL — live order status tracker
───────────────────────────────────────────────────────── */
function updateStatusPanel(order) {
  const statusEmpty   = $("#status-empty");
  const statusContent = $("#status-content");

  hide(statusEmpty);
  show(statusContent);

  $("#status-badge").textContent   = order.status;
  $("#status-order-id").textContent = `Order ID: ${order.order_id}`;

  // Highlight first step as active (mock — "Order Received")
  $$(".step").forEach((step, i) => {
    step.classList.remove("active", "completed");
    if (i === 0) step.classList.add("active");
  });
}


/* ─────────────────────────────────────────────────────────
   ORDER RESULT MODAL — shown after successful order
───────────────────────────────────────────────────────── */
function showOrderResult(order) {
  const overlay = $("#order-result-overlay");

  // Populate modal fields
  $("#result-order-id").textContent = order.order_id;
  $("#result-shoe").textContent     = order.product_name;
  $("#result-size").textContent     = `Size ${order.size}`;
  $("#result-qty").textContent      = `${order.quantity} pair${order.quantity > 1 ? "s" : ""}`;
  $("#result-total").textContent    = formatKES(order.total_price);
  $("#result-customer").textContent = order.customer_name;
  $("#result-status").textContent   = order.status;
  $("#result-sub").textContent      = `Confirmation for ${order.customer_name}`;

  show(overlay);

  // Close on button click
  $("#result-close-btn").onclick = () => {
    hide(overlay);
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  };

  // Close on overlay backdrop click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hide(overlay);
  });

  // Close on ESC key
  document.addEventListener("keydown", function onEsc(e) {
    if (e.key === "Escape") {
      hide(overlay);
      document.removeEventListener("keydown", onEsc);
    }
  });
}


/* ─────────────────────────────────────────────────────────
   STOCK DASHBOARD — stock panel section
───────────────────────────────────────────────────────── */
function renderStockDashboard(products) {
  const grid   = $("#stock-grid");
  const loader = $("#stock-loader");

  // Remove existing items
  $$(".stock-item", grid).forEach(el => el.remove());
  hide(loader);

  products.forEach(p => {
    const level = getStockLevel(p.stock, p.max_stock);
    const pct   = getStockPercent(p.stock, p.max_stock);
    const text  = getStockText(p.stock);

    const item = document.createElement("div");
    item.className = "stock-item";
    item.innerHTML = `
      <div class="stock-item__header">
        <p class="stock-item__name">${p.name}</p>
        <span class="stock-item__qty">${p.stock}</span>
      </div>
      <p class="stock-item__cat">${p.category}</p>
      <div class="stock-item__bar-wrap">
        <div class="stock-item__bar stock-bar--${level}"
             style="width: ${pct}%"
             role="progressbar"
             aria-valuenow="${p.stock}"
             aria-valuemax="${p.max_stock}"
             aria-label="${p.name} stock level"></div>
      </div>
      <span class="stock-item__label stock-text--${level}">${text}</span>
    `;
    grid.appendChild(item);
  });
}


/* ─────────────────────────────────────────────────────────
   MY ORDERS — load and display order history
───────────────────────────────────────────────────────── */
async function loadOrders() {
  const loader  = $("#orders-loader");
  const empty   = $("#orders-empty");
  const table   = $("#orders-table");
  const tbody   = $("#orders-table-body");

  show(loader);
  hide(table);
  hide(empty);

  try {
    const { ok, data } = await apiFetch("/api/orders");

    hide(loader);

    if (!ok || !data.success) throw new Error(data.message);

    const orders = data.orders || [];

    if (orders.length === 0) {
      show(empty);
      return;
    }

    // Build table rows
    tbody.innerHTML = "";
    orders.forEach(o => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="order-id-cell">${o.order_id}</td>
        <td class="order-shoe-cell">${o.product_name}</td>
        <td>${o.size}</td>
        <td>${o.quantity}</td>
        <td>${Number(o.total_price).toLocaleString("en-KE")}</td>
        <td><span class="status-badge">${o.status}</span></td>
        <td>${formatDate(o.created_at)}</td>
      `;
      tbody.appendChild(tr);
    });

    show(table);

  } catch (err) {
    console.error("Orders load error:", err);
    hide(loader);
    show(empty);
  }
}


/* ─────────────────────────────────────────────────────────
   SMOOTH SCROLLING — for CTA anchor links
───────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 80; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
}


/* ─────────────────────────────────────────────────────────
   ENTRY POINT — init everything on DOM ready
───────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🔴 NorthShoes — initialising...");

  initHeader();
  initSmoothScroll();
  initFilters();
  initOrderForm();

  // Load data from API
  await loadProducts();
  await loadOrders();

  console.log("✅ NorthShoes — ready.");
});
