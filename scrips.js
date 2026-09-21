const products = [
  {
    id: 1,
    name: "Nova X12 Pro",
    category: "celulares",
    price: 289900,
    tag: "Top venta",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    description: "Smartphone premium con cámara triple, pantalla AMOLED y rendimiento ultrarrápido para trabajo y entretenimiento.",
    specs: {
      Pantalla: "6.7' AMOLED 120Hz",
      Procesador: "Snapdragon 8 Gen 2",
      Memoria: "12GB + 512GB",
      Cámara: "50MP + 12MP + 8MP"
    }
  },
  {
    id: 2,
    name: "Pulse Air",
    category: "auriculares",
    price: 76900,
    tag: "Novedad",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description: "Auriculares inalámbricos con cancelación activa, sonido envolvente y batería de larga duración.",
    specs: {
      Conexión: "Bluetooth 5.3",
      Batería: "Hasta 38 horas",
      Micrófono: "Dual beamforming",
      Peso: "220g"
    }
  },
  {
    id: 3,
    name: "ChargeCore 65W",
    category: "cargadores",
    price: 34900,
    tag: "Oferta",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
    description: "Cargador USB-C de alta potencia con carga rápida para smartphone, tablet y notebooks compactas.",
    specs: {
      Salida: "65W GaN",
      Puertos: "2x USB-C/USB-A",
      Compatibilidad: "iPhone, Android, Mac",
      Seguridad: "Protección inteligente"
    }
  },
  {
    id: 4,
    name: "PowerCube 20000",
    category: "powerbanks",
    price: 89900,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1609091836563-6d8f0f5d4f0d?auto=format&fit=crop&w=900&q=80",
    description: "Power bank compacto y potente para viajes, trabajo remoto o días largos sin conexión.",
    specs: {
      Capacidad: "20000mAh",
      Entrada: "USB-C PD 18W",
      Salida: "22.5W",
      Peso: "430g"
    }
  },
  {
    id: 5,
    name: "FlashDrive Pro 1TB",
    category: "almacenamiento",
    price: 54900,
    tag: "Ultra rápido",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80",
    description: "Pendrive USB 3.2 de alta velocidad para transferencias rápidas, backups y trabajo profesional.",
    specs: {
      Capacidad: "1TB",
      Velocidad: "Hasta 500MB/s",
      Conexión: "USB-C / USB-A",
      Sistema: "Windows, Mac, Android"
    }
  },
  {
    id: 6,
    name: "DockStation Mini",
    category: "accesorios-pc",
    price: 67900,
    tag: "Essential",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80",
    description: "Dock para notebook con varios puertos, ideal para estaciones de trabajo compactas y escritorio moderno.",
    specs: {
      Puertos: "HDMI, USB-C, USB-A, Ethernet",
      Resolución: "4K@60Hz",
      Compatibilidad: "Windows, Mac, ChromeOS",
      Alimentación: "PD 100W"
    }
  },
  {
    id: 7,
    name: "KeyFlex Pro",
    category: "teclados-mouse",
    price: 41900,
    tag: "Ergonómico",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
    description: "Teclado mecánico slim con diseño ergonómico, retroiluminación y respuesta precisa.",
    specs: {
      Tipo: "Mecánico",
      Layout: "Full size",
      Retroiluminación: "RGB",
      Switches: "Blue / Brown"
    }
  },
  {
    id: 8,
    name: "Orbit Mouse",
    category: "teclados-mouse",
    price: 21900,
    tag: "Precisión",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
    description: "Mouse inalámbrico con sensor de alto rendimiento y diseño ergonómico para largas jornadas.",
    specs: {
      Sensor: "16000 DPI",
      Conexión: "Bluetooth + USB",
      Botones: "6 programables",
      Duración: "Hasta 1 mes"
    }
  },
  {
    id: 9,
    name: "EcoRide X9",
    category: "movilidad",
    price: 329900,
    tag: "Mas vendido",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80",
    description: "Patinete eléctrico con autonomía de larga distancia, freno regenerativo y diseño urbano premium.",
    specs: {
      Autonomía: "Up to 45 km",
      Velocidad: "Hasta 30 km/h",
      Peso: "14.5 kg",
      Carga: "4 horas"
    }
  },
  {
    id: 10,
    name: "VoltGo Mini",
    category: "movilidad",
    price: 279900,
    tag: "Nuevo",
    image: "https://images.unsplash.com/photo-1571068316344-75bc6c5d8f3b?auto=format&fit=crop&w=900&q=80",
    description: "Scooter compacto ideal para desplazamientos cortos, ciudad y accesos rápidos para estudiar o trabajar.",
    specs: {
      Autonomía: "Hasta 35 km",
      Motor: "500W",
      Peso: "12.8 kg",
      Suspensión: "Delantera"
    }
  },
  {
    id: 11,
    name: "AudioBar 3D",
    category: "otros",
    price: 129900,
    tag: "Home",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description: "Barra de sonido compacta con audio surround y conexión Bluetooth para el hogar y la oficina.",
    specs: {
      Potencia: "120W",
      Conexión: "Bluetooth 5.0",
      Audio: "Surround 3D",
      Compatibilidad: "TV, PC, móvil"
    }
  },
  {
    id: 12,
    name: "SyncPad Pro",
    category: "otros",
    price: 98900,
    tag: "Studio",
    image: "https://images.unsplash.com/photo-1541534401786-2077eed87a74?auto=format&fit=crop&w=900&q=80",
    description: "Tableta digital para trabajo creativo, reuniones y lectura con pantalla táctil de alta definición.",
    specs: {
      Pantalla: "11' IPS",
      Procesador: "Octa-core",
      Memoria: "8GB / 128GB",
      Batería: "Hasta 12h"
    }
  }
];

