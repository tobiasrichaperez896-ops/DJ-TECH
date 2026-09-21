const CONFIG = window.DJTECH_CONFIG || {};
const STORAGE_KEY = 'djtech-cart';
const products = window.DJTECH_PRODUCTS || [];
const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: CONFIG.currency || 'ARS',
  maximumFractionDigits: 0
});

function getCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(amount) {
  return money.format(amount);
}

function findProduct(productId) {
  return products.find((product) => product.id === Number(productId));
}

function getCartCount() {
  return getCart().reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function updateCartCount() {
  const badge = document.getElementById('cartCountBadge');
  if (badge) badge.textContent = String(getCartCount());
}

function getCartItems() {
  return getCart().map((item) => {
    const product = findProduct(item.id);
    return product ? { ...product, quantity: Number(item.quantity || 0) } : null;
  }).filter(Boolean);
}

function getCartTotals() {
  const items = getCartItems();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < (CONFIG.shipping?.freeFrom || 120000) ? 0 : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ id: product.id, quantity: 1 });

  saveCart(cart);
  updateCartCount();
  renderCartPanel();
  renderCartPage();
  const panel = document.getElementById('cartPanel');
  if (panel) panel.classList.add('open');
}

function changeQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === Number(productId));
  if (!item) return;

  item.quantity += delta;
  const nextCart = cart.filter((entry) => entry.quantity > 0);
  saveCart(nextCart);
  updateCartCount();
  renderCartPanel();
  renderCartPage();
}

function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.id !== Number(productId)));
  updateCartCount();
  renderCartPanel();
  renderCartPage();
}

