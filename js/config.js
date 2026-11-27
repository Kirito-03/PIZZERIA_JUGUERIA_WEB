/**
 * Sol & Brasa - Configuración del Negocio
 * Edita aquí el número de WhatsApp, cuentas Yape/Plin, horarios, dirección y tarifas por distrito.
 */
window.SOL_BRASA_CONFIG = {
  nombreNegocio: "Sol & Brasa",
  subtitulo: "Juguería Natural & Pizzería a la Leña",
  // Formato internacional sin "+" ni espacios (Perú: 51 + 9 dígitos)
  telefonoWhatsApp: "51999888777",
  telefonoVisible: "+51 999 888 777",
  telefonoFijo: "(01) 445-9988",
  direccion: "Puerto Inca, Perú · Ubicación exacta en el mapa",
  referenciaLocal: "Dirección exacta por confirmar",
  pagos: {
    yapePlinNumero: "999 888 777",
    yapePlinTitular: "Sol & Brasa Gastronomía S.A.C.",
    yapePlinInstruccion: "Realiza tu Yape o Plin y adjunta la captura al abrir WhatsApp para iniciar tu pedido de inmediato."
  },
  dniApi: {
    // Al desplegar en Netlify, agrega la variable DNI_API_TOKEN (apis.net.pe / decolecta)
    endpoint: "/.netlify/functions/consultar-dni",
    modoDemoLocal: true
  },
  distritosDelivery: ["Puerto Inca"],
  tarifasDelivery: {},
  moneda: "S/",
  costoDeliveryBase: 5.00,
  montoDeliveryGratis: 50.00,
  tiempoEstimadoDia: "20 - 30 min",
  tiempoEstimadoNoche: "30 - 45 min",
  horarios: {
    jugueria: {
      inicio: 7,       // 07:00 a.m.
      fin: 17,         // 05:00 p.m.
      etiqueta: "07:00 a.m. - 05:00 p.m."
    },
    pizzeria: {
      inicio: 17,      // 05:00 p.m.
      fin: 23.5,       // 11:30 p.m.
      etiqueta: "05:00 p.m. - 11:30 p.m."
    }
  },
  mapsEmbedUrl: "https://maps.google.com/maps?q=-9.3788549%2C-74.9648422&t=k&z=18&output=embed",
  mapsLinkUrl: "https://maps.app.goo.gl/KBf6gwWxFdThZdmi7",
  redes: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com"
  }
};
