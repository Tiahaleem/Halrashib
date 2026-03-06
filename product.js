// js/product.js
function money(n){ return "₦" + Number(n || 0).toLocaleString(); }

function getCart(){ return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(cart){ localStorage.setItem("cart", JSON.stringify(cart)); }

function updateCartCountSafe(){
  // your app.js already has updateCartCount(), but this makes product page safe even if not
  if (typeof updateCartCount === "function") updateCartCount();
}

const params = new URLSearchParams(location.search);
const productId = params.get("id");

const product = (window.PRODUCTS || []).find(p => p.id === productId);

if (!product) {
  alert("Product not found. Go back to shop.");
} else {
  // render basic info
  document.getElementById("pName").textContent = product.name;
  document.getElementById("pImage").src = product.image;
  document.getElementById("pDesc").textContent = product.desc || "";

  const priceEl = document.getElementById("pPrice");
  const sizeRow = document.getElementById("sizeRow");
  const sizeHint = document.getElementById("sizeHint");

  let selectedSize = "";
  let selectedPrice = 0;

  // create size buttons
  sizeRow.innerHTML = product.sizes.map(s =>
    `<button type="button" class="p_size_btn" data-size="${s.label}" data-price="${s.price}">${s.label}</button>`
  ).join("");

  // default display price = first size price (but still require selection)
  priceEl.textContent = money(product.sizes[0]?.price || 0);

  // size click
  sizeRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".p_size_btn");
    if (!btn) return;

    sizeRow.querySelectorAll(".p_size_btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    selectedSize = btn.dataset.size;
    selectedPrice = Number(btn.dataset.price);

    priceEl.textContent = money(selectedPrice);
    sizeHint.textContent = `Selected: ${selectedSize} (${money(selectedPrice)})`;
  });

  // qty
  let qty = 1;
  const qtyNum = document.getElementById("qtyNum");

  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyNum.textContent = qty;
  });

  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty += 1;
    qtyNum.textContent = qty;
  });

  // add to cart
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    if (!selectedSize) {
      sizeHint.textContent = "Please select a size to continue.";
      return;
    }

    const cart = getCart();

    // key makes same product different by size
    const key = `${product.id}-${selectedSize}`;

    const existing = cart.find(i => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key,
        id: product.id,
        name: product.name,
        image: product.image,
        size: selectedSize,
        price: selectedPrice,
        qty
      });
    }

    saveCart(cart);
    updateCartCountSafe();
  });

  updateCartCountSafe();
}