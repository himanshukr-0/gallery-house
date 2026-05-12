/* ════ GALLERY HOUSE – script.js (enhanced) ════ */

// ── Render Product Cards ──
function renderProducts(filter) {
  const grid = document.getElementById("products-grid");
  const all = getProducts();
  const list = (filter === "all" ? all : all.filter(p => p.cat === filter)).slice(0, 8);
  grid.innerHTML = list.map(p => `
    <div class="product-card" id="prod-card-${p.id}" data-id="${p.id}" onclick="openProdModal(${p.id})">
      <div class="product-img">${p.photo ? `<img src="${p.photo}" style="width:100%;height:100%;object-fit:cover" alt="${p.name}">` : p.emoji}</div>
      <div class="product-body">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-name">${p.name}</div>
        <div class="product-brand">${p.brand}</div>
        <div class="price-row">
          <span class="price-now">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="price-old">₹${p.mrp.toLocaleString('en-IN')}</span>
          <span class="price-off">${p.discount}% OFF</span>
        </div>
        <div style="color:#43e97b;font-size:.8rem;margin-bottom:10px">EMI ₹${calcEMI(p.price,p.emiMonths)}/mo</div>
        <button class="add-cart-btn" id="add-${p.id}" onclick="event.stopPropagation();handleAddToCart(${p.id})">🛒 Add to Cart</button>
      </div>
    </div>`).join('');
  setupAnimations();
}

