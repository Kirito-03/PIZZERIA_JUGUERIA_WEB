/**
 * Sol & Brasa - Generador Ultra-Detallado de Mensajes para WhatsApp (wa.me)
 * Genera un ticket completo para cocina, caja y repartidor:
 * DNI + Nombre verificado, detalle numerado de jugos/pizzas/combos, extras con precio,
 * vuelto calculado, enlace GPS de Google Maps y código de seguimiento.
 */
window.SolBrasaWhatsApp = (function () {
  function generarCodigoPedido() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `SB-${num}`;
  }

  function obtenerFechaHoraLima() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-PE", {
      timeZone: "America/Lima",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    const hora = ahora.toLocaleTimeString("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    return { fecha, hora };
  }

  function clasificarTipoPedido(items) {
    const tieneJugos = items.some((it) => it.turno === "Día");
    const tienePizzas = items.some((it) => it.turno === "Noche");

    if (tieneJugos && tienePizzas) {
      return {
        titulo: "☀️🔥 NUEVO PEDIDO DUAL (JUGUERÍA & PIZZERÍA)",
        categoriaResumen: "Jugos & Pizzas"
      };
    }
    if (tienePizzas) {
      return {
        titulo: "🔥 NUEVO PEDIDO DE PIZZERÍA A LA LEÑA",
        categoriaResumen: "Pizzería Nocturna"
      };
    }
    return {
      titulo: "☀️ NUEVO PEDIDO DE JUGUERÍA NATURAL",
      categoriaResumen: "Juguería del Día"
    };
  }

  function formatearDetalleItem(item, indice) {
    const moneda = window.SOL_BRASA_CONFIG.moneda;
    const unitario = Number(item.precioUnitario).toFixed(2);
    const subtotal = (item.precioUnitario * item.cantidad).toFixed(2);
    const icono = item.tipo === "combo" ? "🎁" : (item.turno === "Noche" ? "🍕" : "🥤");
    const area = item.tipo === "combo"
      ? "COMBO"
      : (item.turno === "Noche" ? "PIZZERÍA" : "JUGUERÍA");
    const prefijo = typeof indice === "number" ? `*${indice + 1}.* ` : "";

    const lineas = [
      `${prefijo}${icono} *${item.cantidad}x ${item.nombre}* [${area}]`,
      `   • Precio unit.: ${moneda} ${unitario}  →  *Subtotal: ${moneda} ${subtotal}*`
    ];

    if (item.presentacion) {
      lineas.push(`   • Tamaño / Presentación: ${item.presentacion}`);
    }
    if (item.opcionesTexto && item.opcionesTexto.length > 0) {
      item.opcionesTexto.forEach((op) => {
        lineas.push(`   • ${op}`);
      });
    }
    if (item.extras && item.extras.length > 0) {
      const extrasTxt = item.extras
        .map((e) => (e.extra > 0 ? `${e.nombre} (+${moneda} ${Number(e.extra).toFixed(2)})` : e.nombre))
        .join(", ");
      lineas.push(`   • Adicionales: ${extrasTxt}`);
    }
    if (item.notaItem) {
      lineas.push(`   • Nota cocina: _"${item.notaItem}"_`);
    }

    return lineas.join("\n");
  }

  function construirMensajePedido({ codigoPedido, items, cliente, resumen }) {
    const cfg = window.SOL_BRASA_CONFIG;
    const { titulo } = clasificarTipoPedido(items);
    const { fecha, hora } = obtenerFechaHoraLima();
    const totalUnidades = items.reduce((acc, it) => acc + it.cantidad, 0);

    const bloques = [];
    bloques.push(`*${titulo} — ${cfg.nombreNegocio.toUpperCase()}*`);
    bloques.push(`━━━━━━━━━━━━━━━━━━━━`);
    bloques.push(`🧾 *Pedido:* #${codigoPedido}`);
    bloques.push(`📅 *Fecha / Hora:* ${fecha} · ${hora} (Lima)`);
    bloques.push("");

    // Bloque Cliente con DNI
    bloques.push(`*👤 DATOS DEL CLIENTE:*`);
    if (cliente.dni) {
      const badgeVerif = cliente.dniVerificado ? " ✅ (Verificado)" : "";
      bloques.push(`• *DNI:* ${cliente.dni}${badgeVerif}`);
    }
    bloques.push(`• *Nombre:* ${cliente.nombre || "Sin especificar"}`);
    if (cliente.telefono) {
      bloques.push(`• *Celular:* ${cliente.telefono}`);
    }
    if (cliente.comprobante) {
      bloques.push(`• *Comprobante:* ${cliente.comprobante}`);
    }
    bloques.push("");

    // Bloque Ítems Numerados
    bloques.push(`*📋 DETALLE DEL PEDIDO (${totalUnidades} ${totalUnidades === 1 ? "producto" : "productos"}):*`);
    items.forEach((item, idx) => {
      bloques.push(formatearDetalleItem(item, idx));
    });
    bloques.push("");

    // Bloque Económico y Pago
    bloques.push(`*💰 RESUMEN DE PAGO:*`);
    bloques.push(`• Subtotal productos: ${cfg.moneda} ${resumen.subtotal.toFixed(2)}`);

    if (cliente.modalidad === "delivery") {
      const textoDelivery = resumen.costoDelivery === 0
        ? `¡GRATIS! (Pedido ≥ ${cfg.moneda} ${cfg.montoDeliveryGratis.toFixed(0)})`
        : `${cfg.moneda} ${resumen.costoDelivery.toFixed(2)}`;
      bloques.push(`• Delivery (${cliente.distrito || "Puerto Inca"}): ${textoDelivery}`);
    } else {
      bloques.push(`• Recojo en local: ${cfg.moneda} 0.00`);
    }

    bloques.push(`• *TOTAL A PAGAR: ${cfg.moneda} ${resumen.total.toFixed(2)}*`);

    let detallePago = cliente.pago || "Yape / Plin";
    if (cliente.pago === "Yape / Plin") {
      detallePago = `Yape / Plin (${cfg.pagos.yapePlinNumero}) — Adjuntaré captura en este chat`;
    } else if (cliente.pago === "Efectivo contraentrega") {
      const montoPago = parseFloat(cliente.vueltoDe);
      if (!isNaN(montoPago) && montoPago >= resumen.total) {
        const vuelto = montoPago - resumen.total;
        detallePago = `Efectivo — Paga con ${cfg.moneda} ${montoPago.toFixed(2)} | *Llevar vuelto: ${cfg.moneda} ${vuelto.toFixed(2)}*`;
      } else if (cliente.vueltoDe) {
        detallePago = `Efectivo (Paga con ${cfg.moneda} ${cliente.vueltoDe})`;
      } else {
        detallePago = `Efectivo exacto contraentrega`;
      }
    } else if (cliente.pago === "POS Tarjeta") {
      detallePago = `POS Móvil contraentrega (Visa / Mastercard)`;
    }
    bloques.push(`• *Método de pago:* ${detallePago}`);
    bloques.push("");

    // Bloque Entrega + GPS
    bloques.push(`*📍 ENTREGA Y UBICACIÓN:*`);
    if (cliente.modalidad === "delivery") {
      bloques.push(`• Modalidad: 🛵 *Delivery a Domicilio*`);
      bloques.push(`• Distrito: ${cliente.distrito || "Puerto Inca"}`);
      bloques.push(`• Dirección: ${cliente.direccion || "Según pin GPS adjunto"}`);
      if (cliente.referencia) {
        bloques.push(`• Referencia: ${cliente.referencia}`);
      }
      if (cliente.gps && cliente.gps.mapsUrl) {
        bloques.push(`• 🗺️ *Ubicación GPS (Google Maps):* ${cliente.gps.mapsUrl}`);
      }
    } else {
      bloques.push(`• Modalidad: 🏪 *Recojo en Local*`);
      bloques.push(`• Tienda: ${cfg.direccion}`);
    }

    if (cliente.notas) {
      bloques.push(`• Observaciones: _${cliente.notas}_`);
    }

    bloques.push(`━━━━━━━━━━━━━━━━━━━━`);
    bloques.push(`_Enviado desde la Carta Digital de ${cfg.nombreNegocio}. Por favor confirmar recepción y tiempo estimado para el pedido #${codigoPedido}._`);

    return bloques.join("\n");
  }

  function construirMensajeRapidoProducto(item) {
    const cfg = window.SOL_BRASA_CONFIG;
    const icono = item.turno === "Noche" ? "🔥🍕" : "☀️🥤";
    const sub = (item.precioUnitario * item.cantidad).toFixed(2);

    const lineas = [
      `*${icono} PEDIDO RÁPIDO — ${cfg.nombreNegocio.toUpperCase()}*`,
      "",
      `Hola, deseo pedir lo siguiente:`,
      formatearDetalleItem(item),
      "",
      `*TOTAL ESTIMADO:* ${cfg.moneda} ${sub}`,
      "",
      `_Por favor indícame disponibilidad y tiempo de entrega para enviar mi DNI, ubicación GPS y pago._`
    ];

    return lineas.join("\n");
  }

  function construirMensajeSeguimiento(codigoPedido) {
    const cfg = window.SOL_BRASA_CONFIG;
    return `Hola ${cfg.nombreNegocio} 👋, quisiera consultar el estado actual de mi pedido *#${codigoPedido}*. ¡Gracias!`;
  }

  function construirMensajeConsultaGeneral(modoActivo) {
    const cfg = window.SOL_BRASA_CONFIG;
    const msg = modoActivo === "Noche"
      ? `Hola ${cfg.nombreNegocio} 🔥, quisiera hacer un pedido de pizzas artesanales al horno de leña.`
      : `Hola ${cfg.nombreNegocio} ☀️, quisiera hacer un pedido de jugos naturales y bowls frescos.`;
    return construirUrl(msg);
  }

  function construirUrl(mensaje) {
    const tel = window.SOL_BRASA_CONFIG.telefonoWhatsApp;
    return `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;
  }

  return {
    generarCodigoPedido,
    clasificarTipoPedido,
    construirMensajePedido,
    construirMensajeRapidoProducto,
    construirMensajeSeguimiento,
    construirMensajeConsultaGeneral,
    construirUrl
  };
})();
