/**
 * Sol & Brasa - Catálogo Completo de Productos, Combos y Personalizadores
 * Soporta Modo Día (Juguería) y Modo Noche (Pizzería al Horno de Leña).
 */
window.SOL_BRASA_PERSONALIZACION = {
  jugo: {
    grupoUnico1: {
      titulo: "Nivel de Endulzante",
      obligatorio: true,
      opciones: [
        { id: "sin-azucar", nombre: "Sin azúcar (100% fruta natural)", extra: 0 },
        { id: "stevia", nombre: "Con Stevia orgánica", extra: 0 },
        { id: "azucar-rubia", nombre: "Azúcar rubia ligera", extra: 0 },
        { id: "miel", nombre: "Miel de abeja andina", extra: 1.50 }
      ]
    },
    grupoUnico2: {
      titulo: "Temperatura & Base",
      obligatorio: false,
      opciones: [
        { id: "frio-normal", nombre: "Frío normal (con poco hielo)", extra: 0 },
        { id: "sin-hielo", nombre: "Al tiempo / Sin hielo", extra: 0 },
        { id: "leche-almendras", nombre: "Base de leche de almendras", extra: 2.50 }
      ]
    },
    extras: {
      titulo: "Superfoods & Adicionales",
      opciones: [
        { id: "chia", nombre: "Semillas de chía orgánica", extra: 2.00 },
        { id: "algarrobina", nombre: "Toque de algarrobina piurana", extra: 2.00 },
        { id: "granola", nombre: "Topping de granola artesanal", extra: 2.50 },
        { id: "proteina", nombre: "Scoop de proteína Whey vainilla", extra: 5.00 }
      ]
    },
    placeholderNota: "Ej: Bien espeso, hielo aparte, sin menta..."
  },
  bowl: {
    grupoUnico1: {
      titulo: "Endulzante Natural",
      obligatorio: true,
      opciones: [
        { id: "miel-incluida", nombre: "Miel de abeja andina (incluida)", extra: 0 },
        { id: "sin-endulzante", nombre: "Sin miel / Solo fruta fresca", extra: 0 },
        { id: "algarrobina-bowl", nombre: "Algarrobina orgánica", extra: 1.00 }
      ]
    },
    grupoUnico2: null,
    extras: {
      titulo: "Toppings Artesanales",
      opciones: [
        { id: "yogurt-griego", nombre: "Yogurt griego natural", extra: 3.00 },
        { id: "mantequilla-mani", nombre: "Mantequilla de maní crocante", extra: 3.00 },
        { id: "extra-granola", nombre: "Extra granola con almendras", extra: 2.50 },
        { id: "coco-rallado", nombre: "Láminas de coco tostado", extra: 2.00 }
      ]
    },
    placeholderNota: "Ej: Sin plátano, granola aparte..."
  },
  snack: {
    grupoUnico1: {
      titulo: "Tipo de Pan",
      obligatorio: true,
      opciones: [
        { id: "pan-molde", nombre: "Pan de molde artesanal suave", extra: 0 },
        { id: "pan-integral", nombre: "Pan integral con semillas", extra: 1.00 }
      ]
    },
    grupoUnico2: null,
    extras: {
      titulo: "Extras & Salsas",
      opciones: [
        { id: "extra-palta", nombre: "Doble porción de palta fuerte", extra: 3.00 },
        { id: "salsa-casa", nombre: "Salsa de hierbas de la casa", extra: 0 },
        { id: "aji-amarillo", nombre: "Crema de ají amarillo suave", extra: 0 }
      ]
    },
    placeholderNota: "Ej: Sin mayonesa, bien tostado..."
  },
  pizza: {
    grupoUnico1: null,
    grupoUnico2: null,
    extras: null,
    placeholderNota: "Ej: indicaciones para la cocina..."
  },
  entrada: {
    grupoUnico1: {
      titulo: "Salsa de Acompañamiento",
      obligatorio: true,
      opciones: [
        { id: "pomodoro", nombre: "Salsa Pomodoro San Marzano", extra: 0 },
        { id: "alioli", nombre: "Alioli de ajo rostizado", extra: 0 },
        { id: "pesto", nombre: "Pesto genovés artesanal", extra: 2.50 }
      ]
    },
    grupoUnico2: null,
    extras: {
      titulo: "Complementos",
      opciones: [
        { id: "extra-mozzarella", nombre: "Gratinado extra mozzarella", extra: 4.00 },
        { id: "tocino-crocante", nombre: "Trozos de tocino ahumado", extra: 4.50 }
      ]
    },
    placeholderNota: "Ej: Bien crocante, salsa aparte..."
  }
};

