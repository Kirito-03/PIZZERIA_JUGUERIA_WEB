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
  direccion: "Av. La Mar 1240, Miraflores, Lima - Perú",
  referenciaLocal: "A 2 cuadras del Óvalo Gutiérrez • Terraza pet-friendly",
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
  distritosDelivery: [
    "Miraflores",
    "San Isidro",
    "Surquillo",
    "Barranco",
    "San Borja",
    "Magdalena del Mar",
    "Jesús María",
    "Los Olivos"
  ],
  tarifasDelivery: {
    "Miraflores": 5.00,
    "Surquillo": 5.00,
    "San Isidro": 6.00,
    "Barranco": 6.50,
    "San Borja": 7.00,
    "Magdalena del Mar": 7.50,
    "Jesús María": 7.50,
    "Los Olivos": 9.00
  },
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
  mapsEmbedUrl: "https://www.openstreetmap.org/export/embed.html?bbox=-77.0535%2C-12.1180%2C-77.0395%2C-12.1085&layer=mapnik&marker=-12.1132%2C-77.0465",
  mapsLinkUrl: "https://www.google.com/maps/search/?api=1&query=Av.+La+Mar+1240,+Miraflores,+Lima+Peru",
  redes: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com"
  }
};