// ── Search Products ──
function searchProducts(query) {
  if (!query.trim()) {
    renderProducts("all");
    return;
  }
  
  const grid = document.getElementById("products-grid");
  const all = getProducts();
  const queryLower = query.toLowerCase();
  
  const results = all.filter(p => 
    p.name.toLowerCase().includes(queryLower) || 
    p.brand.toLowerCase().includes(queryLower) ||
    p.cat.toLowerCase().includes(queryLower)
  );
  
  if (results.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#8888aa">
      <div style="font-size:3rem;margin-bottom:12px">🔍</div>
      <p style="font-size:1.1rem">No products found for "${query}"</p>
      <small>Try searching for: mobiles, laptops, TVs, ACs, or brands like Samsung, Apple</small>
    </div>`;
    return;
  }
  
  grid.innerHTML = results.map(p => `
    <div class="product-card" id="prod-card-${p.id}" data-id="${p.id}" onclick="openProdModal(${p.id})">
      <div class="product-img">${p.photo ? `<img src="${p.photo}" style="width:100%;height:100%;object-fit:cover" alt="${p.name}">` : p.emoji}</div>
      <div class="product-body">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-name">${p.name}</div>
        <div class="product-brand">${p.brand}</div>
        <div class="price-row">
          <span class="price-now">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="price-old">₹${p.mrp.toLocaleString('en-IN')}</span>
          <span class="price-off">${p.discount}% OFF</span>
        </div>
        <div style="color:#43e97b;font-size:.8rem;margin-bottom:10px">EMI ₹${calcEMI(p.price,p.emiMonths)}/mo</div>
        <button class="add-cart-btn" id="add-${p.id}" onclick="event.stopPropagation();handleAddToCart(${p.id})">🛒 Add to Cart</button>
      </div>
    </div>`).join('');
  setupAnimations();
}

// ── Cart ──
function handleAddToCart(id) {
  const p = getProduct(id);
  let variants = {};
  
  // Extract selected variants if modal is open for this product
  const modalBox = document.getElementById('prod-modal-box');
  if (modalBox && modalBox.closest('.prod-modal-overlay.open')) {
    const activeColor = modalBox.querySelector('.var-color.active');
    if (activeColor) variants.color = { hex: activeColor.style.background, name: activeColor.title };
    
    const activeStorage = modalBox.querySelector('.var-chip.active');
    if (activeStorage) variants.storage = activeStorage.textContent;
  } else {
    // If added from grid, use defaults if available
    if (p.colors && p.colors.length) variants.color = p.colors[0];
    if (p.storages && p.storages.length) variants.storage = p.storages[0];
  }
  
  const newCount = addToCartStore(p, 1, variants);
  updateCartUI(newCount);
  showToast(`✅ "${p.name}" added to cart!`);
}

function updateCartUI(count) {
  if (count === undefined) count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function openCart() {
  renderCartSidebar();
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

function renderCartSidebar() {
  const cart = getCart();
  const itemsEl = document.getElementById('cart-sidebar-items');
  const footerEl = document.getElementById('cart-sidebar-footer');
  if (!cart.length) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p><small>Add items to get started!</small></div>`;
    footerEl.innerHTML = '';
    return;
  }
  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cs-item">
      <div class="cs-emoji">${item.photo ? `<img src="${item.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">` : item.emoji}</div>
      <div class="cs-info">
        <div class="cs-name">${item.name}</div>
        <div class="cs-brand">${item.brand} ${item.variants && item.variants.storage ? `· ${item.variants.storage}` : ''}</div>
        ${item.variants && item.variants.color ? `<div style="display:flex;align-items:center;gap:4px;font-size:0.7rem;color:#8888aa;margin-top:2px"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.variants.color.hex}"></span>${item.variants.color.name}</div>` : ''}
        <div class="cs-qty-row">
          <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
        </div>
      </div>
      <div>
        <div class="cs-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <button class="cs-remove" onclick="removeCartItem(${idx})">🗑️</button>
      </div>
    </div>`).join('');
  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  footerEl.innerHTML = `
    <div class="cs-total-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
    <div class="cs-total-row"><span>Shipping</span><span style="color:#43e97b">${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
    <div class="cs-grand"><span>Total</span><span>₹${(subtotal + shipping).toLocaleString('en-IN')}</span></div>
    <a href="checkout.html" class="checkout-btn">Proceed to Checkout →</a>
    <button class="continue-btn" onclick="closeCart()">← Continue Shopping</button>`;
}

function changeQty(idx, delta) {
  const cart = getCart();
  const item = cart[idx];
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateCartUI();
  renderCartSidebar();
}

function removeCartItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  updateCartUI();
  renderCartSidebar();
  showToast('🗑️ Item removed from cart');
}

// ── Product Detail Modal ──
let activeTab = 'specs';

function openProdModal(id) {
  const p = getProduct(id);
  if (!p) return;
  activeTab = 'specs';
  const content = document.getElementById('prod-modal-content');
  
  // Create image gallery HTML
  const images = p.images && p.images.length ? p.images : (p.photo ? [p.photo] : []);
  let mediaHtml = '';
  if (images.length > 0) {
    mediaHtml = `
      <div class="prod-gallery-main">
        <img id="main-gallery-img" src="${images[0]}" alt="${p.name}">
      </div>
      ${images.length > 1 ? `
      <div class="prod-gallery-thumbs">
        ${images.map((src, idx) => `
          <img src="${src}" class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="document.getElementById('main-gallery-img').src=this.src; document.querySelectorAll('.gallery-thumb').forEach(el=>el.classList.remove('active')); this.classList.add('active');" alt="Product image ${idx + 1}">
        `).join('')}
      </div>` : ''}
    `;
  } else {
    mediaHtml = `<span style="font-size:7rem;position:relative;z-index:1">${p.emoji}</span>`;
  }

  // Mobile variants (Colors & Storage)
  let variantsHtml = '';
  if (p.cat === 'mobile' && ((p.colors && p.colors.length) || (p.storages && p.storages.length))) {
    variantsHtml = '<div class="modal-variants">';
    if (p.colors && p.colors.length) {
      variantsHtml += `
        <div class="variant-group">
          <label>Color</label>
          <div class="variant-opts">
            ${p.colors.map((c, i) => `<span class="var-color ${i===0?'active':''}" style="background:${c.hex}" title="${c.name}" onclick="document.querySelectorAll('.var-color').forEach(el=>el.classList.remove('active'));this.classList.add('active')"></span>`).join('')}
          </div>
        </div>`;
    }
    if (p.storages && p.storages.length) {
      variantsHtml += `
        <div class="variant-group">
          <label>Storage</label>
          <div class="variant-opts">
            ${p.storages.map((s, i) => `<span class="var-chip ${i===0?'active':''}" onclick="document.querySelectorAll('.var-chip').forEach(el=>el.classList.remove('active'));this.classList.add('active')">${s}</span>`).join('')}
          </div>
        </div>`;
    }
    variantsHtml += '</div>';
  }

  content.innerHTML = `
    <div class="modal-inner">
      <div class="modal-media">${mediaHtml}</div>
      <div class="modal-info">
        ${p.badge ? `<span class="modal-badge">${p.badge}</span>` : ''}
        <div class="modal-name">${p.name}</div>
        <div class="modal-brand">${p.brand} · <span style="text-transform:capitalize">${p.cat}</span></div>
        <div class="modal-price-row">
          <span class="modal-price">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="modal-mrp">₹${p.mrp.toLocaleString('en-IN')}</span>
          <span class="modal-off">${p.discount}% OFF</span>
        </div>
        <div class="modal-emi">💳 No Cost EMI: ₹${calcEMI(p.price, p.emiMonths)}/month × ${p.emiMonths} months</div>
        ${variantsHtml}
        <div class="modal-tabs">
          <button class="modal-tab active" id="tab-specs" onclick="switchTab('specs')">📋 Specifications</button>
          <button class="modal-tab" id="tab-reviews" onclick="switchTab('reviews')">⭐ Reviews (${(p.reviews||[]).length})</button>
        </div>
        <div id="tab-content">${renderSpecs(p)}</div>
        <button class="modal-add-btn" onclick="handleAddToCart(${p.id});showToast('✅ Added to cart!')">🛒 Add to Cart</button>
      </div>
    </div>`;
  document.getElementById('prod-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderSpecs(p) {
  const specs = p.specs || {};
  if (!Object.keys(specs).length) return '<p style="color:#8888aa">No specifications available.</p>';
  return `<table class="specs-table">${Object.entries(specs).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>`;
}

function renderReviews(p) {
  const reviews = p.reviews || [];
  if (!reviews.length) return '<p style="color:#8888aa">No reviews yet.</p>';
  const avgStars = Math.round(reviews.reduce((s,r)=>s+r.stars,0)/reviews.length);
  return `
    <div style="margin-bottom:16px;display:flex;align-items:center;gap:12px">
      <span style="font-size:2rem;font-weight:800;color:#f9ca24">${(reviews.reduce((s,r)=>s+r.stars,0)/reviews.length).toFixed(1)}</span>
      <div><div style="color:#f9ca24;font-size:1rem">${'★'.repeat(avgStars)}${'☆'.repeat(5-avgStars)}</div><div style="color:#8888aa;font-size:.8rem">${reviews.length} reviews</div></div>
    </div>
    ${reviews.map(r=>`
      <div class="review-item">
        <div class="review-head">
          <div class="review-avatar">${r.user[0]}</div>
          <div><div class="review-user">${r.user} ${r.verified?'<span class="verified">✓ Verified</span>':''}</div><div class="review-date">${r.date}</div></div>
          <div class="review-stars" style="margin-left:auto">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
        </div>
        <div class="review-text">${r.text}</div>
      </div>`).join('')}`;
}

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  const box = document.getElementById('prod-modal-box');
  const id = parseInt(box.querySelector('.modal-add-btn').getAttribute('onclick').match(/\d+/)[0]);
  const p = getProduct(id);
  document.getElementById('tab-content').innerHTML = tab === 'specs' ? renderSpecs(p) : renderReviews(p);
}

function closeProdModal(e) {
  if (e && e.target !== document.getElementById('prod-modal-overlay') && e.target !== document.querySelector('.prod-modal-close')) return;
  document.getElementById('prod-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

// ── Navbar scroll ──
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
  document.getElementById("scroll-top-btn").classList.toggle("visible", window.scrollY > 400);
});

// ── Search ──
document.getElementById("search-btn").addEventListener("click", () => {
  const o = document.getElementById("search-overlay");
  o.classList.toggle("open");
  if (o.classList.contains("open")) {
    document.getElementById("search-input").focus();
  }
});

document.getElementById("search-close").addEventListener("click", () => {
  document.getElementById("search-overlay").classList.remove("open");
});

// Search input event listener
document.getElementById("search-input").addEventListener("input", (e) => {
  const query = e.target.value;
  searchProducts(query);
  if (query.trim()) {
    document.getElementById("featured").scrollIntoView({ behavior: "smooth" });
  }
});

// Search on Enter key
document.getElementById("search-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = e.target.value;
    searchProducts(query);
    if (query.trim()) {
      document.getElementById("featured").scrollIntoView({ behavior: "smooth" });
    }
  }
});

// Close search overlay when clicking outside
document.addEventListener("click", (e) => {
  const overlay = document.getElementById("search-overlay");
  if (!e.target.closest(".search-bar-wrap") && !e.target.closest("#search-btn")) {
    overlay.classList.remove("open");
  }
});

// ── Menu Toggle ──
document.getElementById("main-menu-btn").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("nav-links").classList.toggle("open");
  this.classList.toggle("active");
});

// Close menu when a link is clicked or clicking outside
document.addEventListener("click", (e) => {
  const navLinks = document.getElementById("nav-links");
  const menuBtn = document.getElementById("main-menu-btn");
  
  if (e.target.closest(".nav-links a")) {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("active");
  } else if (!e.target.closest("#nav-links") && !e.target.closest("#main-menu-btn")) {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("active");
  }
});

// ── Cart Button ──
document.getElementById("cart-btn").addEventListener("click", openCart);

// ── Filter Tabs ──
document.getElementById("filter-tabs").addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-tab")) return;
  document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
  e.target.classList.add("active");
  renderProducts(e.target.dataset.filter);
});

// ── Category Cards ──
document.getElementById("categories-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".category-card");
  if (!card) return;
  const cat = card.dataset.category;
  document.getElementById("featured").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    document.querySelectorAll(".filter-tab").forEach(t => t.classList.toggle("active", t.dataset.filter === cat));
    renderProducts(cat);
  }, 600);
});

// ── Particles ──
function createParticles() {
  const wrap = document.getElementById("particles");
  if (!wrap) return;
  const colors = ["#6C63FF","#00C9FF","#f5576c","#43e97b"];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    const size = Math.random() * 5 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${Math.random()*8+5}s;animation-delay:${Math.random()*2}s`;
    wrap.appendChild(p);
  }
}

// ── Newsletter ──
function handleNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById("nl-email").value;
  
  const subscribers = JSON.parse(localStorage.getItem('gh_subscribers') || '[]');
  if (!subscribers.find(s => s.email === email)) {
    subscribers.push({ email: email, date: new Date().toLocaleDateString('en-IN') });
    localStorage.setItem('gh_subscribers', JSON.stringify(subscribers));
  }

  showToast(`🎉 Subscribed! Welcome, ${email.split("@")[0]}!`);
  e.target.reset();
}

// ── Animations ──
function setupAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.style.opacity="1"; en.target.style.transform="translateY(0)"; }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".category-card,.product-card,.why-card,.testimonial-card,.banner-card").forEach((el, i) => {
    if (el.style.opacity === "1") return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.45s ease ${i * 0.05}s, transform 0.45s ease ${i * 0.05}s`;
    observer.observe(el);
  });
}

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  renderProducts("all");
  createParticles();
  setupAnimations();
  updateCartUI();
});
