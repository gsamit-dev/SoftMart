// ─── Data ───────────────────────────────────────────────────────────────────
const softwareData = [
  { id:1, name:"SecureShield Pro", cat:"Antivirus", price:2999, oldPrice:4999, rating:4.8, reviews:1240, dev:"CyberLabs Inc.", icon:"🛡️", desc:"Enterprise-grade antivirus with real-time protection." },
  { id:2, name:"DesignFlow Studio", cat:"Design", price:5999, oldPrice:8999, rating:4.7, reviews:890, dev:"CreativeEdge", icon:"🎨", desc:"Professional design suite for UI/UX designers." },
  { id:3, name:"DevKit Pro", cat:"Developer Tools", price:4999, oldPrice:7999, rating:4.9, reviews:2100, dev:"CodeCraft", icon:"⚙️", desc:"All-in-one developer toolkit with 200+ utilities." },
  { id:4, name:"OfficeMax Suite", cat:"Office", price:3999, oldPrice:6999, rating:4.6, reviews:3200, dev:"ProdSoft", icon:"📊", desc:"Complete office productivity suite." },
  { id:5, name:"AIWriter X", cat:"AI Tools", price:1999, oldPrice:3499, rating:4.8, reviews:670, dev:"NeuralWorks", icon:"🤖", desc:"AI-powered writing assistant for professionals." },
  { id:6, name:"CleanBoost Ultra", cat:"Utility", price:1499, oldPrice:2499, rating:4.5, reviews:1800, dev:"SystemOpt", icon:"⚡", desc:"Speed up your PC with one-click optimization." },
  { id:7, name:"PhotoEdit Master", cat:"Design", price:4499, oldPrice:7499, rating:4.7, reviews:540, dev:"PixelPro", icon:"🖼️", desc:"Advanced photo editing with AI enhancements." },
  { id:8, name:"VaultPass", cat:"Utility", price:999, oldPrice:1999, rating:4.6, reviews:2300, dev:"SecureVault", icon:"🔐", desc:"Secure password manager with cloud sync." },
  { id:9, name:"CodeAssist AI", cat:"AI Tools", price:3499, oldPrice:5499, rating:4.9, reviews:980, dev:"DevAI Labs", icon:"💡", desc:"AI code completion and review tool." },
  { id:10, name:"NetGuard VPN", cat:"Utility", price:1199, oldPrice:2299, rating:4.4, reviews:4100, dev:"NetShield", icon:"🌐", desc:"Ultra-fast VPN with 100+ server locations." },
  { id:11, name:"DataSync Pro", cat:"Developer Tools", price:6999, oldPrice:9999, rating:4.8, reviews:320, dev:"SyncMaster", icon:"🔄", desc:"Database synchronization and migration tool." },
  { id:12, name:"SlideGenius", cat:"Office", price:2499, oldPrice:4499, rating:4.5, reviews:760, dev:"PresentPro", icon:"📽️", desc:"Beautiful presentation templates and builder." },
];

let cart = JSON.parse(localStorage.getItem('sm_cart') || '[]');

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
function isLoggedIn() { return !!localStorage.getItem('sm_user'); }

function requireLogin(redirectBack) {
  localStorage.setItem('sm_login_redirect', redirectBack || location.href);
  showToast('⚠️ Please login to continue!', 'error');
  setTimeout(() => { location.href = 'login.html'; }, 1200);
}

function updateNavAuth() {
  const user = localStorage.getItem('sm_user');
  document.querySelectorAll('.nav-login-btn').forEach(el => el.style.display = user ? 'none' : '');
  document.querySelectorAll('.nav-signup-btn').forEach(el => el.style.display = user ? 'none' : '');
  document.querySelectorAll('.nav-user-menu').forEach(el => {
    el.style.cssText = user ? 'display:flex!important' : 'display:none!important';
  });
  if (user) {
    const u = JSON.parse(user);
    document.querySelectorAll('.nav-user-name').forEach(el => el.textContent = u.name.split(' ')[0]);
    document.querySelectorAll('.nav-user-avatar').forEach(el => el.textContent = u.name[0].toUpperCase());
    const isVendor = u.role === 'vendor';
    document.querySelectorAll('.nav-vendor-link').forEach(el => el.style.display = isVendor ? '' : 'none');
  }
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
function saveCart() { localStorage.setItem('sm_cart', JSON.stringify(cart)); updateCartBadge(); }

function updateCartBadge() {
  const total = cart.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = total; el.style.display = total ? 'inline-flex' : 'none'; });
}

