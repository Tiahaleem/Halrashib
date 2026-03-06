// ===== Mobile menu toggle =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    const open = navLinks.classList.contains("show");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
}

// ===== Footer year (safe) =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Cart helpers =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}

// ===== Add to cart =====
function addToCart(product) {
  const cart = getCart();

  const productKey = product.key || product.id;
  const existing = cart.find((i) => (i.key || i.id) === productKey);

  if (existing) {
    existing.qty = (existing.qty || 0) + (product.qty || 1);
  } else {
    cart.push({ ...product, qty: product.qty || 1 });
  }

  saveCart(cart);
  updateCartCount();
}

// Click handler for all .quick_add buttons
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".quick_add");
  if (!btn) return;

  const product = {
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: Number(btn.dataset.price),
    image: btn.dataset.image,
  };

  // basic validation (helps avoid empty data)
  if (!product.id || !product.name || !product.price) return;

  addToCart(product);
});

// Update badge on load + when another tab updates storage
updateCartCount();
window.addEventListener("storage", updateCartCount);