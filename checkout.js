const WHATSAPP_NUMBER = "2348136828054";

const ORDER_API =
"https://script.google.com/macros/s/AKfycbxI4-rYElsQmXqQcRc5NFs3T4Uj5MtQKu-zIitd9RsZg-G6yQ-ssLrvu_6Bz3sly2pv/exec";

function money(n){
  return "₦" + Number(n || 0).toLocaleString();
}

function getCart(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function clearCart(){
  localStorage.removeItem("cart");
  if (typeof updateCartCount === "function") updateCartCount();
}

function renderSummary(){
  const cart = getCart();
  const wrap = document.getElementById("summaryItems");
  const subtotalEl = document.getElementById("summarySubtotal");

  const subtotal = cart.reduce((sum,i)=> sum + (i.price * i.qty),0);

  if(wrap){
    wrap.innerHTML = cart.map(item=>`
      <div class="summary_item">
        <span>${item.name} ${item.size ? `(${item.size})` : ""} x${item.qty}</span>
        <strong>${money(item.price * item.qty)}</strong>
      </div>
    `).join("");
  }

  if(subtotalEl) subtotalEl.textContent = money(subtotal);
}

function buildMessage(order){

  const lines=[];

  lines.push("Hello Halrashib,");
  lines.push("");
  lines.push("I would like to order:");
  lines.push("");

  order.cart.forEach((item,i)=>{

    lines.push(
      `${i+1}. ${item.name} ${item.size ? `(Size ${item.size})` : ""} x${item.qty} — ${money(item.price*item.qty)}`
    );

  });

  lines.push("");
  lines.push(`Subtotal: ${money(order.total)}`);
  lines.push("");
  lines.push(`Name: ${order.name}`);
  lines.push(`Phone: ${order.phone}`);
  lines.push(`Address: ${order.address}`);
  lines.push(`State: ${order.state}`);

  if(order.note) lines.push(`Note: ${order.note}`);

  lines.push("");
  lines.push("Thank you.");

  return lines.join("\n");
}

async function saveOrder(order){

  try{

    await fetch(ORDER_API,{
      method:"POST",
      body: JSON.stringify({
        name: order.name,
        phone: order.phone,
        address: order.address,
        state: order.state,
        items: order.itemsText,
        total: order.total,
        note: order.note
      })
    });

  }catch(err){
    console.error("Order save failed",err);
  }

}

document.getElementById("placeOrderBtn").addEventListener("click", async ()=>{

  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const state = document.getElementById("state").value.trim();
  const note = document.getElementById("note").value.trim();

  const cart = getCart();

  if(cart.length===0){
    alert("Your cart is empty.");
    return;
  }

  if(!name || !phone || !address || !state){
    alert("Please fill all required fields.");
    return;
  }

  const total = cart.reduce((s,i)=>s + (i.price*i.qty),0);

  const itemsText = cart.map(i=>
    `${i.name} ${i.size ? `(Size ${i.size})` : ""} x${i.qty}`
  ).join(", ");

  const order={
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

  const message = buildMessage(order);

  const url =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url,"_blank");

  clearCart();

});

renderSummary();