function addToCart(id) {
  if (!isLoggedIn()) { requireLogin(location.href); return; }
  const item = softwareData.find(s=>s.id===id);
  if (!item) return;
  const existing = cart.find(c=>c.id===id);
  if (existing) existing.qty++;
  else cart.push({...item, qty:1});
  saveCart();
  showToast(`✅ ${item.name} added to cart!`, 'success');
}

function showToast(msg, type='success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const id = 'toast_' + Date.now();
  const colors = { success:'#22c55e', error:'#ef4444', info:'#3b82f6' };
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast show align-items-center border-0 mb-2" style="background:${colors[type]};color:#fff;border-radius:12px;min-width:280px;">
      <div class="d-flex align-items-center p-3 gap-2">
        <div class="flex-grow-1 fw-500">${msg}</div>
        <button type="button" class="btn-close btn-close-white" onclick="document.getElementById('${id}').remove()"></button>
      </div>
    </div>`);
  setTimeout(()=>{ const el=document.getElementById(id); if(el) el.remove(); }, 3500);
}

// ─── Dark Mode ───────────────────────────────────────────────────────────────
function initDarkMode() {
  const btn = document.getElementById('darkToggle');
  if (!btn) return;
  const isDark = localStorage.getItem('sm_dark') === '1';
  if (isDark) { document.body.classList.add('dark-mode'); btn.innerHTML='<i class="fas fa-sun"></i>'; }
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const dark = document.body.classList.contains('dark-mode');
    localStorage.setItem('sm_dark', dark ? '1' : '0');
    btn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

// ─── Search & Filter ─────────────────────────────────────────────────────────
function renderCards(data, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = data.map(s => `
    <div class="col-lg-3 col-md-4 col-sm-6 fade-in-up">
      <div class="software-card h-100">
        <div class="card-img-wrap">${s.icon}</div>
        <div class="card-body d-flex flex-column">
          <span class="badge-cat mb-2">${s.cat}</span>
          <h6 class="card-title">${s.name}</h6>
          <p class="developer mb-2"><i class="fas fa-user-circle me-1"></i>${s.dev}</p>
          <div class="stars mb-2">${'★'.repeat(Math.floor(s.rating))}${'☆'.repeat(5-Math.floor(s.rating))} <span class="text-muted">(${s.reviews})</span></div>
          <div class="mt-auto">
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="price">৳${s.price}</span>
              <span class="price-old">৳${s.oldPrice}</span>
            </div>
            <div class="d-flex gap-2">
              <a href="product-details.html?id=${s.id}" class="btn btn-outline-primary btn-sm flex-fill btn-card-buy">Details</a>
              <button class="btn btn-primary btn-sm flex-fill btn-card-buy btn-pulse" onclick="addToCart(${s.id})"><i class="fas fa-cart-plus me-1"></i>Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function initProductsPage() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  let filtered = [...softwareData];

  function applyFilters() {
    const search = (document.getElementById('searchInput')?.value||'').toLowerCase();
    const cat = document.getElementById('catFilter')?.value||'';
    const maxPrice = parseFloat(document.getElementById('priceFilter')?.value||99999);
    const minRating = parseFloat(document.getElementById('ratingFilter')?.value||0);
    const sort = document.getElementById('sortSelect')?.value||'';
    filtered = softwareData.filter(s =>
      (!search || s.name.toLowerCase().includes(search) || s.cat.toLowerCase().includes(search)) &&
      (!cat || s.cat === cat) &&
      s.price <= maxPrice &&
      s.rating >= minRating
    );
    if (sort==='price-asc') filtered.sort((a,b)=>a.price-b.price);
    else if (sort==='price-desc') filtered.sort((a,b)=>b.price-a.price);
    else if (sort==='rating') filtered.sort((a,b)=>b.rating-a.rating);
    else if (sort==='name') filtered.sort((a,b)=>a.name.localeCompare(b.name));
    const countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = `${filtered.length} results`;
    renderCards(filtered, 'productsGrid');
  }

  ['searchInput','catFilter','priceFilter','ratingFilter','sortSelect'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', applyFilters);
  });
  applyFilters();
}