function buildWhatsAppUrl(message) {
  const number = String(CONFIG.contact?.whatsappNumber || '').replace(/\D/g, '');
  if (!number) return '';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function renderProductCard(product) {
  const offerMarkup = product.oldPrice && product.discount
    ? `<div class="offer-price"><span class="old-price">${formatPrice(product.oldPrice)}</span><span class="discount">-${product.discount}%</span></div>`
    : '';

  return `
    <article class="product-card" data-tags="${(product.tags || []).join(' ')}">
      <div class="product-image-wrap">
        <span class="tag">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <div class="product-meta"><span>${product.category}</span><span>Destacado</span></div>
        <h3>${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        ${offerMarkup}
        <div class="product-price-row"><span class="product-price">${formatPrice(product.price)}</span></div>
        <div class="product-actions">
          <button class="small-button" type="button" data-action="detail" data-id="${product.id}">Ver detalle</button>
          <button class="small-button primary" type="button" data-action="add" data-id="${product.id}">Agregar</button>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedProducts() {
  const target = document.getElementById('featuredProducts');
  if (!target) return;
  const featured = products.filter((product) => product.featured).slice(0, 8);
  target.innerHTML = featured.map(renderProductCard).join('');
}

function renderWeeklyOffers() {
  const target = document.getElementById('weeklyOffers');
  if (!target) return;
  const offers = products.filter((product) => product.oldPrice && product.discount).slice(0, 8);
  target.innerHTML = offers.map(renderProductCard).join('');
}

function renderCategoriesPage() {
  const target = document.getElementById('categoryShowcase');
  if (!target) return;
  const categories = [...new Set(products.map((product) => product.category))];
  const icons = ['📱', '🎧', '🔌', '🔋', '💾', '🖥️', '⌨️', '🛴', '🎮', '🧩'];
  target.innerHTML = categories.map((category, index) => `
    <a href="catalogo.html?category=${encodeURIComponent(category)}" class="category-card" aria-label="Ver ${category}">
      <span>${icons[index % icons.length]}</span><strong>${category}</strong>
    </a>
  `).join('');
}

function getSearchText(product) {
  const featureText = (product.features || []).join(' ');
  return [product.name, product.category, product.description, featureText, ...(product.tags || [])]
    .join(' ').toLocaleLowerCase('es');
}

function normalizeSearch(value) {
  return value.toLocaleLowerCase('es')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\bcelu\b/g, 'celular')
    .replace(/\bcelus\b/g, 'celulares')
    .replace(/\bcompu\b|\bpc\b/g, 'computadora')
    .replace(/\bnotebook\b|\blap\b/g, 'computadora notebook')
    .replace(/\bauris\b|\bfonos\b/g, 'auriculares')
    .replace(/\bcargador\b|\bcarga\b/g, 'cargadores')
    .replace(/\bbarato\b|\bbarata\b|\beconomico\b|\beconomica\b/g, 'precio inteligente económico')
    .replace(/\bpara jugar\b|\bjugar\b/g, 'gaming')
    .replace(/\bimpresora\b|\bimprimir\b/g, 'impresoras')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderCatalogPage() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  const searchInputs = [...document.querySelectorAll('#searchInput, #searchInputCatalog')];
  const categorySelect = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const offerFilter = document.getElementById('offerFilter');
  const sortSelect = document.getElementById('sortFilter');
  const resultsCount = document.getElementById('catalogResultsCount');
  const params = new URLSearchParams(window.location.search);
  const queryParam = params.get('q') || '';
  if (queryParam && searchInputs[0]) searchInputs[0].value = queryParam;

  const setSearchValue = (value) => {
    searchInputs.forEach((input) => { input.value = value; });
  };

  const applyFilters = () => {
    const query = normalizeSearch(searchInputs.find((input) => input.value)?.value || '');
    const category = categorySelect?.value || 'all';
    const maxPrice = Number(priceFilter?.value || 999999999);
    const offersOnly = offerFilter?.value === 'offers';
    const sortValue = sortSelect?.value || 'featured';

    let filtered = products.filter((product) => {
      const queryWords = query.split(' ').filter((word) => word.length > 2);
      const matchesQuery = !query || queryWords.every((word) => getSearchText(product).includes(word));
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice = product.price <= maxPrice;
      const matchesOffers = !offersOnly || Boolean(product.oldPrice && product.discount);
      return matchesQuery && matchesCategory && matchesPrice && matchesOffers;
    });

    if (sortValue === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortValue === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    if (sortValue === 'featured') filtered.sort((a, b) => Number(b.featured) - Number(a.featured));

    if (resultsCount) resultsCount.textContent = `${filtered.length} productos encontrados`;
    grid.innerHTML = filtered.length ? filtered.map(renderProductCard).join('') : `
      <div class="empty-state search-empty">
        <span class="empty-state-icon">⌕</span>
        <h3>${query ? 'No encontramos ese producto' : 'No hay productos con estos filtros'}</h3>
        <p>${query ? 'No tenemos productos que coincidan con tu búsqueda en este momento. Probá con otra búsqueda o explorá nuestras categorías.' : 'Probá ampliar el rango de precio, quitar el filtro de ofertas o elegir otra categoría.'}</p>
        <a href="catalogo.html" class="button secondary">Ver todo el catálogo</a>
      </div>
    `;
  };

  if (categorySelect) {
    const categories = ['all', ...new Set(products.map((product) => product.category))];
    categorySelect.innerHTML = categories.map((category) => `<option value="${category}">${category === 'all' ? 'Todas las categorías' : category}</option>`).join('');
    const categoryParam = params.get('category');
    if (categoryParam && categories.includes(categoryParam)) categorySelect.value = categoryParam;
  }
  if (offerFilter && params.get('offers') === 'true') offerFilter.value = 'offers';

  searchInputs.forEach((input) => input.addEventListener('input', () => {
    searchInputs.forEach((other) => { if (other !== input) other.value = input.value; });
    applyFilters();
  }));
  categorySelect?.addEventListener('change', applyFilters);
  priceFilter?.addEventListener('change', applyFilters);
  offerFilter?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);
  const smartForm = document.getElementById('smartSearchForm');
  const smartInput = document.getElementById('smartSearchInput');
  const smartStatus = document.getElementById('smartSearchStatus');
  smartForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = smartInput?.value.trim();
    if (!query) return;
    if (smartStatus) smartStatus.textContent = 'Interpretando tu necesidad...';
    try {
      const criteria = await requestSmartSearch(query);
      const categories = [...categorySelect.options].map((option) => option.value);
      const category = criteria?.categories?.find((value) => categories.includes(value));
      if (category) categorySelect.value = category;
      if (Number.isFinite(Number(criteria?.maxPrice)) && Number(criteria.maxPrice) > 0) {
        const priceOptions = [...priceFilter.options].map((option) => Number(option.value));
        const closest = priceOptions.find((price) => price >= Number(criteria.maxPrice));
        if (closest) priceFilter.value = String(closest);
      }
      setSearchValue(criteria?.query || query);
      applyFilters();
      if (smartStatus) smartStatus.textContent = 'Listo: ajustamos el catálogo según tu necesidad.';
    } catch {
      setSearchValue(query);
      applyFilters();
      if (smartStatus) smartStatus.textContent = 'No pudimos usar la búsqueda inteligente; aplicamos la búsqueda normal.';
    }
  });
  applyFilters();
}

function renderProductDetailPage() {
  const root = document.getElementById('productDetail');
  if (!root) return;
  const product = findProduct(new URLSearchParams(window.location.search).get('id'));

  if (!product) {
    root.innerHTML = '<div class="empty-state"><span class="empty-state-icon">⌕</span><h3>Ese producto no está disponible</h3><p>Volvé al catálogo para conocer todas las opciones de DJ TECH.</p><a href="catalogo.html" class="button primary">Explorar catálogo</a></div>';
    return;
  }

  const whatsappUrl = buildWhatsAppUrl(`Hola DJ TECH, quiero consultar por ${product.name}.`);
  const contactAction = whatsappUrl
    ? `<a class="button secondary" href="${whatsappUrl}" target="_blank" rel="noreferrer">Consultar por WhatsApp</a>`
    : '<span class="button secondary disabled-button">WhatsApp próximamente</span>';
  const offer = product.oldPrice && product.discount ? `<div class="offer-price"><span class="old-price">${formatPrice(product.oldPrice)}</span><span class="discount">-${product.discount}%</span></div>` : '';

  root.innerHTML = `
    <div class="product-detail-shell">
      <div class="product-modal-image"><img src="${product.image}" alt="${product.name}" /></div>
      <div class="product-modal-content">
        <span class="eyebrow">${product.badge}</span><span class="detail-category">${product.category}</span>
        <h3>${product.name}</h3>${offer}<div class="modal-price">${formatPrice(product.price)}</div>
        <p class="modal-description">${product.description}</p>
        <ul class="modal-specs">${product.features.map((feature) => `<li><span>✓</span><strong>${feature}</strong></li>`).join('')}</ul>
        <div class="modal-actions"><button class="button primary" type="button" data-action="add" data-id="${product.id}">Agregar al carrito</button>${contactAction}</div>
      </div>
    </div>
  `;
}

function renderCartItem(item) {
  return `<div class="cart-item"><img src="${item.image}" alt="${item.name}" /><div><h4>${item.name}</h4><p>${formatPrice(item.price)} c/u</p><div class="qty-controls"><button type="button" data-action="decrease" data-id="${item.id}" aria-label="Restar cantidad">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-id="${item.id}" aria-label="Sumar cantidad">+</button></div></div><div class="cart-item-price">${formatPrice(item.price * item.quantity)}<button class="remove-button" type="button" data-action="remove" data-id="${item.id}">Eliminar</button></div></div>`;
}

function renderCartPanel() {
  const target = document.getElementById('cartItems');
  const subtotal = document.getElementById('cartSubtotal');
  const total = document.getElementById('cartTotal');
  if (!target || !subtotal || !total) return;
  const items = getCartItems();
  target.innerHTML = items.length ? items.map(renderCartItem).join('') : '<div class="empty-state"><span class="empty-state-icon">🛒</span><h3>Tu carrito está vacío</h3><p>Agregá productos para armar tu pedido.</p></div>';
  const totals = getCartTotals();
  subtotal.textContent = formatPrice(totals.subtotal);
  total.textContent = formatPrice(totals.total);
}

function renderCartPage() {
  const list = document.getElementById('cartList');
  const total = document.getElementById('cartTotalAmount');
  const summary = document.getElementById('orderSummaryList');
  const submitButton = document.getElementById('submitOrderBtn');
  if (!list || !total) return;
  const items = getCartItems();
  const totals = getCartTotals();

  list.innerHTML = items.length ? items.map(renderCartItem).join('') : '<div class="empty-state"><span class="empty-state-icon">🛒</span><h3>Tu carrito está vacío</h3><p>Explorá el catálogo y agregá productos para solicitar tu pedido.</p><a href="catalogo.html" class="button primary">Explorar catálogo</a></div>';
  total.textContent = formatPrice(totals.total);
  if (summary) summary.innerHTML = items.length ? items.map((item) => `<li><span>${item.name} × ${item.quantity}</span><strong>${formatPrice(item.price * item.quantity)}</strong></li>`).join('') : '<li><span>Sin productos</span><strong>$0</strong></li>';
  if (submitButton) submitButton.disabled = !items.length;
}

function buildOrderSummary(formData) {
  const items = getCartItems();
  const totals = getCartTotals();
  const lines = items.map((item) => `${item.name} x ${item.quantity}\nPrecio: ${formatPrice(item.price * item.quantity)}`).join('\n\n');
  return `NUEVO PEDIDO - DJ TECH\n\nCLIENTE:\nNombre: ${formData.get('nombre') || ''}\nEmail: ${formData.get('email') || ''}\nTeléfono: ${formData.get('telefono') || ''}\nDirección: ${formData.get('direccion') || ''}\nCiudad: ${formData.get('ciudad') || ''}\n\nPRODUCTOS:\n${lines}\n\nTOTAL: ${formatPrice(totals.total)}\n\nNOTAS:\n${formData.get('notas') || 'Sin notas adicionales'}`;
}

function handleOrderSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const items = getCartItems();
  if (!items.length) return;
  const formData = new FormData(form);
  const summary = buildOrderSummary(formData);
  const endpoint = CONFIG.integrations?.orderEndpoint;
  const status = document.getElementById('orderStatus');
  const submitButton = document.getElementById('submitOrderBtn');
  if (status) status.textContent = 'Enviando tu solicitud...';
  if (submitButton) submitButton.disabled = true;

  const openMailFallback = () => {
    const email = CONFIG.contact?.email;
    if (!email || email.startsWith('CONFIGURAR_')) {
      alert('No hay un correo administrador configurado.');
      return;
    }
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Nuevo pedido - DJ TECH')}&body=${encodeURIComponent(summary)}`;
    alert('Se abrió tu cliente de correo con el resumen completo del pedido. Revisá el destinatario antes de enviar.');
  };

  if (endpoint) {
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ summary, items, customer: Object.fromEntries(formData) }) })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.accepted) {
          if (status) status.textContent = 'No pudimos enviar el pedido ahora. Revisá que el backend esté activo e intentá nuevamente; tu carrito sigue guardado.';
          return;
        }
        if (status) status.textContent = 'Pedido enviado. Te contactaremos para confirmar disponibilidad y entrega.';
        form.reset();
        localStorage.removeItem(STORAGE_KEY);
        updateCartCount();
        renderCartPage();
      })
      .catch(() => {
        if (status) status.textContent = 'El servidor no respondió. Iniciá el backend y volvé a intentar; tu carrito sigue guardado.';
      }).finally(() => {
        if (submitButton) submitButton.disabled = false;
      });
    return;
  }

  openMailFallback();
}

