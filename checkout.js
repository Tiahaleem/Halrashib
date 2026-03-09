const WHATSAPP_NUMBER = "2348136828054";

const ORDER_API =
  "https://script.google.com/macros/s/AKfycbw4NDaDYHeYMvHj861OyrOEJxeZ9Z3kDDVqBeEqdOFNYZF2MPndsAaW0_obB6gAW8g/exec";

function money(n) {
  return "₦" + Number(n || 0).toLocaleString();
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function clearCart() {
  localStorage.removeItem("cart");
  if (typeof updateCartCount === "function") updateCartCount();
}

function generateOrderId() {
  return "HR-" + Date.now();
}

function renderSummary() {
  const cart = getCart();
  const summaryWrap = document.getElementById("summaryItems");
  const subtotalEl = document.getElementById("summarySubtotal");

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (summaryWrap) {
    if (cart.length === 0) {
      summaryWrap.innerHTML = `<p style="color:rgba(0,0,0,0.6);font-size:12px;">Your cart is empty.</p>`;
    } else {
      summaryWrap.innerHTML = cart.map(item => `
        <div class="summary_item">
          <span>
            ${item.name}${item.size ? ` (${item.size})` : ""} x${item.qty}
          </span>
          <strong>${money(item.price * item.qty)}</strong>
        </div>
      `).join("");
    }
  }

  if (subtotalEl) subtotalEl.textContent = money(subtotal);
}

function buildMessage({ orderId, name, phone, address, state, note, cart, total }) {
  const lines = [];

  lines.push(`Order ID: ${orderId}`);
  lines.push("");
  lines.push("Hello Halrashib,");
  lines.push("");
  lines.push("I would like to order:");
  lines.push("");

  cart.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. ${item.name}${item.size ? ` (Size ${item.size})` : ""} x${item.qty} — ${money(item.price * item.qty)}`
    );
  });

  lines.push("");
  lines.push(`Subtotal: ${money(total)}`);
  lines.push("");
  lines.push(`Name: ${name}`);
  lines.push(`Phone: ${phone}`);
  lines.push(`Address: ${address}`);
  lines.push(`State: ${state}`);
  if (note) lines.push(`Note: ${note}`);
  lines.push("");
  lines.push("Thank you.");

  return lines.join("\n");
}

async function saveOrder(order) {
  try {
    const res = await fetch(ORDER_API, {
      method: "POST",
      body: JSON.stringify({
        orderId: order.orderId,
        name: order.name,
        phone: order.phone,
        address: order.address,
        state: order.state,
        items: order.itemsText,
        total: order.total,
        note: order.note
      })
    });

    return await res.json();
  } catch (err) {
    console.error("Order save failed:", err);
    return null;
  }
}

document.getElementById("placeOrderBtn").addEventListener("click", async () => {
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const state = document.getElementById("state").value.trim();
  const note = document.getElementById("note").value.trim();

  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  if (!name || !phone || !address || !state) {
    alert("Please fill: Full Name, Phone, Address, and State.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const itemsText = cart.map(item =>
    `${item.name}${item.size ? ` (${item.size})` : ""} x${item.qty}`
  ).join(", ");

  const order = {
    orderId: generateOrderId(),
    name,
    phone,
    address,
    state,
    note,
    cart,
    total,
    itemsText
  };

  await saveOrder(order);

  const msg = buildMessage(order);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");

  clearCart();
});

renderSummary();