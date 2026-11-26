/**
 * Sol & Brasa - Validación y Autocompletado de DNI Peruano (Anti-broma)
 * - Valida formato de 8 dígitos y bloquea secuencias falsas (00000000, 12345678, etc.).
 * - En producción (Netlify) consulta /.netlify/functions/consultar-dni con token seguro en servidor.
 * - En modo local sin token ofrece DNIs de prueba para demostrar el autocompletado al instante.
 */
window.SolBrasaDNI = (function () {
  const DNIS_INVALIDOS = new Set([
    "00000000", "11111111", "22222222", "33333333", "44444444",
    "55555555", "66666666", "77777777", "88888888", "99999999",
    "12345678", "87654321", "01234567"
  ]);

  // Base local de demostración (solo se usa cuando el servidor local no tiene Netlify Functions/token)
  const DEMO_RENIEC = {
    "72345678": "MARÍA ELENA QUISPE TORRES",
    "45678912": "CARLOS ANDRÉS MENDOZA ROJAS",
    "41239876": "LUCÍA FERNANDA PAREDES SILVA",
    "70112233": "DIEGO ALEJANDRO VARGAS FLORES"
  };

  const PALABRAS_BLOQUEADAS = [
    "asdf", "qwerty", "xxxx", "zzzz", "test", "prueba", "nadie", "anonimo",
    "chistoso", "broma", "troll", "pepito", "lol", "jajaja", "puta", "mierda"
  ];

  function validarFormatoDni(dni) {
    const limpio = String(dni || "").replace(/\D/g, "");
    if (!/^\d{8}$/.test(limpio)) {
      return { valido: false, error: "El DNI debe tener exactamente 8 dígitos." };
    }
    if (DNIS_INVALIDOS.has(limpio) || /^(\d)\1{7}$/.test(limpio)) {
      return { valido: false, error: "Ingresa un número de DNI real (secuencia no válida)." };
    }
    return { valido: true, dni: limpio };
  }

  function validarNombreReal(nombre) {
    const limpio = String(nombre || "").trim().replace(/\s+/g, " ");
    if (limpio.length < 6) {
      return { valido: false, error: "Ingresa tu nombre y apellido completos." };
    }
    const partes = limpio.split(" ").filter((p) => p.length >= 2);
    if (partes.length < 2) {
      return { valido: false, error: "Debes ingresar al menos un nombre y un apellido." };
    }
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\s.-]+$/.test(limpio)) {
      return { valido: false, error: "El nombre solo debe contener letras válidas." };
    }
    const lower = limpio.toLowerCase();
    if (PALABRAS_BLOQUEADAS.some((w) => lower.includes(w))) {
      return { valido: false, error: "Por favor ingresa tu nombre real para procesar el pedido." };
    }
    if (/(.)\1{3,}/i.test(limpio)) {
      return { valido: false, error: "El nombre contiene caracteres repetidos no válidos." };
    }
    return { valido: true, nombre: limpio };
  }

  async function consultarDni(dniInput) {
    const check = validarFormatoDni(dniInput);
    if (!check.valido) {
      return { ok: false, error: check.error };
    }

    const dni = check.dni;
    const cfg = window.SOL_BRASA_CONFIG.dniApi || {};

    // 1. Intentar consulta al endpoint serverless de Netlify (RENIEC real)
    if (cfg.endpoint) {
      try {
        const res = await fetch(`${cfg.endpoint}?dni=${encodeURIComponent(dni)}`, {
          headers: { Accept: "application/json" }
        });

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (res.ok && data.ok && data.nombreCompleto) {
            return {
              ok: true,
              dni,
              nombreCompleto: data.nombreCompleto,
              verificado: true,
              origen: "RENIEC"
            };
          }
          // Si devolvió 404 real de RENIEC, rechazar el DNI inexistente
          if (res.status === 404) {
            return {
              ok: false,
              error: data.error || "No se encontró ese DNI en RENIEC. Verifica los 8 dígitos."
            };
          }
        }
      } catch {
        // En servidor estático local (python http.server) cae aquí o devuelve 404 HTML
      }
    }

    // 2. Fallback demostración local (cuando aún no está conectado a Netlify + DNI_API_TOKEN)
    if (cfg.modoDemoLocal && DEMO_RENIEC[dni]) {
      return {
        ok: true,
        dni,
        nombreCompleto: DEMO_RENIEC[dni],
        verificado: true,
        origen: "DEMO"
      };
    }

    return {
      ok: false,
      fallbackManual: true,
      dni,
      error: "API RENIEC aún no conectada en este entorno local. Puedes probar con el DNI demo 72345678 o escribir tu nombre y apellido reales."
    };
  }

  return {
    validarFormatoDni,
    validarNombreReal,
    consultarDni,
    ejemplosDemo: Object.keys(DEMO_RENIEC)
  };
})();