async function requestSmartSearch(query) {
  const endpoint = CONFIG.integrations?.smartSearchEndpoint;
  if (!endpoint || !query.trim()) return null;
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, products: products.map(({ id, name, category, price, tags, features }) => ({ id, name, category, price, tags, features })) }) });
  if (!response.ok) throw new Error('smart-search-failed');
  return response.json();
}

async function requestRecommendations(query) {
  const endpoint = CONFIG.integrations?.recommendationEndpoint;
  if (!endpoint || !query.trim()) return [];
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, products: products.map(({ id, name, category, price, tags, features }) => ({ id, name, category, price, tags, features })) }) });
  if (!response.ok) throw new Error('recommendation-failed');
  const result = await response.json();
  return products.filter((product) => result.productIds?.includes(product.id));
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function setupHeaderSearch() {
  document.querySelectorAll('.site-header .search-box input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      const query = input.value.trim();
      if (query) window.location.href = `catalogo.html?q=${encodeURIComponent(query)}`;
    });
  });

  const query = new URLSearchParams(window.location.search).get('q');
  const catalogInput = document.getElementById('searchInputCatalog');
  if (query && catalogInput) {
    catalogInput.value = query;
    catalogInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function getLocalRecommendations(query) {
  const words = query.toLocaleLowerCase('es').split(/\s+/).filter((word) => word.length > 2);
  return products.map((product) => {
    const text = getSearchText(product);
    const score = words.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0);
    return { product, score };
  }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((entry) => entry.product);
}

function setupRecommendations() {
  const form = document.getElementById('recommendationForm');
  const input = document.getElementById('recommendationQuery');
  const results = document.getElementById('recommendationResults');
  if (!form || !input || !results) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    results.innerHTML = '<p class="recommendation-loading">Analizando tu necesidad dentro del catálogo DJ TECH...</p>';
    try {
      const recommended = await requestRecommendations(query);
      const matches = recommended.length ? recommended : getLocalRecommendations(query);
      results.innerHTML = matches.length
        ? `<p>Encontramos opciones que pueden servirte:</p><div class="recommendation-list">${matches.map((product) => `<a href="producto.html?id=${product.id}"><strong>${product.name}</strong><span>${formatPrice(product.price)}</span></a>`).join('')}</div>`
        : '<p>No encontramos una coincidencia exacta. Probá con otra necesidad o explorá el catálogo completo.</p>';
    } catch {
      const matches = getLocalRecommendations(query);
      results.innerHTML = matches.length
        ? `<p>Estas opciones coinciden con tu búsqueda:</p><div class="recommendation-list">${matches.map((product) => `<a href="producto.html?id=${product.id}"><strong>${product.name}</strong><span>${formatPrice(product.price)}</span></a>`).join('')}</div>`
        : '<p>No encontramos una coincidencia exacta. Probá con otra necesidad o explorá el catálogo completo.</p>';
    }
  });
}