const state = {
  category: "all",
  query: ""
};

const catalogGrid = document.getElementById("catalogGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = [...document.querySelectorAll(".category-card")];
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const cartCountBadge = document.getElementById("cartCountBadge");
const checkoutBtn = document.getElementById("checkoutBtn");
const productModal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const modalCloseButtons = document.querySelectorAll(".modal-close, [data-close='modal']");

const cart = [];

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

function getFilteredProducts() {
  return products.filter((product) => {
    const matchesCategory = state.category === "all" || product.category === state.category;
    const matchesQuery = product.name.toLowerCase().includes(state.query.toLowerCase());
    return matchesCategory && matchesQuery;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();

  if (!filtered.length) {
    catalogGrid.innerHTML = `
      <div class="empty-state">
        <h3>No encontramos resultados</h3>
        <p>Probá con otra búsqueda o elegí otra categoría.</p>
      </div>
    `;
    return;
  }

  catalogGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image-wrap">
            <span class="tag">${product.tag}</span>
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>⭐ 4.8</span>
            </div>
            <h3>${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-price-row">
              <span class="product-price">${formatPrice(product.price)}</span>
            </div>
            <div class="product-actions">
              <button class="small-button" type="button" data-action="detail" data-id="${product.id}">Ver detalle</button>
              <button class="small-button primary" type="button" data-action="add" data-id="${product.id}">Agregar</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  renderCart();
}

function updateCartItem(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    const itemIndex = cart.findIndex((entry) => entry.id === productId);
    cart.splice(itemIndex, 1);
  }

  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <h3>Tu carrito está vacío</h3>
        <p>Agregá algunos productos para verlos aquí.</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart
      .map((entry) => {
        const product = products.find((item) => item.id === entry.id);
        if (!product) return "";

        return `
          <div class="cart-item">
            <img src="${product.image}" alt="${product.name}" />
            <div>
              <h4>${product.name}</h4>
              <p>${formatPrice(product.price)}</p>
              <div class="qty-controls">
                <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Restar cantidad">-</button>
                <span>${entry.quantity}</span>
                <button type="button" data-action="increase" data-id="${product.id}" aria-label="Sumar cantidad">+</button>
              </div>
            </div>
            <div class="cart-item-price">${formatPrice(product.price * entry.quantity)}</div>
          </div>
        `;
      })
      .join("");
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((productData) => productData.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCountBadge.textContent = totalItems;
  cartSubtotal.textContent = formatPrice(subtotal);
  cartTotal.textContent = formatPrice(subtotal);
}

function openProductModal(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  modalContent.innerHTML = `
    <div class="product-modal">
      <div class="product-modal-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-modal-content">
        <span class="eyebrow">${product.tag}</span>
        <h3 id="modalTitle">${product.name}</h3>
        <div class="modal-price">${formatPrice(product.price)}</div>
        <p class="modal-description">${product.description}</p>
        <ul class="modal-specs">
          ${Object.entries(product.specs)
            .map(([key, value]) => `<li><span>${key}</span><strong>${value}</strong></li>`)
            .join("")}
        </ul>
        <div class="modal-actions">
          <button class="button primary" type="button" data-action="add-modal" data-id="${product.id}">Agregar al carrito</button>
          <button class="button secondary" type="button" disabled>WhatsApp próximamente</button>
        </div>
      </div>
    </div>
  `;

  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderProducts();
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;

    categoryButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderProducts();
  });
});

catalogGrid.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  const action = target.dataset.action;
  const productId = Number(target.dataset.id);

  if (!productId) return;

  if (action === "detail") {
    openProductModal(productId);
  }

  if (action === "add") {
    addToCart(productId);
    cartPanel.classList.add("open");
  }
});

cartItems.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  const action = target.dataset.action;
  const productId = Number(target.dataset.id);

  if (action === "increase") updateCartItem(productId, 1);
  if (action === "decrease") updateCartItem(productId, -1);
});

cartToggle.addEventListener("click", () => {
  cartPanel.classList.toggle("open");
});

closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) {
    alert("Tu carrito está vacío. Elegí algún producto para continuar.");
    return;
  }

  const total = cart.reduce((sum, item) => {
    const product = products.find((productData) => productData.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  alert(`Pedido simulado por ${formatPrice(total)}. Gracias por elegir Volt & Tech.`);
  cart.length = 0;
  renderCart();
});

productModal.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action='add-modal']");
  if (target) {
    addToCart(Number(target.dataset.id));
    cartPanel.classList.add("open");
    closeProductModal();
  }
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeProductModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && productModal.classList.contains("open")) {
    closeProductModal();
  }
});

renderProducts();
renderCart();
