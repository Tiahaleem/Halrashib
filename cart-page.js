function money(n) {
  return "₦" + Number(n || 0).toLocaleString();
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateSubtotal(cart) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const el = document.getElementById("cartSubtotal");
  if (el) el.textContent = money(subtotal);
}

function renderCart() {
  const cart = getCart();
  const wrap = document.getElementById("cartItems");

  if (!wrap) return;

  if (cart.length === 0) {
    wrap.innerHTML = `<p style="color:rgba(0,0,0,0.6)">Your cart is empty.</p>`;
    updateSubtotal(cart);
    return;
  }

  wrap.innerHTML = cart.map((item) => `
    <div class="cart_item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <div class="cart_item_name">
          ${item.name}
          ${item.size ? `<span style="opacity:.6;">(${item.size})</span>` : ""}
        </div>
        <div class="cart_item_price">${money(item.price)}</div>
      </div>

      <div style="display:flex; align-items:center;">
        <div class="cart_qty">
          <button type="button" class="qty_minus" data-key="${item.key || item.id}">−</button>
          <span>${item.qty}</span>
          <button type="button" class="qty_plus" data-key="${item.key || item.id}">+</button>
        </div>
        <button type="button" class="remove_btn" data-key="${item.key || item.id}">Remove</button>
      </div>
    </div>
  `).join("");

  updateSubtotal(cart);
}

document.addEventListener("click", (e) => {
  const cart = getCart();

  const plus = e.target.closest(".qty_plus");
  if (plus) {
    const key = plus.dataset.key;
    const item = cart.find((i) => (i.key || i.id) === key);
    if (item) item.qty += 1;
    saveCart(cart);
    renderCart();
    if (typeof updateCartCount === "function") updateCartCount();
    return;
  }

  const minus = e.target.closest(".qty_minus");
  if (minus) {
    const key = minus.dataset.key;
    const item = cart.find((i) => (i.key || i.id) === key);
    if (item) item.qty = Math.max(1, item.qty - 1);
    saveCart(cart);
    renderCart();
    if (typeof updateCartCount === "function") updateCartCount();
    return;
  }

  const remove = e.target.closest(".remove_btn");
  if (remove) {
    const key = remove.dataset.key;
    const filtered = cart.filter((i) => (i.key || i.id) !== key);
    saveCart(filtered);
    renderCart();
    if (typeof updateCartCount === "function") updateCartCount();
    return;
  }
});

renderCart();