function setupWhatsAppLinks() {
  document.querySelectorAll('[data-whatsapp-message]').forEach((link) => {
    const url = buildWhatsAppUrl(link.dataset.whatsappMessage);
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noreferrer';
    } else {
      link.href = '#';
      link.classList.add('disabled-button');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        alert('El contacto por WhatsApp estará disponible cuando se configure el número comercial en site-config.js.');
      });
    }
  });
}

function setupContactForm() {
  document.querySelectorAll('[data-contact-submit]').forEach((submitButton) => submitButton.addEventListener('click', () => {
    const form = submitButton.closest('form');
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }
    const values = [...form.querySelectorAll('input, textarea, select')].map((field) => `${field.name}: ${field.value}`).join('. ');
    const message = `Hola DJ TECH, quiero hacer una consulta. ${values}`;
    const url = buildWhatsAppUrl(message);
    if (url) window.open(url, '_blank', 'noopener');
    else alert('La consulta está lista, pero falta configurar el número comercial en site-config.js.');
  }));
}

function bindGlobalEvents() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;
    const action = trigger.dataset.action;
    const productId = Number(trigger.dataset.id);
    if (action === 'add') addToCart(productId);
    if (action === 'detail') window.location.href = `producto.html?id=${productId}`;
    if (action === 'increase') changeQuantity(productId, 1);
    if (action === 'decrease') changeQuantity(productId, -1);
    if (action === 'remove') removeFromCart(productId);
  });

  const cartPanel = document.getElementById('cartPanel');
  document.getElementById('cartToggle')?.addEventListener('click', () => cartPanel?.classList.toggle('open'));
  document.getElementById('closeCart')?.addEventListener('click', () => cartPanel?.classList.remove('open'));
  document.getElementById('orderForm')?.addEventListener('submit', handleOrderSubmit);
}

function initPage() {
  updateCartCount();
  bindGlobalEvents();
  setupHeaderSearch();
  setupRecommendations();
  setupWhatsAppLinks();
  setupContactForm();
  const page = document.body.dataset.page;
  document.querySelector(`.nav a[data-page="${page}"]`)?.classList.add('active');
  if (page === 'inicio') { renderFeaturedProducts(); renderWeeklyOffers(); renderCategoriesPage(); }
  if (page === 'categorias') renderCategoriesPage();
  if (page === 'catalogo') renderCatalogPage();
  if (page === 'producto') renderProductDetailPage();
  if (page === 'carrito') renderCartPage();
  renderCartPanel();
}

document.addEventListener('DOMContentLoaded', initPage);