window.SOL_BRASA_PRODUCTOS = [
  // ===================== MODO DÍA: JUGUERÍA =====================
  {
    id: "jugo-1",
    descripcionCorta: "Mango, piña, naranja y menta.",
    nombre: "Tropical Boost Special",
    descripcion: "Mango Kent, piña Golden madura, naranja de Huando recién exprimida y menta fresca. 100% fruta natural.",
    precio: 12.00,
    categoria: "Jugos Especiales",
    turno: "Día",
    tipo: "jugo",
    etiqueta: "Más Pedido",
    rating: 4.9,
    resenas: 215,
    calorias: "190 kcal",
    tiempo: "10 min",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediano (16 oz)", extra: 0 },
      { nombre: "Grande (24 oz)", extra: 3.00 }
    ]
  },
  {
    id: "jugo-2",
    descripcionCorta: "Plátano, papaya, piña, beterraga, algarrobina, huevo y leche.",
    nombre: "Jugo Especial de la Casa",
    descripcion: "Clásico nutritivo limeño: plátano de seda, papaya, piña, beterraga, algarrobina piurana, huevo y leche fresca.",
    precio: 12.50,
    categoria: "Jugos Especiales",
    turno: "Día",
    tipo: "jugo",
    etiqueta: "Energía Total",
    rating: 4.9,
    resenas: 310,
    calorias: "310 kcal",
    tiempo: "10 min",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediano (16 oz)", extra: 0 },
      { nombre: "Grande (24 oz)", extra: 3.00 }
    ]
  },
  {
    id: "jugo-3",
    descripcionCorta: "Arándanos, fresas, frambuesas, chía y miel.",
    nombre: "Wild Berry Antioxidant",
    descripcion: "Arándanos peruanos, fresas frescas de Huacho, frambuesas, chía hidratada y un toque de miel andina.",
    precio: 13.50,
    categoria: "Batidos & Detox",
    turno: "Día",
    tipo: "jugo",
    etiqueta: "Antioxidante",
    rating: 5.0,
    resenas: 164,
    calorias: "215 kcal",
    tiempo: "10 min",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediano (16 oz)", extra: 0 },
      { nombre: "Grande (24 oz)", extra: 3.50 }
    ]
  },
  {
    id: "jugo-4",
    descripcionCorta: "Fresas, leche y un toque de vainilla.",
    nombre: "Fresa con Leche Cremoso",
    descripcion: "Fresas seleccionadas licuadas al instante con leche entera cremosa y un sutil toque de vainilla natural.",
    precio: 10.50,
    categoria: "Jugos Especiales",
    turno: "Día",
    tipo: "jugo",
    etiqueta: "Favorito",
    rating: 4.8,
    resenas: 198,
    calorias: "250 kcal",
    tiempo: "8 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediano (16 oz)", extra: 0 },
      { nombre: "Grande (24 oz)", extra: 3.00 }
    ]
  },
  {
    id: "jugo-5",
    descripcionCorta: "Papaya, piña, plátano y naranja.",
    nombre: "Surtido Clásico Limeño",
    descripcion: "Equilibrio perfecto de papaya dulce, piña Golden, plátano de seda y zumo de naranja recién exprimida.",
    precio: 8.50,
    categoria: "Jugos Naturales",
    turno: "Día",
    tipo: "jugo",
    etiqueta: "Clásico",
    rating: 4.8,
    resenas: 276,
    calorias: "175 kcal",
    tiempo: "8 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediano (16 oz)", extra: 0 },
      { nombre: "Grande (24 oz)", extra: 2.50 }
    ]
  },
  {
    id: "jugo-6",
    descripcionCorta: "Espinaca, manzana, pepino, kion, apio y limón.",
    nombre: "Batido Verde Detox Vitality",
    descripcion: "Espinaca baby orgánica, manzana verde, pepino fresco, kion rallado, apio y zumo de limón peruano.",
    precio: 11.00,
    categoria: "Batidos & Detox",
    turno: "Día",
    tipo: "jugo",
    etiqueta: "Cold-Pressed",
    rating: 4.7,
    resenas: 128,
    calorias: "130 kcal",
    tiempo: "10 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Botella 16 oz", extra: 0 },
      { nombre: "Botella 24 oz", extra: 3.00 }
    ]
  },
  {
    id: "jugo-7",
    descripcionCorta: "Fruta fresca con miel y granola.",
    nombre: "Ensalada Juicy Bowl Suprema",
    descripcion: "Papaya, melón, piña, plátano, fresa, uvas y kiwi bañados en miel de abeja andina con granola artesanal.",
    precio: 14.50,
    categoria: "Bowls & Ensaladas",
    turno: "Día",
    tipo: "bowl",
    etiqueta: "Fruta de Estación",
    rating: 4.9,
    resenas: 142,
    calorias: "280 kcal",
    tiempo: "12 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Bowl Individual", extra: 0 },
      { nombre: "Bowl Para Compartir", extra: 6.00 }
    ]
  },
  {
    id: "jugo-8",
    descripcionCorta: "Palta, huevo y mayonesa de la casa.",
    nombre: "Triple Clásico Palta & Huevo",
    descripcion: "Pan de molde artesanal súper suave con láminas de palta fuerte madura, huevo duro y mayonesa de la casa.",
    precio: 7.50,
    categoria: "Triples & Snacks",
    turno: "Día",
    tipo: "snack",
    etiqueta: "Recién Hecho",
    rating: 4.8,
    resenas: 185,
    calorias: "340 kcal",
    tiempo: "8 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Porción Regular (2 unid.)", extra: 0 },
      { nombre: "Porción Doble (4 unid.)", extra: 6.50 }
    ]
  },

  // ===================== CARTA DE PIZZAS DE LAS FOTOS =====================
  {
    id: "menu-pizza-1", nombre: "Americana",
    descripcionCorta: "Jamón y queso.", descripcion: "Jamón y queso. Incluye pan al ajo.",
    precio: 17, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: true, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 10 }, { nombre: "Familiar", extra: 28 }]
  },
  {
    id: "menu-pizza-2", nombre: "Hawaiana",
    descripcionCorta: "Jamón, piña y queso.", descripcion: "Jamón, piña y queso. Incluye pan al ajo.",
    precio: 20, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 13 }, { nombre: "Familiar", extra: 30 }]
  },
  {
    id: "menu-pizza-3", nombre: "Peperoni",
    descripcionCorta: "Jamón, peperoni y queso.", descripcion: "Jamón, peperoni y queso. Incluye pan al ajo.",
    precio: 20, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 13 }, { nombre: "Familiar", extra: 30 }]
  },
  {
    id: "menu-pizza-4", nombre: "Regional",
    descripcionCorta: "Chorizo, cecina, jamón y queso.", descripcion: "Chorizo, cecina, jamón y queso. Incluye pan al ajo.",
    precio: 20, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 13 }, { nombre: "Familiar", extra: 30 }]
  },
  {
    id: "menu-pizza-5", nombre: "Chorizo ahumado",
    descripcionCorta: "Jamón, chorizo ahumado y queso.", descripcion: "Jamón, chorizo ahumado y queso. Incluye pan al ajo.",
    precio: 20, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 13 }, { nombre: "Familiar", extra: 30 }]
  },
  {
    id: "menu-pizza-6", nombre: "Oxapampina",
    descripcionCorta: "Chorizo, cecina, jamón, carne de res y queso.", descripcion: "Chorizo, cecina, jamón, carne de res y queso. Incluye pan al ajo.",
    precio: 28, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 15 }, { nombre: "Familiar", extra: 37 }]
  },
  {
    id: "menu-pizza-7", nombre: "Continental",
    descripcionCorta: "Champiñón, pimiento y queso.", descripcion: "Champiñón, pimiento y queso. Incluye pan al ajo.",
    precio: 20, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 13 }, { nombre: "Familiar", extra: 30 }]
  },
  {
    id: "menu-pizza-8", nombre: "Trujillana",
    descripcionCorta: "Champiñón, aceituna, pimiento, queso y jamón.", descripcion: "Champiñón, aceituna, pimiento, queso y jamón. Incluye pan al ajo.",
    precio: 20, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 13 }, { nombre: "Familiar", extra: 30 }]
  },
  {
    id: "menu-pizza-9", nombre: "Italiana",
    descripcionCorta: "Carne, jamón, cecina y queso.", descripcion: "Carne, jamón, cecina y queso. Incluye pan al ajo.",
    precio: 25, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 15 }, { nombre: "Familiar", extra: 35 }]
  },
  {
    id: "menu-pizza-10", nombre: "Suprema",
    descripcionCorta: "Queso, carne, peperoni, cebolla y pimiento.", descripcion: "Queso, carne, peperoni, cebolla y pimiento. Incluye pan al ajo.",
    precio: 22, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 13 }, { nombre: "Familiar", extra: 33 }]
  },
  {
    id: "menu-pizza-11", nombre: "Vegetariana",
    descripcionCorta: "Queso, champiñón, pimiento y cebolla.", descripcion: "Queso, champiñón, pimiento y cebolla. Incluye pan al ajo.",
    precio: 20, categoria: "Pizzas", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 15 }, { nombre: "Familiar", extra: 30 }]
  },
  {
    id: "menu-pizza-12", nombre: "2 estaciones",
    descripcionCorta: "Americana y hawaiana.", descripcion: "Americana y hawaiana. Incluye pan al ajo.",
    precio: 20, categoria: "Especiales", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Personal", extra: 0 }, { nombre: "Mediana", extra: 13 }, { nombre: "Familiar", extra: 30 }]
  },
  {
    id: "menu-pizza-13", nombre: "4 estaciones súper familiar",
    descripcionCorta: "Americana, hawaiana, peperoni y regional. Incluye pan al ajo.", descripcion: "Americana, hawaiana, peperoni y regional. Incluye pan al ajo.",
    precio: 50, categoria: "Especiales", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Súper familiar", extra: 0 }]
  },
  {
    id: "menu-pizza-14", nombre: "4 estaciones carnívora",
    descripcionCorta: "Italiana, suprema, chorizo ahumado y oxapampina. Incluye pan al ajo.", descripcion: "Italiana, suprema, chorizo ahumado y oxapampina. Incluye pan al ajo.",
    precio: 60, categoria: "Especiales", turno: "Noche", tipo: "pizza",
    etiqueta: "", destacado: false, imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [{ nombre: "Presentación única", extra: 0 }]
  }
];

window.SOL_BRASA_COMBOS = [
  {
    id: "combo-dia-1",
    nombre: "Combo Mañanero Dúo",
    descripcion: "2 Jugos Especiales (Fresa con Leche + Surtido Clásico) + 2 Triples clásicos de palta y huevo.",
    precio: 25.50,
    precioAnterior: 32.00,
    ahorro: "-20% OFF",
    turno: "Día",
    rinde: "Ideal 2 personas",
    imagen: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "combo-dia-2",
    nombre: "Pack Detox & Bowl Energía",
    descripcion: "1 Tropical Boost 24oz + 1 Batido Verde Detox + 1 Ensalada Juicy Bowl con granola artesanal.",
    precio: 32.90,
    precioAnterior: 40.50,
    ahorro: "AHORRAS S/ 7.60",
    turno: "Día",
    rinde: "Energía completa",
    imagen: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=700&q=80"
  }
];
