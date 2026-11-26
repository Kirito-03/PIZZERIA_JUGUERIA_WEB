/**
 * Sol & Brasa - Gestión del Carrito Reactivo con LocalStorage
 * Soporta Juguería (Día), Pizzería (Noche), Combos, recargos reales y tarifa por distrito.
 */
window.SolBrasaCarrito = (function () {
  const STORAGE_KEY = "sol_brasa_carrito_v2";
  const STORAGE_ORDER_KEY = "sol_brasa_ultimo_pedido_v2";
  const STORAGE_CUSTOMER_KEY = "sol_brasa_cliente_v2";

  let items = cargarDesdeStorage(STORAGE_KEY, []);
  let listeners = [];

  function cargarDesdeStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function guardarEnStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Silenciar si el almacenamiento está restringido
    }
  }

  function generarFirma(item) {
    const extrasIds = (item.extras || []).map((e) => e.id || e.nombre).sort().join(",");
    const opciones = (item.opcionesTexto || []).join("|");
    return [item.id, item.presentacion || "", opciones, extrasIds, (item.notaItem || "").trim()].join("::");
  }

  function suscribir(fn) {
    listeners.push(fn);
  }

  function notificar() {
    guardarEnStorage();
    const snapshot = obtenerEstado();
    listeners.forEach((fn) => fn(snapshot));
  }

  function agregarItem(nuevoItem) {
    const firma = generarFirma(nuevoItem);
    const existente = items.find((it) => it.firma === firma);

    if (existente) {
      existente.cantidad += nuevoItem.cantidad || 1;
    } else {
      items.push({
        firma,
        id: nuevoItem.id,
        nombre: nuevoItem.nombre,
        imagen: nuevoItem.imagen,
        turno: nuevoItem.turno || "Día",
        tipo: nuevoItem.tipo || "jugo",
        presentacion: nuevoItem.presentacion || "",
        opcionesTexto: nuevoItem.opcionesTexto || [],
        extras: nuevoItem.extras || [],
        notaItem: (nuevoItem.notaItem || "").trim(),
        precioUnitario: Number(nuevoItem.precioUnitario),
        cantidad: nuevoItem.cantidad || 1
      });
    }
    notificar();
  }

  function cambiarCantidad(index, delta) {
    if (!items[index]) return;
    items[index].cantidad += delta;
    if (items[index].cantidad <= 0) {
      items.splice(index, 1);
    }
    notificar();
  }

  function eliminarItem(index) {
    if (!items[index]) return;
    items.splice(index, 1);
    notificar();
  }

  function vaciar() {
    items = [];
    notificar();
  }

  function obtenerTarifaDistrito(distrito) {
    const cfg = window.SOL_BRASA_CONFIG;
    if (cfg.tarifasDelivery && distrito && typeof cfg.tarifasDelivery[distrito] === "number") {
      return cfg.tarifasDelivery[distrito];
    }
    return cfg.costoDeliveryBase;
  }

  function calcularResumen(modalidad = "delivery", distrito = "Miraflores") {
    const cfg = window.SOL_BRASA_CONFIG;
    const cantidadTotal = items.reduce((acc, it) => acc + it.cantidad, 0);
    const subtotal = items.reduce((acc, it) => acc + it.precioUnitario * it.cantidad, 0);
    const tarifaDistrito = obtenerTarifaDistrito(distrito);

    let costoDelivery = 0;
    let faltaParaGratis = 0;

    if (modalidad === "delivery" && subtotal > 0) {
      if (subtotal >= cfg.montoDeliveryGratis) {
        costoDelivery = 0;
        faltaParaGratis = 0;
      } else {
        costoDelivery = tarifaDistrito;
        faltaParaGratis = Math.max(0, cfg.montoDeliveryGratis - subtotal);
      }
    }

    const total = subtotal + costoDelivery;
    const progresoGratis = Math.min(100, Math.round((subtotal / cfg.montoDeliveryGratis) * 100));

    return {
      cantidadTotal,
      subtotal,
      tarifaDistrito,
      costoDelivery,
      total,
      faltaParaGratis,
      progresoGratis,
      tieneDeliveryGratis: subtotal >= cfg.montoDeliveryGratis && subtotal > 0
    };
  }

  function obtenerEstado() {
    return {
      items: items.map((it) => ({ ...it })),
      resumenDelivery: calcularResumen("delivery"),
      resumenRecojo: calcularResumen("recojo")
    };
  }

  function guardarUltimoPedido(pedido) {
    try {
      localStorage.setItem(STORAGE_ORDER_KEY, JSON.stringify(pedido));
    } catch {
      // Ignorar
    }
  }

  function obtenerUltimoPedido() {
    return cargarDesdeStorage(STORAGE_ORDER_KEY, null);
  }

  function guardarDatosCliente(datos) {
    try {
      localStorage.setItem(STORAGE_CUSTOMER_KEY, JSON.stringify(datos));
    } catch {
      // Ignorar
    }
  }

  function obtenerDatosCliente() {
    return cargarDesdeStorage(STORAGE_CUSTOMER_KEY, {
      dni: "",
      dniVerificado: false,
      nombre: "",
      telefono: "",
      comprobante: "Boleta simple",
      modalidad: "delivery",
      distrito: "Miraflores",
      direccion: "",
      referencia: "",
      pago: "Yape / Plin",
      vueltoDe: "",
      notas: ""
    });
  }

  return {
    suscribir,
    agregarItem,
    cambiarCantidad,
    eliminarItem,
    vaciar,
    obtenerTarifaDistrito,
    calcularResumen,
    obtenerEstado,
    guardarUltimoPedido,
    obtenerUltimoPedido,
    guardarDatosCliente,
    obtenerDatosCliente
  };
})();
