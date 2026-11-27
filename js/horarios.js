/**
 * Sol & Brasa - Control Horario de Perú (America/Lima)
 * Detecta el turno real (Juguería Día vs Pizzería Noche) y actualiza el reloj sin re-renderizar la carta cada segundo.
 */
window.SolBrasaHorarios = (function () {
  function obtenerHoraPeru() {
    const ahora = new Date();
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Lima",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).formatToParts(ahora);

    const mapa = {};
    partes.forEach((p) => {
      mapa[p.type] = parseInt(p.value, 10);
    });

    const horas = mapa.hour === 24 ? 0 : mapa.hour;
    const minutos = mapa.minute || 0;
    const segundos = mapa.second || 0;
    const horaDecimal = horas + minutos / 60;

    const horaFormateada = ahora.toLocaleTimeString("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    const horaCorta = ahora.toLocaleTimeString("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    return { horas, minutos, segundos, horaDecimal, horaFormateada, horaCorta };
  }

  function evaluarTurno(horaDecimal) {
    const { jugueria, pizzeria } = window.SOL_BRASA_CONFIG.horarios;

    if (horaDecimal >= jugueria.inicio && horaDecimal < jugueria.fin) {
      return {
        turno: "Día",
        abierto: true,
        etiquetaEstado: "Abierto · Juguería Fresca",
        detalleTurno: `Turno Día activo (${jugueria.etiqueta})`,
        siguienteTurno: `Pizzería abre a las 05:00 p.m.`
      };
    }

    if (horaDecimal >= pizzeria.inicio && horaDecimal < pizzeria.fin) {
      return {
        turno: "Noche",
        abierto: true,
        etiquetaEstado: "Abierto · Pizzería",
        detalleTurno: `Turno Noche activo (${pizzeria.etiqueta})`,
        siguienteTurno: `Juguería fresca abre mañana a las 07:00 a.m.`
      };
    }

    return {
      turno: "Día",
      abierto: false,
      etiquetaEstado: "Fuera de horario (Pre-pedidos activos)",
      detalleTurno: `Atendemos de 07:00 a.m. a 11:30 p.m.`,
      siguienteTurno: `Puedes dejar tu pedido programado por WhatsApp`
    };
  }

  return {
    obtenerHoraPeru,
    evaluarTurno
  };
})();