// ─── Product Detail ───────────────────────────────────────────────────────────
function initProductDetail() {
  const container = document.getElementById('productDetail');
  if (!container) return;
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id')) || 1;
  const s = softwareData.find(x=>x.id===id) || softwareData[0];

  const features = ["Real-time protection & monitoring","Automatic updates","Multi-device support","24/7 customer support","Cloud backup integration","Advanced threat detection"];
  const requirements = ["Windows 10/11 (64-bit)","4 GB RAM minimum","2 GB disk space","Internet connection required"];
  const screenshots = ['🖥️','📊','🔧','🎯'];

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="product-banner mb-4">${s.icon}</div>
        <h2 class="fw-800 mb-2">${s.name}</h2>
        <div class="d-flex align-items-center gap-3 mb-3">
          <span class="badge bg-primary">${s.cat}</span>
          <span class="stars">${'★'.repeat(Math.floor(s.rating))} ${s.rating}</span>
          <span class="text-muted">(${s.reviews} reviews)</span>
          <span class="text-muted"><i class="fas fa-user-circle me-1"></i>${s.dev}</span>
        </div>
        <p class="lead mb-4">${s.desc} Experience the best-in-class software solution designed for professionals and enterprises alike.</p>
        <h5 class="fw-700 mb-3">Key Features</h5>
        <ul class="list-unstyled mb-4">${features.map(f=>`<li class="mb-2"><i class="fas fa-check-circle feature-check"></i>${f}</li>`).join('')}</ul>
        <h5 class="fw-700 mb-3">System Requirements</h5>
        <div class="license-box mb-4"><ul class="mb-0">${requirements.map(r=>`<li>${r}</li>`).join('')}</ul></div>
        <h5 class="fw-700 mb-3">Screenshots</h5>
        <div class="row g-2 mb-4">${screenshots.map((s,i)=>`
          <div class="col-3">
            <div class="screenshot-thumb" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:10px;height:90px;display:flex;align-items:center;justify-content:center;font-size:2rem;" data-bs-toggle="modal" data-bs-target="#screenshotModal" onclick="document.getElementById('modalEmoji').textContent='${s}'">${s}</div>
          </div>`).join('')}</div>
        <h5 class="fw-700 mb-3">Customer Reviews</h5>
        ${[{n:'Alex Johnson',r:5,t:'Absolutely love this software!'},{n:'Sarah Miller',r:4,t:'Great product, easy to use.'},{n:'Robert Chen',r:5,t:'Best purchase I made this year!'}].map(rv=>`
          <div class="review-card mb-3">
            <div class="d-flex align-items-center gap-3 mb-2">
              <div class="reviewer-avatar">${rv.n[0]}</div>
              <div><div class="fw-700">${rv.n}</div><div class="stars">${'★'.repeat(rv.r)}</div></div>
            </div>
            <p class="mb-0">${rv.t}</p>
          </div>`).join('')}
      </div>
      <div class="col-lg-4">
        <div class="price-card sticky-top" style="top:90px">
          <div class="text-center mb-4">
            <div style="font-size:4rem">${s.icon}</div>
            <h4 class="fw-700 mt-2">${s.name}</h4>
          </div>
          <div class="d-flex align-items-center gap-3 mb-4">
            <span style="font-size:2rem;font-weight:800;color:var(--primary)">৳${s.price}</span>
            <span class="price-old fs-5">৳${s.oldPrice}</span>
            <span class="badge bg-success">Save ${Math.round((1-s.price/s.oldPrice)*100)}%</span>
          </div>
          <div class="d-grid gap-2 mb-4">
            <button class="btn btn-primary btn-lg btn-pulse" onclick="addToCart(${s.id})"><i class="fas fa-cart-plus me-2"></i>Add to Cart</button>
            <a href="checkout.html" class="btn btn-outline-primary btn-lg" onclick="addToCart(${s.id})">Buy Now</a>
          </div>
          <div class="license-box">
            <div class="fw-700 mb-2"><i class="fas fa-key me-2 text-primary"></i>License Info</div>
            <div class="text-muted small">✔ 1-year license included<br>✔ 3 device activation<br>✔ Free updates<br>✔ 30-day money-back guarantee</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="screenshotModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-4">
          <div id="modalEmoji" style="font-size:8rem"></div>
          <button class="btn btn-secondary mt-3" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>`;
}

// ─── Cart Page ────────────────────────────────────────────────────────────────
function initCartPage() {
  const el = document.getElementById('cartItems');
  if (!el) return;
  function render() {
    if (!cart.length) {
      el.innerHTML = `<div class="text-center py-5"><div style="font-size:4rem">🛒</div><h4 class="mt-3">Your cart is empty</h4><a href="products.html" class="btn btn-primary mt-3">Browse Software</a></div>`;
      document.getElementById('cartSummary').innerHTML = '';
      return;
    }
    el.innerHTML = cart.map(item => `
      <div class="cart-item d-flex align-items-center gap-3">
        <div class="cart-item-icon">${item.icon}</div>
        <div class="flex-grow-1">
          <h6 class="fw-700 mb-1">${item.name}</h6>
          <span class="badge-cat">${item.cat}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="fw-600 px-2">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
        <div class="text-end" style="min-width:80px">
          <div class="price">৳${(item.price*item.qty).toFixed(2)}</div>
          <small class="text-muted">৳${item.price} each</small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
      </div>`).join('');
    const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
    const tax = subtotal*0.1;
    document.getElementById('cartSummary').innerHTML = `
      <div class="cart-summary">
        <h5 class="fw-700 mb-3">Order Summary</h5>
        <div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>৳${subtotal.toFixed(2)}</span></div>
        <div class="d-flex justify-content-between mb-2"><span>Tax (10%)</span><span>৳${tax.toFixed(2)}</span></div>
        <hr>
        <div class="d-flex justify-content-between fw-700 fs-5 mb-4"><span>Total</span><span class="text-primary">৳${(subtotal+tax).toFixed(2)}</span></div>
        <a href="checkout.html" class="btn btn-primary btn-lg d-block w-100">Proceed to Checkout</a>
        <a href="products.html" class="btn btn-outline-secondary w-100 mt-2">Continue Shopping</a>
      </div>`;
  }
  window.changeQty = (id,d) => { const i=cart.find(c=>c.id===id); if(i){i.qty+=d;if(i.qty<1)cart=cart.filter(c=>c.id!==id);} saveCart();render(); };
  window.removeItem = (id) => { cart=cart.filter(c=>c.id!==id); saveCart();render();showToast('Item removed','info'); };
  render();
}

// ─── Form Validation ─────────────────────────────────────────────────────────
function initForms() {
  document.querySelectorAll('form.needs-validate[data-redirect]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
      showToast('✅ Success!','success');
      setTimeout(()=>{ location.href = form.dataset.redirect; }, 1000);
    });
  });
}

// ─── Image Slider / Hero ──────────────────────────────────────────────────────
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let cur = 0;
  setInterval(() => {
    slides[cur].classList.remove('active');
    cur = (cur+1)%slides.length;
    slides[cur].classList.add('active');
  }, 3000);
}

// ─── Featured Cards (Home) ────────────────────────────────────────────────────
function initHomeFeatured() {
  const el = document.getElementById('featuredCards');
  if (!el) return;
  renderCards(softwareData.slice(0,8), 'featuredCards');
}

// ─── Sidebar Toggle (mobile) ──────────────────────────────────────────────────
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) toggle.addEventListener('click', ()=>sidebar.classList.toggle('open'));
}

// ─── Checkout payment ─────────────────────────────────────────────────────────
function initCheckout() {
  document.querySelectorAll('.payment-option').forEach(el => {
    el.addEventListener('click', ()=>{
      document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('active'));
      el.classList.add('active');
    });
  });
  const orderItems = document.getElementById('checkoutOrderItems');
  if (orderItems) {
    if (!cart.length) { orderItems.innerHTML='<p class="text-muted">No items in cart</p>'; return; }
    const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
    orderItems.innerHTML = cart.map(i=>`<div class="order-item"><span>${i.icon} ${i.name} x${i.qty}</span><span>৳${(i.price*i.qty).toFixed(2)}</span></div>`).join('') +
      `<div class="order-item fw-700"><span>Total</span><span class="text-primary">৳${(subtotal*1.1).toFixed(2)}</span></div>`;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateNavAuth();
  initDarkMode();
  initHomeFeatured();
  initProductsPage();
  initProductDetail();
  initCartPage();
  initForms();
  initSlider();
  initSidebar();
  initCheckout();
});
