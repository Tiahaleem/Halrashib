let activeCategory = "all";
let activePrice = "all";
let searchText = "";

function money(n) {
  return "₦" + Number(n || 0).toLocaleString();
}

function getBasePrice(product) {
  return product?.sizes?.[0]?.price || 0;
}

function priceMatch(price) {
  if (activePrice === "all") return true;
  if (activePrice === "under-20000") return price < 20000;
  if (activePrice === "20000-35000") return price >= 20000 && price <= 35000;
  if (activePrice === "35000-50000") return price > 35000 && price <= 50000;
  if (activePrice === "above-50000") return price > 50000;
  return true;
}

function render() {
  const grid = document.getElementById("shopGrid");
  const countEl = document.getElementById("productCount");
  const products = window.PRODUCTS || [];

  const filtered = products.filter((p) => {
    const basePrice = getBasePrice(p);
    const catOK = activeCategory === "all" ? true : p.category === activeCategory;
    const priceOK = priceMatch(basePrice);
    const searchOK = (p.name || "").toLowerCase().includes(searchText.toLowerCase());
    return catOK && priceOK && searchOK;
  });

  if (countEl) countEl.textContent = filtered.length;
  if (!grid) return;

  grid.innerHTML = filtered.map((p) => {
    const basePrice = getBasePrice(p);

    return `
      <article class="shop_card">
        <div class="shop_img">
          ${p.isNew ? `<span class="shop_badge">NEW</span>` : ``}
          <a href="product.html?id=${encodeURIComponent(p.id)}">
            <img src="${p.image}" alt="${p.name}">
          </a>

          <button class="quick_add"
            type="button"
            aria-label="Add to cart"
            data-id="${p.id}"
            data-name="${p.name}"
            data-price="${basePrice}"
            data-image="${p.image}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M1 2v2h2l3.6 7.59l-1.35 2.45C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21 4H5.21L4.27 2z"/>
            </svg>
          </button>
        </div>

        <p class="shop_name">${p.name}</p>
        <p class="shop_price">${money(basePrice)}</p>
      </article>
    `;
  }).join("");
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchText = e.target.value.trim();
    render();
  });
}

document.querySelectorAll(".filter_link").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.category) {
      activeCategory = btn.dataset.category;
      document.querySelectorAll("[data-category]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }

    if (btn.dataset.price) {
      activePrice = btn.dataset.price;
      document.querySelectorAll("[data-price]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }

    render();
  });
});

// read category from URL
const params = new URLSearchParams(window.location.search);
const catFromUrl = params.get("cat");
if (catFromUrl) {
  activeCategory = catFromUrl;
  document.querySelectorAll("[data-category]").forEach((b) => {
    b.classList.toggle("active", b.dataset.category === catFromUrl);
  });
}

render();