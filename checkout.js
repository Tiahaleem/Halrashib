const WHATSAPP_NUMBER = "2348136828054"; // no +

// helpers
function money(n){ return "₦" + Number(n || 0).toLocaleString(); }
function getCart(){ return JSON.parse(localStorage.getItem("cart")) || []; }

function renderSummary(){
  const cart = getCart();
  const summaryWrap = document.getElementById("summaryItems");
  const subtotalEl = document.getElementById("summarySubtotal");

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (summaryWrap){
    if (cart.length === 0){
      summaryWrap.innerHTML = `<p style="color:rgba(0,0,0,0.6);font-size:12px;">Your cart is empty.</p>`;
    } else {
      summaryWrap.innerHTML = cart.map(item => `
        <div class="summary_item">
          <span>${item.name} x${item.qty}</span>
          <strong>${money(item.price * item.qty)}</strong>
        </div>
      `).join("");
    }
  }

  if (subtotalEl) subtotalEl.textContent = money(subtotal);
}

function buildMessage({name, phone, address, state, note}){
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const lines = [];
  lines.push("Hello Halrashib,");
  lines.push("");
  lines.push("I would like to order:");
  lines.push("");

  cart.forEach((item, idx) => {
    lines.push(`${idx+1}. ${item.name} x${item.qty} — ${money(item.price * item.qty)}`);
  });

  lines.push("");
  lines.push(`Subtotal: ${money(subtotal)}`);
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

document.getElementById("placeOrderBtn").addEventListener("click", () => {
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const state = document.getElementById("state").value.trim();
  const note = document.getElementById("note").value.trim();

  const cart = getCart();
  if (cart.length === 0){
    alert("Your cart is empty.");
    return;
  }

  if (!name || !phone || !address || !state){
    alert("Please fill: Full Name, Phone, Address, and State.");
    return;
  }

  const msg = buildMessage({name, phone, address, state, note});
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");
});

renderSummary();