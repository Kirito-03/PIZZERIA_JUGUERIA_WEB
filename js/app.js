/**
 * Sol & Brasa - Controlador Principal de la Aplicación Web Dual
 * Maneja cambio de turno Día/Noche, búsqueda inteligente, filtros, personalización de jugos y pizzas,
 * carrito interactivo, vista previa de mensaje WhatsApp y seguimiento en vivo del pedido.
 */
(function () {
  const CFG = window.SOL_BRASA_CONFIG;
  const PRODUCTOS = window.SOL_BRASA_PRODUCTOS;
  const COMBOS = window.SOL_BRASA_COMBOS;
  const PERS = window.SOL_BRASA_PERSONALIZACION;
  const Carrito = window.SolBrasaCarrito;
  const Horarios = window.SolBrasaHorarios;
  const DNI = window.SolBrasaDNI;
  const WA = window.SolBrasaWhatsApp;

  const FALLBACK_IMG_DIA =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23FFF3E6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='48'%3E%F0%9F%A5%A4%3C/text%3E%3C/svg%3E";
  const FALLBACK_IMG_NOCHE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%231E2230' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='48'%3E%F0%9F%8D%95%3C/text%3E%3C/svg%3E";

  const estado = {
    modoActivo: "Día",
    modoManual: false,
    turnoReal: "Día",
    categoriaActiva: "todos",
    ordenActivo: "destacados",
    busqueda: "",
    modalidadCheckout: "delivery",
    pagoSeleccionado: "Yape / Plin",
    dniVerificado: false,
    gpsActual: null,
    seleccionCard: {}, // { [prodId]: { presIdx: 0, qty: 1 } }
    productoModal: null,
    qtyModal: 1,
    mostrarPreviewWA: false
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatoPrecio(valor) {
    return `${CFG.moneda} ${Number(valor).toFixed(2)}`;
  }

  function fallbackPorTurno(turno) {
    return turno === "Noche" ? FALLBACK_IMG_NOCHE : FALLBACK_IMG_DIA;
  }

  // ==================== RELOJ PERÚ Y TURNO DUAL ====================
  function actualizarReloj() {
    const { horaDecimal, horaFormateada } = Horarios.obtenerHoraPeru();
    const infoTurno = Horarios.evaluarTurno(horaDecimal);
    estado.turnoReal = infoTurno.turno;

    const clockEl = $("peruClock");
    if (clockEl) clockEl.textContent = horaFormateada;

    const statusBadge = $("topShiftStatus");
    if (statusBadge) {
      statusBadge.textContent = infoTurno.etiquetaEstado;
      statusBadge.className = `status-pill ${infoTurno.abierto ? "is-open" : "is-closed"}`;
    }

    const nextInfo = $("topNextShift");
    if (nextInfo) nextInfo.textContent = infoTurno.siguienteTurno;

    // Solo cambia tema automáticamente si el usuario no eligió manualmente y cambió el turno real
    if (!estado.modoManual && estado.modoActivo !== infoTurno.turno) {
      aplicarModo(infoTurno.turno, false);
    }
  }

  function aplicarModo(modo, esManual = true) {
    estado.modoActivo = modo;
    if (esManual) estado.modoManual = true;
    estado.categoriaActiva = "todos";

    const themeAttr = modo === "Noche" ? "noche" : "dia";
    document.documentElement.setAttribute("data-theme", themeAttr);

    // Actualizar botones toggle (top bar, shift cards y segmented control)
    document.querySelectorAll("[data-mode-btn]").forEach((btn) => {
      const target = btn.getAttribute("data-mode-btn");
      btn.classList.toggle("is-active", target === modo);
      btn.setAttribute("aria-pressed", target === modo ? "true" : "false");
    });

    actualizarHero(modo);
    actualizarBannerTurnos(modo);
    actualizarLinksWhatsAppGenerales(modo);
    renderizarCategorias();
    renderizarProductos();
    renderizarCombos();
    actualizarSeccionFilosofia(modo);
  }

  function actualizarHero(modo) {
    const prodHero = modo === "Noche"
      ? PRODUCTOS.find((p) => p.id === "pizza-1")
      : PRODUCTOS.find((p) => p.id === "jugo-1");

    if (modo === "Noche") {
      $("heroEyebrow").innerHTML = `<span class="material-symbols-outlined">local_fire_department</span> Horno de Leña a 450°C · Masa Madre 48h`;
      $("heroTitle").innerHTML = `Pizza a la leña, <span class="text-accent">hecha para compartir</span>`;
      $("heroDesc").textContent =
        "Masa artesanal, ingredientes frescos y mucho sabor.";
      $("heroStat1Value").textContent = "450°C";
      $("heroStat1Label").textContent = "Horno a la Leña";
      $("heroStat2Value").textContent = "48 hrs";
      $("heroStat2Label").textContent = "Fermentación Lenta";
      $("heroStat3Value").textContent = "★ 4.95";
      $("heroStat3Label").textContent = "+1,400 Reseñas";
      $("heroCtaMenu").innerHTML = `Ver pizzas <span class="material-symbols-outlined">arrow_forward</span>`;
      $("catalogEyebrow").textContent = "CARTA NOCTURNA · PIZZERÍA A LA LEÑA";
      $("catalogTitle").textContent = "Nuestras Pizzas al Quebracho";
      $("catalogSubtitle").textContent = "Elige tu favorita y personalízala a tu gusto.";
      $("searchInput").placeholder = "Buscar pizza, pepperoni, cuatro quesos, calzone o jugo...";
      $("heroCardBadge").textContent = "🔥 LA MÁS PEDIDA";
    } else {
      $("heroEyebrow").innerHTML = `<span class="material-symbols-outlined">wb_sunny</span> 100% Fruta Peruana Fresca · Sin Conservantes`;
      $("heroTitle").innerHTML = `Jugos frescos <span class="text-accent">para alegrar tu día</span>`;
      $("heroDesc").textContent =
        "Fruta, sabor y energía, preparados al momento.";
      $("heroStat1Value").textContent = "100%";
      $("heroStat1Label").textContent = "Fruta Natural";
      $("heroStat2Value").textContent = "20-30 min";
      $("heroStat2Label").textContent = "Delivery Rápido";
      $("heroStat3Value").textContent = "★ 4.9";
      $("heroStat3Label").textContent = "+1,200 Clientes";
      $("heroCtaMenu").innerHTML = `Ver jugos <span class="material-symbols-outlined">arrow_forward</span>`;
      $("catalogEyebrow").textContent = "CARTA MATUTINA · JUGUERÍA NATURAL";
      $("catalogTitle").textContent = "Nuestros Jugos & Especialidades";
      $("catalogSubtitle").textContent = "Elige tu favorito y prepáralo a tu gusto.";
      $("searchInput").placeholder = "Buscar jugo, mango, fresa, detox, triple o pizza...";
      $("heroCardBadge").textContent = "☀️ RECOMENDADO DEL DÍA";
    }

    if (prodHero) {
      $("heroCardImg").src = prodHero.imagen;
      $("heroCardImg").alt = prodHero.nombre;
      $("heroCardImg").onerror = function () {
        this.src = fallbackPorTurno(prodHero.turno);
      };
      $("heroCardRating").textContent = `${prodHero.rating} (${prodHero.resenas})`;
      $("heroCardTitle").textContent = prodHero.nombre;
      $("heroCardDesc").textContent = prodHero.descripcionCorta || prodHero.descripcion;
      $("heroCardPrice").textContent = formatoPrecio(prodHero.precio);
      $("heroCardTag").textContent = prodHero.etiqueta;
      $("heroCardAddBtn").setAttribute("data-hero-prod-id", prodHero.id);
      $("heroCardCustomizeBtn").setAttribute("data-hero-prod-id", prodHero.id);
    }
  }

  function actualizarBannerTurnos(modo) {
    const cardDia = $("shiftCardDia");
    const cardNoche = $("shiftCardNoche");
    const badgeDia = $("shiftBadgeDia");
    const badgeNoche = $("shiftBadgeNoche");

    if (cardDia && cardNoche) {
      cardDia.classList.toggle("is-selected", modo === "Día");
      cardNoche.classList.toggle("is-selected", modo === "Noche");
    }
    if (badgeDia && badgeNoche) {
      badgeDia.textContent = modo === "Día" ? "VIENDO AHORA" : "VER JUGOS";
      badgeNoche.textContent = modo === "Noche" ? "VIENDO AHORA" : "VER PIZZAS";
    }
  }

  function actualizarSeccionFilosofia(modo) {
    if (modo === "Noche") {
      $("storyEyebrow").textContent = "EL SECRETO DE NUESTRO SABOR";
      $("storyTitle").textContent = "Fermentación Lenta de 48h y Leña de Quebracho";
      $("storyText").textContent =
        "Preparamos nuestra masa con tiempo y la horneamos a la leña para compartirla contigo.";
      $("storyImg").src = "img/banners/horno-lena.jpg";
      $("storyBadgeNumber").textContent = "48h";
      $("storyBadgeText").textContent = "Masa Madre Viva & Horno de Piedra";
    } else {
      $("storyEyebrow").textContent = "TRADICIÓN & FRESCURA DUAL";
      $("storyTitle").textContent = "De día te nutre el sol, de noche te abraza la brasa";
      $("storyText").textContent =
        "En Puerto Inca, compartimos jugos frescos de día y pizzas a la leña de noche.";
      $("storyImg").src = "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=900&q=80";
      $("storyBadgeNumber").textContent = "100%";
      $("storyBadgeText").textContent = "Fruta seleccionada cada madrugada";
    }
  }

  function actualizarLinksWhatsAppGenerales(modo) {
    const url = WA.construirMensajeConsultaGeneral(modo);
    document.querySelectorAll("[data-wa-direct]").forEach((a) => {
      a.href = url;
    });
  }

  // ==================== CATEGORÍAS Y CATÁLOGO ====================
  function renderizarCategorias() {
    const container = $("categoryFilters");
    if (!container) return;

    const prodsTurno = PRODUCTOS.filter((p) => p.turno === estado.modoActivo);
    const cats = ["todos", ...Array.from(new Set(prodsTurno.map((p) => p.categoria)))];

    container.innerHTML = cats
      .map((cat) => {
        const activa = estado.categoriaActiva === cat ? "is-active" : "";
        const icono = cat === "todos"
          ? (estado.modoActivo === "Noche" ? "local_pizza" : "local_drink")
          : "restaurant_menu";
        const texto = cat === "todos"
          ? (estado.modoActivo === "Noche" ? "Todas las Pizzas" : "Todos los Jugos")
          : cat;

        return `
          <button type="button" class="category-pill ${activa}" data-cat="${escapeHtml(cat)}">
            <span class="material-symbols-outlined">${icono}</span>
            <span>${escapeHtml(texto)}</span>
          </button>
        `;
      })
      .join("");
  }

  function obtenerSeleccionCard(prod) {
    if (!estado.seleccionCard[prod.id]) {
      estado.seleccionCard[prod.id] = { presIdx: 0, qty: 1 };
    }
    return estado.seleccionCard[prod.id];
  }

  function renderizarProductos() {
    const grid = $("productsGrid");
    const crossHint = $("crossModeSearchHint");
    if (!grid) return;

    const q = estado.busqueda.toLowerCase().trim();
    const modoOpuesto = estado.modoActivo === "Noche" ? "Día" : "Noche";

    let filtrados = PRODUCTOS.filter((p) => {
      const okTurno = p.turno === estado.modoActivo;
      const okCat = estado.categoriaActiva === "todos" || p.categoria === estado.categoriaActiva;
      const okBusq = !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q);
      return okTurno && okCat && okBusq;
    });

    // Buscar también coincidencias en el modo opuesto si hay texto de búsqueda
    const coincidenciasOpuesto = q
      ? PRODUCTOS.filter(
          (p) =>
            p.turno === modoOpuesto &&
            (p.nombre.toLowerCase().includes(q) ||
              p.descripcion.toLowerCase().includes(q) ||
              p.categoria.toLowerCase().includes(q))
        )
      : [];

    if (crossHint) {
      if (coincidenciasOpuesto.length > 0) {
        const nombreModoOpuesto = modoOpuesto === "Noche" ? "Pizzería (Modo Noche)" : "Juguería (Modo Día)";
        crossHint.hidden = false;
        crossHint.innerHTML = `
          <div class="cross-hint-inner">
            <span>Encontramos <strong>${coincidenciasOpuesto.length}</strong> resultado(s) para "<em>${escapeHtml(estado.busqueda)}</em>" en <strong>${nombreModoOpuesto}</strong>.</span>
            <button type="button" class="btn-chip-switch" id="btnSwitchFromSearch">Ver en ${nombreModoOpuesto} →</button>
          </div>
        `;
        const btnSwitch = $("btnSwitchFromSearch");
        if (btnSwitch) {
          btnSwitch.addEventListener("click", () => {
            aplicarModo(modoOpuesto, true);
          });
        }
      } else {
        crossHint.hidden = true;
      }
    }

    // Ordenamiento
    if (estado.ordenActivo === "precio-asc") {
      filtrados.sort((a, b) => a.precio - b.precio);
    } else if (estado.ordenActivo === "precio-desc") {
      filtrados.sort((a, b) => b.precio - a.precio);
    } else if (estado.ordenActivo === "rating") {
      filtrados.sort((a, b) => b.rating - a.rating);
    } else {
      filtrados.sort((a, b) => Number(b.destacado) - Number(a.destacado));
    }

    if (filtrados.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <span class="material-symbols-outlined empty-icon">search_off</span>
          <h3>No encontramos productos con "${escapeHtml(estado.busqueda)}"</h3>
          <p>Prueba limpiando el filtro o cambia entre Juguería (Modo Día) y Pizzería (Modo Noche).</p>
          <button type="button" class="btn-secondary" id="btnResetFilters">Ver toda la carta</button>
        </div>
      `;
      const btnReset = $("btnResetFilters");
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          estado.busqueda = "";
          estado.categoriaActiva = "todos";
          $("searchInput").value = "";
          renderizarCategorias();
          renderizarProductos();
        });
      }
      return;
    }

    grid.innerHTML = filtrados
      .map((prod) => {
        const sel = obtenerSeleccionCard(prod);
        const presActual = prod.presentaciones[sel.presIdx] || prod.presentaciones[0];
        const precioFinal = prod.precio + (presActual ? presActual.extra : 0);

        const presButtons = prod.presentaciones
          .map((pres, idx) => {
            const labelExtra = pres.extra > 0 ? ` +${CFG.moneda}${pres.extra}` : "";
            const corto = pres.nombre.split("(")[0].trim();
            return `
              <button type="button"
                class="size-chip ${idx === sel.presIdx ? "is-selected" : ""}"
                data-action="select-size"
                data-prod-id="${prod.id}"
                data-pres-idx="${idx}">
                ${escapeHtml(corto)}${labelExtra}
              </button>
            `;
          })
          .join("");

        return `
          <article class="product-card" data-prod-card="${prod.id}">
            <div class="product-media" data-action="open-customize" data-prod-id="${prod.id}" role="button" tabindex="0" aria-label="Personalizar ${escapeHtml(prod.nombre)}">
              <img src="${prod.imagen}" alt="${escapeHtml(prod.nombre)}" loading="lazy"
                   onerror="this.onerror=null;this.src='${fallbackPorTurno(prod.turno)}'">
              <span class="badge-rating">★ ${prod.rating} <small>(${prod.resenas})</small></span>
              ${prod.etiqueta ? `<span class="badge-feature">${escapeHtml(prod.etiqueta)}</span>` : ""}
              <span class="media-customize-hint">
                <span class="material-symbols-outlined">tune</span> Personalizar
              </span>
            </div>

            <div class="product-body">
              <div class="product-meta-row">
                <span class="product-cat">${escapeHtml(prod.categoria)}</span>
                <span class="product-meta-chip">${escapeHtml(prod.tiempo)} · ${escapeHtml(prod.calorias)}</span>
              </div>

              <div class="product-title-row">
                <h3 class="product-title">${escapeHtml(prod.nombre)}</h3>
                <span class="product-price" id="price-${prod.id}">${formatoPrecio(precioFinal)}</span>
              </div>

              <p class="product-desc">${escapeHtml(prod.descripcionCorta || prod.descripcion)}</p>

              <button type="button" class="btn-sm-outline product-customize" data-action="open-customize" data-prod-id="${prod.id}">Personalizar</button>

              <div class="product-sizes" aria-label="Tamaño o presentación">
                ${presButtons}
              </div>

              <div class="product-actions">
                <div class="qty-stepper" aria-label="Cantidad">
                  <button type="button" data-action="card-qty" data-prod-id="${prod.id}" data-delta="-1" aria-label="Disminuir cantidad">−</button>
                  <span id="qty-val-${prod.id}">${sel.qty}</span>
                  <button type="button" data-action="card-qty" data-prod-id="${prod.id}" data-delta="1" aria-label="Aumentar cantidad">+</button>
                </div>

                <button type="button" class="btn-add-card" data-action="quick-add" data-prod-id="${prod.id}">
                  <span class="material-symbols-outlined">add_shopping_cart</span>
                  <span>Agregar</span>
                </button>

                <button type="button" class="btn-wa-icon" data-action="quick-wa" data-prod-id="${prod.id}" title="Pedir directo por WhatsApp" aria-label="Pedir ${escapeHtml(prod.nombre)} por WhatsApp">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.031 2C6.506 2 2.01 6.494 2.01 12.02c0 1.765.462 3.487 1.34 5.004L2 22l5.107-1.339a9.963 9.963 0 0 0 4.924 1.298h.004c5.524 0 10.02-4.496 10.02-10.022 0-2.677-1.042-5.193-2.936-7.086A9.948 9.948 0 0 0 12.03 2zm5.826 14.236c-.247.694-1.434 1.326-1.978 1.408-.506.077-1.15.109-1.854-.116-.427-.136-.975-.318-1.675-.62-2.948-1.273-4.873-4.244-5.02-4.44-.148-.196-1.198-1.594-1.198-3.04 0-1.446.757-2.157 1.026-2.452.27-.295.588-.368.784-.368.196 0 .392.002.563.01.181.009.423-.069.662.504.247.59.835 2.036.908 2.184.074.147.123.319.025.515-.098.196-.147.319-.294.491-.148.172-.31.384-.442.515-.148.148-.301.309-.13.604.172.295.764 1.26 1.64 2.042 1.126 1.004 2.076 1.316 2.371 1.464.294.147.466.122.638-.074.171-.196.736-.859.932-1.153.196-.295.392-.246.662-.147.27.098 1.717.81 2.011.957.295.147.491.221.564.343.074.123.074.712-.173 1.406z"/></svg>
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderizarCombos() {
    const grid = $("combosGrid");
    if (!grid) return;

    // Mostrar primero los combos del turno activo, pero permitir ver los 4 combos duales
    const ordenados = [...COMBOS].sort((a, b) => {
      if (a.turno === estado.modoActivo && b.turno !== estado.modoActivo) return -1;
      if (a.turno !== estado.modoActivo && b.turno === estado.modoActivo) return 1;
      return 0;
    });

    grid.innerHTML = ordenados
      .map((combo) => {
        const esDia = combo.turno === "Día";
        return `
          <article class="combo-card ${combo.turno === estado.modoActivo ? "is-featured-shift" : ""}">
            <div class="combo-media">
              <img src="${combo.imagen}" alt="${escapeHtml(combo.nombre)}" loading="lazy"
                   onerror="this.onerror=null;this.src='${fallbackPorTurno(combo.turno)}'">
              <span class="combo-badge-save">${escapeHtml(combo.ahorro)}</span>
              <span class="combo-badge-shift ${esDia ? "is-dia" : "is-noche"}">
                ${esDia ? "☀️ DÍA" : "🔥 NOCHE"}
              </span>
            </div>
            <div class="combo-body">
              <span class="combo-rinde">${escapeHtml(combo.rinde)}</span>
              <h3>${escapeHtml(combo.nombre)}</h3>
              <p>${escapeHtml(combo.descripcion)}</p>
              <div class="combo-footer">
                <div class="combo-prices">
                  <span class="price-old">${formatoPrecio(combo.precioAnterior)}</span>
                  <span class="price-new">${formatoPrecio(combo.precio)}</span>
                </div>
                <button type="button" class="btn-add-combo" data-combo-id="${combo.id}">
                  <span class="material-symbols-outlined">add_shopping_cart</span>
                  Agregar Combo
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // ==================== MODAL DE PERSONALIZACIÓN DE PRODUCTO ====================
  function abrirModalPersonalizacion(prodId) {
    const prod = PRODUCTOS.find((p) => p.id === prodId);
    if (!prod) return;

    estado.productoModal = prod;
    const selCard = obtenerSeleccionCard(prod);
    estado.qtyModal = selCard.qty || 1;

    const persCfg = PERS[prod.tipo] || PERS.jugo;

    $("modalProdImg").src = prod.imagen;
    $("modalProdImg").alt = prod.nombre;
    $("modalProdImg").onerror = function () {
      this.src = fallbackPorTurno(prod.turno);
    };
    $("modalProdShift").textContent = prod.turno === "Noche" ? "🔥 Turno Noche · Pizzería a la Leña" : "☀️ Turno Día · Juguería Natural";
    $("modalProdTitle").textContent = prod.nombre;
    $("modalProdDesc").textContent = prod.descripcion;
    $("modalProdRating").textContent = `★ ${prod.rating} (${prod.resenas} reseñas)`;
    $("modalProdNote").value = "";
    $("modalProdNote").placeholder = persCfg.placeholderNota || "Indicaciones especiales...";
    const noteLabel = $("modalProdNoteLabel");
    if (noteLabel) {
      noteLabel.textContent = prod.turno === "Noche"
        ? "Notas para el pizzaiolo / cocina (opcional)"
        : "Notas para el bar / juguería (opcional)";
    }
    $("modalQtyVal").textContent = estado.qtyModal;

    // 1. Tamaños
    $("modalSizesList").innerHTML = prod.presentaciones
      .map((pres, idx) => `
        <label class="option-row">
          <span class="option-left">
            <input type="radio" name="modalSize" value="${idx}" ${idx === selCard.presIdx ? "checked" : ""}>
            <span>${escapeHtml(pres.nombre)}</span>
          </span>
          <span class="option-price">${pres.extra > 0 ? `+ ${formatoPrecio(pres.extra)}` : "Incluido"}</span>
        </label>
      `)
      .join("");

    // 2. Grupo único 1 (Masa / Endulzante / Pan / Salsa)
    const g1Container = $("modalGroup1Container");
    if (persCfg.grupoUnico1) {
      g1Container.hidden = false;
      $("modalGroup1Title").textContent = persCfg.grupoUnico1.titulo;
      $("modalGroup1List").innerHTML = persCfg.grupoUnico1.opciones
        .map((op, idx) => `
          <label class="option-row">
            <span class="option-left">
              <input type="radio" name="modalGroup1" value="${op.id}" ${idx === 0 ? "checked" : ""}>
              <span>${escapeHtml(op.nombre)}</span>
            </span>
            <span class="option-price">${op.extra > 0 ? `+ ${formatoPrecio(op.extra)}` : "Gratis"}</span>
          </label>
        `)
        .join("");
    } else {
      g1Container.hidden = true;
    }

    // 3. Grupo único 2 (Opcional: Temperatura & Base para jugos)
    const g2Container = $("modalGroup2Container");
    if (persCfg.grupoUnico2) {
      g2Container.hidden = false;
      $("modalGroup2Title").textContent = persCfg.grupoUnico2.titulo;
      $("modalGroup2List").innerHTML = persCfg.grupoUnico2.opciones
        .map((op, idx) => `
          <label class="option-row">
            <span class="option-left">
              <input type="radio" name="modalGroup2" value="${op.id}" ${idx === 0 ? "checked" : ""}>
              <span>${escapeHtml(op.nombre)}</span>
            </span>
            <span class="option-price">${op.extra > 0 ? `+ ${formatoPrecio(op.extra)}` : "Gratis"}</span>
          </label>
        `)
        .join("");
    } else {
      g2Container.hidden = true;
    }

    // 4. Extras (checkboxes)
    const extrasContainer = $("modalExtrasContainer");
    if (persCfg.extras && persCfg.extras.opciones.length > 0) {
      extrasContainer.hidden = false;
      $("modalExtrasTitle").textContent = persCfg.extras.titulo;
      $("modalExtrasList").innerHTML = persCfg.extras.opciones
        .map((op) => `
          <label class="option-row">
            <span class="option-left">
              <input type="checkbox" name="modalExtras" value="${op.id}">
              <span>${escapeHtml(op.nombre)}</span>
            </span>
            <span class="option-price">${op.extra > 0 ? `+ ${formatoPrecio(op.extra)}` : "Gratis"}</span>
          </label>
        `)
        .join("");
    } else {
      extrasContainer.hidden = true;
    }

    recalcularModalProducto();
    abrirModal("productModal");
  }

  function construirItemDesdeModal() {
    const prod = estado.productoModal;
    if (!prod) return null;
    const persCfg = PERS[prod.tipo] || PERS.jugo;

    const sizeInput = document.querySelector('input[name="modalSize"]:checked');
    const sizeIdx = sizeInput ? parseInt(sizeInput.value, 10) : 0;
    const pres = prod.presentaciones[sizeIdx] || prod.presentaciones[0];

    let precioUnitario = prod.precio + (pres ? pres.extra : 0);
    const opcionesTexto = [];

    if (persCfg.grupoUnico1) {
      const g1Input = document.querySelector('input[name="modalGroup1"]:checked');
      const op1 = persCfg.grupoUnico1.opciones.find((o) => o.id === (g1Input && g1Input.value));
      if (op1) {
        precioUnitario += op1.extra;
        opcionesTexto.push(`${persCfg.grupoUnico1.titulo}: ${op1.nombre}`);
      }
    }

    if (persCfg.grupoUnico2) {
      const g2Input = document.querySelector('input[name="modalGroup2"]:checked');
      const op2 = persCfg.grupoUnico2.opciones.find((o) => o.id === (g2Input && g2Input.value));
      if (op2) {
        precioUnitario += op2.extra;
        opcionesTexto.push(`${persCfg.grupoUnico2.titulo}: ${op2.nombre}`);
      }
    }

    const extras = [];
    if (persCfg.extras) {
      document.querySelectorAll('input[name="modalExtras"]:checked').forEach((chk) => {
        const op = persCfg.extras.opciones.find((o) => o.id === chk.value);
        if (op) {
          precioUnitario += op.extra;
          extras.push(op);
        }
      });
    }

    return {
      id: prod.id,
      nombre: prod.nombre,
      imagen: prod.imagen,
      turno: prod.turno,
      tipo: prod.tipo,
      presentacion: pres ? pres.nombre : "",
      opcionesTexto,
      extras,
      notaItem: $("modalProdNote").value.trim(),
      precioUnitario,
      cantidad: estado.qtyModal
    };
  }

  function recalcularModalProducto() {
    const item = construirItemDesdeModal();
    if (!item) return;
    const total = item.precioUnitario * item.cantidad;
    $("modalAddBtnPrice").textContent = formatoPrecio(total);
  }

  // ==================== DNI, GPS, CARRITO, CHECKOUT Y WHATSAPP ====================
  function mostrarEstadoDni(texto, tipo = "info") {
    const el = $("dniStatusMsg");
    if (!el) return;
    if (!texto) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = texto;
    el.className = `field-status-msg is-${tipo}`;
  }

  function bloquearNombrePorDni(verificado, nombre = "") {
    estado.dniVerificado = verificado;
    const nameInput = $("custName");
    const unlockBtn = $("btnUnlockName");
    if (!nameInput) return;

    if (verificado) {
      nameInput.value = nombre;
      nameInput.readOnly = true;
      if (unlockBtn) unlockBtn.hidden = false;
    } else {
      nameInput.readOnly = false;
      if (unlockBtn) unlockBtn.hidden = true;
    }
  }

  async function validarYAutocompletarDni() {
    const dniInput = $("custDni");
    const btn = $("btnLookupDni");
    if (!dniInput || !DNI) return;

    const valorLimpio = dniInput.value.replace(/\D/g, "").slice(0, 8);
    dniInput.value = valorLimpio;

    const formato = DNI.validarFormatoDni(valorLimpio);
    if (!formato.valido) {
      bloquearNombrePorDni(false);
      mostrarEstadoDni(formato.error, "error");
      actualizarPreviewWhatsApp();
      return;
    }

    if (btn) btn.disabled = true;
    mostrarEstadoDni("Consultando DNI...", "info");

    const resp = await DNI.consultarDni(valorLimpio);
    if (btn) btn.disabled = false;

    if (resp.ok && resp.nombreCompleto) {
      bloquearNombrePorDni(true, resp.nombreCompleto);
      const etiquetaOrigen = resp.origen === "DEMO" ? "Modo Demo Local" : "RENIEC";
      mostrarEstadoDni(`✓ DNI verificado (${etiquetaOrigen}): ${resp.nombreCompleto}`, "success");
      mostrarToast("Nombre autocompletado con tu DNI.");
    } else if (resp.fallbackManual) {
      bloquearNombrePorDni(false);
      mostrarEstadoDni(resp.error, "info");
    } else {
      bloquearNombrePorDni(false);
      $("custName").value = "";
      mostrarEstadoDni(resp.error || "DNI no válido.", "error");
    }

    actualizarPreviewWhatsApp();
  }

  function actualizarUiGps() {
    const card = $("gpsResultCard");
    const link = $("gpsMapsLink");
    const addrLabel = $("custAddressLabel");
    const addrInput = $("custAddress");

    if (estado.gpsActual) {
      if (card) card.hidden = false;
      if (link) link.href = estado.gpsActual.mapsUrl;
      if (addrLabel) addrLabel.textContent = "Dirección (opcional, ya tienes pin GPS)";
      if (addrInput) addrInput.required = false;
    } else {
      if (card) card.hidden = true;
      if (addrLabel) addrLabel.textContent = "Dirección de Entrega *";
      if (addrInput) addrInput.required = estado.modalidadCheckout === "delivery";
    }
    actualizarPreviewWhatsApp();
  }

  function solicitarUbicacionGps() {
    const btn = $("btnGetGps");
    const btnText = $("btnGetGpsText");

    if (!("geolocation" in navigator)) {
      mostrarToast("Tu navegador no soporta ubicación GPS. Escribe tu dirección.", "warning");
      return;
    }

    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = "Ubicando...";

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

        estado.gpsActual = {
          lat,
          lng,
          mapsUrl,
          precision: Math.round(pos.coords.accuracy || 0)
        };

        // Intentar autocompletar calle aproximada con Nominatim (OpenStreetMap) sin bloquear el flujo
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { Accept: "application/json" } }
          );
          if (r.ok) {
            const geo = await r.json();
            const addr = geo.address || {};
            const calle = [addr.road, addr.house_number].filter(Boolean).join(" ");
            const addrInput = $("custAddress");
            if (calle && addrInput && !addrInput.value.trim()) {
              addrInput.value = calle;
            }
          }
        } catch {
          // Si no hay geocodificación inversa, igual ya tenemos el enlace exacto de Google Maps
        }

        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = "Actualizar GPS";
        actualizarUiGps();
        mostrarToast("¡Ubicación GPS adjuntada al pedido!");
      },
      (err) => {
        if (btn) btn.disabled = false;
        if (btnText) btnText.textContent = "Usar GPS";
        const msg = err.code === 1
          ? "Permiso de ubicación denegado. Actívalo o escribe tu dirección."
          : "No se pudo obtener tu GPS ahora. Intenta de nuevo o escribe tu dirección.";
        mostrarToast(msg, "warning");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function actualizarCalculoVuelto() {
    const calcEl = $("cashChangeCalc");
    if (!calcEl || estado.pagoSeleccionado !== "Efectivo contraentrega") return;

    const distrito = $("custDistrict") ? $("custDistrict").value : "Puerto Inca";
    const resumen = Carrito.calcularResumen(estado.modalidadCheckout, distrito);
    const monto = parseFloat($("custCashChange") ? $("custCashChange").value : "");

    if (isNaN(monto) || monto <= 0) {
      calcEl.hidden = true;
      return;
    }

    calcEl.hidden = false;
    if (monto < resumen.total) {
      calcEl.className = "field-status-msg is-error";
      calcEl.textContent = `El monto (${formatoPrecio(monto)}) es menor al total del pedido (${formatoPrecio(resumen.total)}).`;
    } else {
      const vuelto = monto - resumen.total;
      calcEl.className = "field-status-msg is-success";
      calcEl.textContent = vuelto === 0
        ? "✓ Pago exacto (no requiere vuelto)."
        : `✓ El repartidor llevará ${formatoPrecio(vuelto)} de vuelto.`;
    }
  }

  function obtenerDatosFormularioCheckout() {
    return {
      dni: ($("custDni") ? $("custDni").value : "").replace(/\D/g, ""),
      dniVerificado: estado.dniVerificado,
      nombre: ($("custName") ? $("custName").value : "").trim(),
      telefono: ($("custPhone") ? $("custPhone").value : "").trim(),
      comprobante: $("custReceipt") ? $("custReceipt").value : "Boleta con DNI",
      modalidad: estado.modalidadCheckout,
      distrito: $("custDistrict") ? $("custDistrict").value : "Puerto Inca",
      direccion: ($("custAddress") ? $("custAddress").value : "").trim(),
      referencia: ($("custReference") ? $("custReference").value : "").trim(),
      gps: estado.gpsActual,
      pago: estado.pagoSeleccionado,
      vueltoDe: ($("custCashChange") ? $("custCashChange").value : "").trim(),
      notas: ($("custNotes") ? $("custNotes").value : "").trim()
    };
  }

  function renderizarCarrito(snapshot) {
    const items = snapshot.items;
    const distrito = $("custDistrict") ? $("custDistrict").value : "Puerto Inca";
    const resumen = Carrito.calcularResumen(estado.modalidadCheckout, distrito);

    // Contadores navbar, barra flotante móvil y tab bar
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = resumen.cantidadTotal;
      el.hidden = resumen.cantidadTotal === 0;
    });

    const mobileBar = $("mobileFloatingCart");
    if (mobileBar) {
      mobileBar.hidden = resumen.cantidadTotal === 0;
      $("mobileFloatingCount").textContent = resumen.cantidadTotal;
      $("mobileFloatingTotal").textContent = formatoPrecio(resumen.subtotal);
    }

    const headerCount = $("cartDrawerCount");
    if (headerCount) {
      headerCount.textContent = `${resumen.cantidadTotal} ${resumen.cantidadTotal === 1 ? "ítem" : "ítems"}`;
    }

    const listEl = $("cartItemsList");
    const checkoutSection = $("cartCheckoutSection");
    const emptyEl = $("cartEmptyState");

    if (items.length === 0) {
      if (listEl) listEl.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      if (checkoutSection) checkoutSection.hidden = true;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (checkoutSection) checkoutSection.hidden = false;

    // Progreso de delivery gratis
    const bannerEl = $("freeDeliveryBanner");
    if (bannerEl) {
      if (estado.modalidadCheckout === "recojo") {
        bannerEl.innerHTML = `
          <div class="delivery-progress-text">
            <span class="material-symbols-outlined">storefront</span>
            <span><strong>Recojo en tienda sin costo</strong> · Listo en 15–25 min</span>
          </div>
        `;
      } else if (resumen.tieneDeliveryGratis) {
        bannerEl.innerHTML = `
          <div class="delivery-progress-text is-success">
            <span class="material-symbols-outlined">verified</span>
            <span><strong>¡Felicidades!</strong> Tienes <strong>Delivery Gratis</strong> en este pedido.</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:100%"></div></div>
        `;
      } else {
        bannerEl.innerHTML = `
          <div class="delivery-progress-text">
            <span class="material-symbols-outlined">two_wheeler</span>
            <span>Te faltan <strong>${formatoPrecio(resumen.faltaParaGratis)}</strong> para conseguir <strong>Delivery Gratis</strong></span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${resumen.progresoGratis}%"></div></div>
        `;
      }
    }

    // Lista de ítems
    listEl.innerHTML = items
      .map((item, idx) => {
        const sub = item.precioUnitario * item.cantidad;
        const detalles = [
          item.presentacion,
          ...(item.opcionesTexto || []),
          ...(item.extras && item.extras.length ? [`Extras: ${item.extras.map((e) => e.nombre).join(", ")}`] : []),
          item.notaItem ? `Nota: "${item.notaItem}"` : ""
        ].filter(Boolean);

        return `
          <div class="cart-item">
            <img src="${item.imagen}" alt="${escapeHtml(item.nombre)}" class="cart-item-img"
                 onerror="this.onerror=null;this.src='${fallbackPorTurno(item.turno)}'">
            <div class="cart-item-info">
              <div class="cart-item-top">
                <div>
                  <span class="cart-shift-tag ${item.turno === "Noche" ? "is-noche" : "is-dia"}">
                    ${item.turno === "Noche" ? "🔥 Pizzería" : "☀️ Juguería"}
                  </span>
                  <h4>${escapeHtml(item.nombre)}</h4>
                </div>
                <button type="button" class="btn-icon-delete" data-cart-delete="${idx}" aria-label="Eliminar ${escapeHtml(item.nombre)}">
                  <span class="material-symbols-outlined">delete_outline</span>
                </button>
              </div>
              ${detalles.length ? `<p class="cart-item-details">${detalles.map(escapeHtml).join(" · ")}</p>` : ""}
              <div class="cart-item-bottom">
                <span class="cart-item-price">${formatoPrecio(sub)}</span>
                <div class="qty-stepper is-compact">
                  <button type="button" data-cart-qty="${idx}" data-delta="-1" aria-label="Menos">−</button>
                  <span>${item.cantidad}</span>
                  <button type="button" data-cart-qty="${idx}" data-delta="1" aria-label="Más">+</button>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // Upsell inteligente del chef
    renderizarUpsellCarrito(items);

    // Resumen económico (con tarifa por distrito)
    $("summarySubtotal").textContent = formatoPrecio(resumen.subtotal);
    $("summaryDeliveryLabel").textContent = estado.modalidadCheckout === "delivery"
      ? `Delivery (${distrito})`
      : "Recojo en local";
    if (estado.modalidadCheckout === "delivery" && resumen.tieneDeliveryGratis) {
      $("summaryDeliveryValue").innerHTML = `<span class="strike-muted">${formatoPrecio(resumen.tarifaDistrito)}</span> <strong class="text-free">¡GRATIS!</strong>`;
    } else if (estado.modalidadCheckout === "recojo") {
      $("summaryDeliveryValue").innerHTML = `<strong class="text-free">${formatoPrecio(0)}</strong>`;
    } else {
      $("summaryDeliveryValue").textContent = formatoPrecio(resumen.costoDelivery);
    }
    $("summaryTotal").textContent = formatoPrecio(resumen.total);

    actualizarCalculoVuelto();
    actualizarPreviewWhatsApp();
  }

  function renderizarUpsellCarrito(items) {
    const upsellBox = $("cartUpsellBox");
    if (!upsellBox) return;

    const tienePizzas = items.some((i) => i.turno === "Noche");
    const candidatoId = tienePizzas ? "pizza-8" : "jugo-8";
    const yaEnCarrito = items.some((i) => i.id === candidatoId);
    const prod = PRODUCTOS.find((p) => p.id === candidatoId);

    if (!prod || yaEnCarrito) {
      upsellBox.hidden = true;
      return;
    }

    upsellBox.hidden = false;
    upsellBox.innerHTML = `
      <div class="upsell-card">
        <img src="${prod.imagen}" alt="${escapeHtml(prod.nombre)}" onerror="this.onerror=null;this.src='${fallbackPorTurno(prod.turno)}'">
        <div class="upsell-info">
          <span class="upsell-eyebrow">RECOMENDACIÓN DEL CHEF</span>
          <strong>${escapeHtml(prod.nombre)}</strong>
          <span>${formatoPrecio(prod.precio)}</span>
        </div>
        <button type="button" class="btn-upsell-add" data-upsell-id="${prod.id}">+ Agregar</button>
      </div>
    `;
  }

  function actualizarPreviewWhatsApp() {
    const previewEl = $("waPreviewText");
    if (!previewEl) return;
    const { items } = Carrito.obtenerEstado();
    if (items.length === 0) return;

    const cliente = obtenerDatosFormularioCheckout();
    const resumen = Carrito.calcularResumen(estado.modalidadCheckout, cliente.distrito);
    const msg = WA.construirMensajePedido({
      codigoPedido: "SB-PREVIEW",
      items,
      cliente,
      resumen
    });
    previewEl.textContent = msg;
  }

  function actualizarModalidadCheckout(modalidad) {
    estado.modalidadCheckout = modalidad;
    document.querySelectorAll("[data-delivery-tab]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-delivery-tab") === modalidad);
    });

    const addressFields = $("deliveryAddressFields");
    const pickupInfo = $("pickupStoreInfo");
    const addressInput = $("custAddress");

    if (modalidad === "delivery") {
      if (addressFields) addressFields.hidden = false;
      if (pickupInfo) pickupInfo.hidden = true;
      if (addressInput) addressInput.required = !estado.gpsActual;
    } else {
      if (addressFields) addressFields.hidden = true;
      if (pickupInfo) pickupInfo.hidden = false;
      if (addressInput) addressInput.required = false;
    }

    renderizarCarrito(Carrito.obtenerEstado());
  }

  function actualizarPagoCheckout(metodo) {
    estado.pagoSeleccionado = metodo;
    document.querySelectorAll("[data-pay-option]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-pay-option") === metodo);
    });
    const yapeBox = $("yapePlinInfoBox");
    const posBox = $("posInfoBox");
    const vueltoGroup = $("cashChangeGroup");

    if (yapeBox) yapeBox.hidden = metodo !== "Yape / Plin";
    if (posBox) posBox.hidden = metodo !== "POS Tarjeta";
    if (vueltoGroup) vueltoGroup.hidden = metodo !== "Efectivo contraentrega";

    actualizarCalculoVuelto();
    actualizarPreviewWhatsApp();
  }

  function enviarPedidoWhatsApp(e) {
    e.preventDefault();
    const { items } = Carrito.obtenerEstado();
    if (items.length === 0) {
      mostrarToast("Agrega al menos un jugo o pizza antes de confirmar.", "warning");
      return;
    }

    const cliente = obtenerDatosFormularioCheckout();

    // 1. Validar DNI real (8 dígitos, sin secuencias falsas)
    const checkDni = DNI.validarFormatoDni(cliente.dni);
    if (!checkDni.valido) {
      mostrarEstadoDni(checkDni.error, "error");
      mostrarToast(checkDni.error, "warning");
      $("custDni").focus();
      return;
    }

    // 2. Validar Nombre real (anti-broma si no vino bloqueado por RENIEC)
    if (!cliente.dniVerificado) {
      const checkNombre = DNI.validarNombreReal(cliente.nombre);
      if (!checkNombre.valido) {
        mostrarToast(checkNombre.error, "warning");
        $("custName").focus();
        return;
      }
      cliente.nombre = checkNombre.nombre;
    }

    // 3. Validar Celular
    const telDigits = cliente.telefono.replace(/\D/g, "");
    if (telDigits.length < 9) {
      mostrarToast("Ingresa un número de celular válido (9 dígitos) para coordinar tu entrega.", "warning");
      $("custPhone").focus();
      return;
    }

    // 4. Validar Dirección O Ubicación GPS si es delivery
    if (cliente.modalidad === "delivery" && !cliente.direccion && !cliente.gps) {
      mostrarToast("Escribe tu dirección o presiona 'Usar GPS' para ubicar tu entrega.", "warning");
      $("custAddress").focus();
      return;
    }

    const resumen = Carrito.calcularResumen(cliente.modalidad, cliente.distrito);

    // 5. Validar vuelto si paga en efectivo y escribió monto
    if (cliente.pago === "Efectivo contraentrega" && cliente.vueltoDe) {
      const montoPago = parseFloat(cliente.vueltoDe);
      if (!isNaN(montoPago) && montoPago < resumen.total) {
        mostrarToast(`El billete ingresado (${formatoPrecio(montoPago)}) es menor al total (${formatoPrecio(resumen.total)}).`, "warning");
        $("custCashChange").focus();
        return;
      }
    }

    Carrito.guardarDatosCliente(cliente);

    const codigoPedido = WA.generarCodigoPedido();
    const mensaje = WA.construirMensajePedido({
      codigoPedido,
      items,
      cliente,
      resumen
    });
    const urlWhatsApp = WA.construirUrl(mensaje);

    const pedidoConfirmado = {
      codigoPedido,
      fechaHora: Horarios.obtenerHoraPeru().horaCorta,
      items,
      cliente,
      resumen,
      mensaje,
      urlWhatsApp,
      categoriaResumen: WA.clasificarTipoPedido(items).categoriaResumen
    };

    Carrito.guardarUltimoPedido(pedidoConfirmado);
    actualizarBotonPedidoActivo();

    // Abrir WhatsApp en nueva pestaña
    window.open(urlWhatsApp, "_blank", "noopener,noreferrer");

    // Cerrar carrito y mostrar pantalla de seguimiento
    cerrarDrawerCarrito();
    mostrarSeguimientoPedido(pedidoConfirmado);
    mostrarToast(`Pedido #${codigoPedido} enviado a WhatsApp`, "success");
  }

  // ==================== SEGUIMIENTO DEL PEDIDO ====================
  function mostrarSeguimientoPedido(pedido) {
    if (!pedido) return;
    $("trackerCode").textContent = `#${pedido.codigoPedido}`;
    $("trackerCategory").textContent = pedido.categoriaResumen;
    $("trackerEta").textContent = pedido.cliente.modalidad === "delivery"
      ? `Llegada estimada: ${estado.modoActivo === "Noche" ? CFG.tiempoEstimadoNoche : CFG.tiempoEstimadoDia}`
      : "Recojo estimado en local: 15 - 25 min";

    const customerEl = $("trackerCustomer");
    if (customerEl) {
      const dniTxt = pedido.cliente.dni ? `DNI ${pedido.cliente.dni} · ` : "";
      customerEl.textContent = `${dniTxt}${pedido.cliente.nombre}`;
    }

    $("trackerAddress").textContent = pedido.cliente.modalidad === "delivery"
      ? `${pedido.cliente.direccion || "Entrega por pin GPS"}, ${pedido.cliente.distrito}`
      : `Recojo en local: ${CFG.direccion}`;

    const gpsRow = $("trackerGpsRow");
    const gpsLink = $("trackerGpsLink");
    if (gpsRow && gpsLink) {
      if (pedido.cliente.gps && pedido.cliente.gps.mapsUrl) {
        gpsRow.hidden = false;
        gpsLink.href = pedido.cliente.gps.mapsUrl;
      } else {
        gpsRow.hidden = true;
      }
    }

    $("trackerItemsList").innerHTML = pedido.items
      .map((it) => `<li><strong>${it.cantidad}x</strong> ${escapeHtml(it.nombre)} <small>(${escapeHtml(it.presentacion || "Estándar")})</small></li>`)
      .join("");

    $("trackerPayment").textContent = pedido.cliente.pago;
    $("trackerTotal").textContent = formatoPrecio(pedido.resumen.total);
    $("trackerTimePlaced").textContent = pedido.fechaHora;
    $("trackerStepPrepTitle").textContent = pedido.items.some((i) => i.turno === "Noche")
      ? "En el Horno de Leña (450°C)"
      : "Preparando tus Jugos Frescos";
    $("trackerReopenWA").href = pedido.urlWhatsApp;

    const estadoMsg = WA.construirMensajeSeguimiento(pedido.codigoPedido);
    $("trackerHelpWA").href = WA.construirUrl(estadoMsg);

    abrirModal("trackerModal");
  }

  function actualizarBotonPedidoActivo() {
    const ultimo = Carrito.obtenerUltimoPedido();
    const btn = $("btnActiveOrder");
    if (!btn) return;
    if (ultimo) {
      btn.hidden = false;
      btn.querySelector("span:last-child").textContent = `#${ultimo.codigoPedido}`;
      btn.title = `Ver seguimiento del pedido #${ultimo.codigoPedido}`;
    } else {
      btn.hidden = true;
    }
  }

  // ==================== UTILIDADES DE MODALES, DRAWER Y TOAST ====================
  function abrirModal(id) {
    const el = $(id);
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("is-open"));
    document.body.classList.add("no-scroll");
  }

  function cerrarModal(id) {
    const el = $(id);
    if (!el) return;
    el.classList.remove("is-open");
    setTimeout(() => {
      el.hidden = true;
      if (!$("cartDrawer").classList.contains("is-open") && !document.querySelector(".modal-backdrop.is-open")) {
        document.body.classList.remove("no-scroll");
      }
    }, 220);
  }

  function abrirDrawerCarrito() {
    const drawer = $("cartDrawer");
    if (!drawer) return;
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add("is-open"));
    document.body.classList.add("no-scroll");
    renderizarCarrito(Carrito.obtenerEstado());
  }

  function cerrarDrawerCarrito() {
    const drawer = $("cartDrawer");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    setTimeout(() => {
      drawer.hidden = true;
      if (!document.querySelector(".modal-backdrop.is-open")) {
        document.body.classList.remove("no-scroll");
      }
    }, 240);
  }

  let toastTimer = null;
  function mostrarToast(mensaje, tipo = "success") {
    const toast = $("appToast");
    if (!toast) return;
    $("toastText").textContent = mensaje;
    toast.className = `app-toast is-visible is-${tipo}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3000);
  }

  // ==================== EVENTOS GLOBALES ====================
  function registrarEventos() {
    // Botones de cambio de modo Día / Noche
    document.querySelectorAll("[data-mode-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        aplicarModo(btn.getAttribute("data-mode-btn"), true);
      });
    });

    // Tarjetas del banner de turnos
    $("shiftCardDia")?.addEventListener("click", () => aplicarModo("Día", true));
    $("shiftCardNoche")?.addEventListener("click", () => aplicarModo("Noche", true));

    // Hero featured card buttons
    $("heroCardAddBtn")?.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-hero-prod-id");
      const prod = PRODUCTOS.find((p) => p.id === id);
      if (!prod) return;
      const pres = prod.presentaciones[0];
      Carrito.agregarItem({
        id: prod.id,
        nombre: prod.nombre,
        imagen: prod.imagen,
        turno: prod.turno,
        tipo: prod.tipo,
        presentacion: pres.nombre,
        precioUnitario: prod.precio + pres.extra,
        cantidad: 1
      });
      mostrarToast(`Agregaste ${prod.nombre} a tu pedido.`);
    });

    $("heroCardCustomizeBtn")?.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-hero-prod-id");
      abrirModalPersonalizacion(id);
    });

    // Filtros de categoría (delegación)
    $("categoryFilters")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      estado.categoriaActiva = btn.getAttribute("data-cat");
      renderizarCategorias();
      renderizarProductos();
    });

    // Búsqueda y ordenamiento
    $("searchInput")?.addEventListener("input", (e) => {
      estado.busqueda = e.target.value;
      renderizarProductos();
    });

    $("sortSelect")?.addEventListener("change", (e) => {
      estado.ordenActivo = e.target.value;
      renderizarProductos();
    });

    // Acciones en tarjetas de productos (delegación)
    $("productsGrid")?.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;

      const action = target.getAttribute("data-action");
      const prodId = target.getAttribute("data-prod-id");
      const prod = PRODUCTOS.find((p) => p.id === prodId);
      if (!prod) return;

      const sel = obtenerSeleccionCard(prod);

      if (action === "select-size") {
        sel.presIdx = parseInt(target.getAttribute("data-pres-idx"), 10) || 0;
        const pres = prod.presentaciones[sel.presIdx];
        const card = target.closest(".product-card");
        card.querySelectorAll(".size-chip").forEach((b, i) => b.classList.toggle("is-selected", i === sel.presIdx));
        const priceEl = $(`price-${prod.id}`);
        if (priceEl) priceEl.textContent = formatoPrecio(prod.precio + pres.extra);
      } else if (action === "card-qty") {
        const delta = parseInt(target.getAttribute("data-delta"), 10);
        sel.qty = Math.min(20, Math.max(1, sel.qty + delta));
        const qtyEl = $(`qty-val-${prod.id}`);
        if (qtyEl) qtyEl.textContent = sel.qty;
      } else if (action === "open-customize") {
        abrirModalPersonalizacion(prodId);
      } else if (action === "quick-add") {
        const pres = prod.presentaciones[sel.presIdx] || prod.presentaciones[0];
        Carrito.agregarItem({
          id: prod.id,
          nombre: prod.nombre,
          imagen: prod.imagen,
          turno: prod.turno,
          tipo: prod.tipo,
          presentacion: pres.nombre,
          precioUnitario: prod.precio + pres.extra,
          cantidad: sel.qty
        });
        mostrarToast(`Agregaste ${sel.qty}x ${prod.nombre} (${pres.nombre.split("(")[0].trim()}).`);
        sel.qty = 1;
        const qtyEl = $(`qty-val-${prod.id}`);
        if (qtyEl) qtyEl.textContent = "1";
      } else if (action === "quick-wa") {
        const pres = prod.presentaciones[sel.presIdx] || prod.presentaciones[0];
        const msg = WA.construirMensajeRapidoProducto({
          id: prod.id,
          nombre: prod.nombre,
          turno: prod.turno,
          presentacion: pres.nombre,
          precioUnitario: prod.precio + pres.extra,
          cantidad: sel.qty
        });
        window.open(WA.construirUrl(msg), "_blank", "noopener,noreferrer");
        mostrarToast(`Abriendo WhatsApp para pedir ${prod.nombre}...`);
      }
    });

    // Combos
    $("combosGrid")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-combo-id]");
      if (!btn) return;
      const combo = COMBOS.find((c) => c.id === btn.getAttribute("data-combo-id"));
      if (!combo) return;

      Carrito.agregarItem({
        id: combo.id,
        nombre: combo.nombre,
        imagen: combo.imagen,
        turno: combo.turno,
        tipo: "combo",
        presentacion: `Combo Especial (${combo.rinde})`,
        precioUnitario: combo.precio,
        cantidad: 1
      });
      mostrarToast(`¡Combo agregado! ${combo.nombre}`);
    });

    // Modal de personalización
    $("productModal")?.addEventListener("change", recalcularModalProducto);
    $("modalQtyMinus")?.addEventListener("click", () => {
      estado.qtyModal = Math.max(1, estado.qtyModal - 1);
      $("modalQtyVal").textContent = estado.qtyModal;
      recalcularModalProducto();
    });
    $("modalQtyPlus")?.addEventListener("click", () => {
      estado.qtyModal = Math.min(20, estado.qtyModal + 1);
      $("modalQtyVal").textContent = estado.qtyModal;
      recalcularModalProducto();
    });
    $("modalAddBtn")?.addEventListener("click", () => {
      const item = construirItemDesdeModal();
      if (!item) return;
      Carrito.agregarItem(item);
      cerrarModal("productModal");
      mostrarToast(`Agregaste ${item.cantidad}x ${item.nombre} personalizado.`);
    });
    $("modalQuickWaBtn")?.addEventListener("click", () => {
      const item = construirItemDesdeModal();
      if (!item) return;
      const msg = WA.construirMensajeRapidoProducto(item);
      window.open(WA.construirUrl(msg), "_blank", "noopener,noreferrer");
      mostrarToast(`Enviando ${item.nombre} directo a WhatsApp...`);
    });

    // Abrir / cerrar carrito
    document.querySelectorAll("[data-open-cart]").forEach((btn) => {
      btn.addEventListener("click", abrirDrawerCarrito);
    });
    $("closeCartBtn")?.addEventListener("click", cerrarDrawerCarrito);
    $("cartOverlay")?.addEventListener("click", cerrarDrawerCarrito);

    // Acciones dentro del carrito
    $("cartItemsList")?.addEventListener("click", (e) => {
      const delBtn = e.target.closest("[data-cart-delete]");
      if (delBtn) {
        Carrito.eliminarItem(parseInt(delBtn.getAttribute("data-cart-delete"), 10));
        return;
      }
      const qtyBtn = e.target.closest("[data-cart-qty]");
      if (qtyBtn) {
        Carrito.cambiarCantidad(
          parseInt(qtyBtn.getAttribute("data-cart-qty"), 10),
          parseInt(qtyBtn.getAttribute("data-delta"), 10)
        );
      }
    });

    $("cartUpsellBox")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-upsell-id]");
      if (!btn) return;
      const prod = PRODUCTOS.find((p) => p.id === btn.getAttribute("data-upsell-id"));
      if (!prod) return;
      Carrito.agregarItem({
        id: prod.id,
        nombre: prod.nombre,
        imagen: prod.imagen,
        turno: prod.turno,
        tipo: prod.tipo,
        presentacion: prod.presentaciones[0].nombre,
        precioUnitario: prod.precio,
        cantidad: 1
      });
      mostrarToast(`Agregaste ${prod.nombre} a tu pedido.`);
    });

    $("clearCartBtn")?.addEventListener("click", () => {
      const { items } = Carrito.obtenerEstado();
      if (items.length === 0) return;
      Carrito.vaciar();
      mostrarToast("Tu pedido ha sido vaciado.", "info");
    });

    // Delivery / Recojo y Métodos de Pago
    document.querySelectorAll("[data-delivery-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        actualizarModalidadCheckout(btn.getAttribute("data-delivery-tab"));
      });
    });

    document.querySelectorAll("[data-pay-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        actualizarPagoCheckout(btn.getAttribute("data-pay-option"));
      });
    });

    // DNI autocompletado automático al completar 8 dígitos o al presionar Validar
    $("custDni")?.addEventListener("input", (e) => {
      const soloDigitos = e.target.value.replace(/\D/g, "").slice(0, 8);
      e.target.value = soloDigitos;
      if (soloDigitos.length < 8) {
        bloquearNombrePorDni(false);
        mostrarEstadoDni("");
      } else if (soloDigitos.length === 8) {
        validarYAutocompletarDni();
      }
      actualizarPreviewWhatsApp();
    });

    $("btnLookupDni")?.addEventListener("click", validarYAutocompletarDni);

    $("btnUnlockName")?.addEventListener("click", () => {
      bloquearNombrePorDni(false);
      $("custDni").value = "";
      $("custName").value = "";
      mostrarEstadoDni("");
      $("custDni").focus();
      actualizarPreviewWhatsApp();
    });

    // GPS ubicación actual
    $("btnGetGps")?.addEventListener("click", solicitarUbicacionGps);
    $("btnClearGps")?.addEventListener("click", () => {
      estado.gpsActual = null;
      actualizarUiGps();
      mostrarToast("Ubicación GPS retirada.", "info");
    });

    // Cambio de distrito actualiza tarifa de delivery y vuelto
    $("custDistrict")?.addEventListener("change", () => {
      renderizarCarrito(Carrito.obtenerEstado());
    });

    // Cálculo en vivo de vuelto en efectivo
    $("custCashChange")?.addEventListener("input", () => {
      actualizarCalculoVuelto();
      actualizarPreviewWhatsApp();
    });

    // Copiar número Yape / Plin
    $("btnCopyYape")?.addEventListener("click", async () => {
      const num = CFG.pagos.yapePlinNumero.replace(/\s+/g, "");
      try {
        await navigator.clipboard.writeText(num);
        mostrarToast(`Número Yape/Plin (${CFG.pagos.yapePlinNumero}) copiado.`);
      } catch {
        mostrarToast(`Número Yape/Plin: ${CFG.pagos.yapePlinNumero}`, "info");
      }
    });

    // Copiar código en seguimiento
    $("btnCopyTrackerCode")?.addEventListener("click", async () => {
      const codigo = $("trackerCode")?.textContent || "";
      try {
        await navigator.clipboard.writeText(codigo);
        mostrarToast(`Código ${codigo} copiado.`);
      } catch {
        mostrarToast(`Tu código es ${codigo}`, "info");
      }
    });

    // Actualización en vivo de la vista previa de WhatsApp al escribir en el checkout
    $("checkoutForm")?.addEventListener("input", actualizarPreviewWhatsApp);
    $("checkoutForm")?.addEventListener("change", actualizarPreviewWhatsApp);
    $("checkoutForm")?.addEventListener("submit", enviarPedidoWhatsApp);

    // Toggle vista previa WhatsApp & Copiar mensaje
    $("toggleWaPreviewBtn")?.addEventListener("click", () => {
      estado.mostrarPreviewWA = !estado.mostrarPreviewWA;
      $("waPreviewBox").hidden = !estado.mostrarPreviewWA;
      $("toggleWaPreviewBtn").setAttribute("aria-expanded", String(estado.mostrarPreviewWA));
      actualizarPreviewWhatsApp();
    });

    $("copyWaMsgBtn")?.addEventListener("click", async () => {
      const text = $("waPreviewText").textContent;
      try {
        await navigator.clipboard.writeText(text);
        mostrarToast("Mensaje copiado al portapapeles.");
      } catch {
        mostrarToast("No se pudo copiar automáticamente.", "warning");
      }
    });

    // Cerrar modales
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        cerrarModal(btn.getAttribute("data-close-modal"));
      });
    });
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) cerrarModal(backdrop.id);
      });
    });

    // Botón para ver último pedido confirmado
    $("btnActiveOrder")?.addEventListener("click", () => {
      const ultimo = Carrito.obtenerUltimoPedido();
      if (ultimo) mostrarSeguimientoPedido(ultimo);
    });

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        cerrarModal("productModal");
        cerrarModal("trackerModal");
        cerrarDrawerCarrito();
      }
    });
  }

  // ==================== INICIALIZACIÓN ====================
  function inicializar() {
    // Poblar distritos con tarifa y datos del negocio
    const distSelect = $("custDistrict");
    if (distSelect) {
      distSelect.innerHTML = CFG.distritosDelivery
        .map((d) => {
          const tarifa = Carrito.obtenerTarifaDistrito(d);
          return `<option value="${escapeHtml(d)}">${escapeHtml(d)} (${formatoPrecio(tarifa)} · Gratis ≥ ${CFG.moneda}${CFG.montoDeliveryGratis})</option>`;
        })
        .join("");
    }

    if ($("yapeTitularText")) $("yapeTitularText").textContent = CFG.pagos.yapePlinTitular;
    if ($("yapeNumberText")) $("yapeNumberText").textContent = CFG.pagos.yapePlinNumero;
    if ($("yapeInstructionText")) $("yapeInstructionText").textContent = CFG.pagos.yapePlinInstruccion;

    const savedCustomer = Carrito.obtenerDatosCliente();
    if ($("custDni") && savedCustomer.dni) $("custDni").value = savedCustomer.dni;
    if ($("custName") && savedCustomer.nombre) {
      $("custName").value = savedCustomer.nombre;
      if (savedCustomer.dniVerificado) bloquearNombrePorDni(true, savedCustomer.nombre);
    }
    if ($("custPhone") && savedCustomer.telefono) $("custPhone").value = savedCustomer.telefono;
    if ($("custReceipt") && savedCustomer.comprobante) $("custReceipt").value = savedCustomer.comprobante;
    if ($("custDistrict") && CFG.distritosDelivery.includes(savedCustomer.distrito)) $("custDistrict").value = savedCustomer.distrito;
    if ($("custAddress") && savedCustomer.direccion) $("custAddress").value = savedCustomer.direccion;
    if ($("custReference") && savedCustomer.referencia) $("custReference").value = savedCustomer.referencia;

    const mapIframe = $("storeMapIframe");
    if (mapIframe) mapIframe.src = CFG.mapsEmbedUrl;
    const mapLink = $("storeMapLink");
    if (mapLink) mapLink.href = CFG.mapsLinkUrl;
    const phoneVisibleEl = $("storePhoneVisible");
    if (phoneVisibleEl) phoneVisibleEl.textContent = CFG.telefonoVisible;
    const addressVisibleEl = $("storeAddressVisible");
    if (addressVisibleEl) addressVisibleEl.textContent = CFG.direccion;

    const yearEl = $("currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Suscribirse al carrito
    Carrito.suscribir(renderizarCarrito);

    // Detectar turno inicial de Perú
    const { horaDecimal } = Horarios.obtenerHoraPeru();
    const turnoInicial = Horarios.evaluarTurno(horaDecimal).turno;
    aplicarModo(turnoInicial, false);

    // Reloj en vivo (solo actualiza texto del reloj, nunca destruye el DOM del catálogo)
    actualizarReloj();
    setInterval(actualizarReloj, 1000);

    // Estado inicial de checkout y carrito
    actualizarModalidadCheckout(savedCustomer.modalidad || "delivery");
    actualizarPagoCheckout(savedCustomer.pago || "Yape / Plin");
    actualizarBotonPedidoActivo();
    registrarEventos();

    // Si llega con ?pedido=SB-XXXX en la URL y coincide con el último pedido, abrir seguimiento
    const params = new URLSearchParams(window.location.search);
    const pedidoParam = params.get("pedido");
    const ultimo = Carrito.obtenerUltimoPedido();
    if (pedidoParam && ultimo && ultimo.codigoPedido.toUpperCase() === pedidoParam.replace("#", "").toUpperCase()) {
      mostrarSeguimientoPedido(ultimo);
    }
  }

  document.addEventListener("DOMContentLoaded", inicializar);
})();
