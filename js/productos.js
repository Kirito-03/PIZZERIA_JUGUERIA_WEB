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
    grupoUnico1: {
      titulo: "Estilo de Masa & Borde",
      obligatorio: true,
      opciones: [
        { id: "canotto", nombre: "Masa Tradicional Canotto (borde aireado 48h)", extra: 0 },
        { id: "fina", nombre: "Masa Fina Crocante estilo romano", extra: 0 },
        { id: "borde-ricota", nombre: "Borde Relleno de Ricota & Albahaca", extra: 6.00 }
      ]
    },
    grupoUnico2: null,
    extras: {
      titulo: "Adicionales de Autor",
      opciones: [
        { id: "miel-picante", nombre: "Miel Picante Artesanal (Hot Honey)", extra: 3.50 },
        { id: "extra-fior", nombre: "Extra Queso Mozzarella Fior di Latte", extra: 5.00 },
        { id: "prosciutto", nombre: "Prosciutto di Parma Reserva", extra: 8.00 },
        { id: "champinones", nombre: "Champiñones salteados al ajillo", extra: 4.50 },
        { id: "aceitunas", nombre: "Aceitunas negras de botija", extra: 3.00 }
      ]
    },
    placeholderNota: "Ej: Borde bien dorado, cortar en 8 porciones, orégano aparte..."
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

  // ===================== MODO NOCHE: PIZZERÍA A LA LEÑA =====================
  {
    id: "pizza-1",
    descripcionCorta: "Mozzarella, tomate y albahaca fresca.",
    nombre: "Napolitana Suprema Brasa",
    descripcion: "Masa madre 48h horneada a 450°C, pomodoro San Marzano DOP, mozzarella fior di latte ahumado, albahaca fresca y aceite de oliva virgen.",
    precio: 45.00,
    categoria: "Pizzas de Autor",
    turno: "Noche",
    tipo: "pizza",
    etiqueta: "La Más Pedida",
    rating: 4.95,
    resenas: 380,
    calorias: "Horno 450°C",
    tiempo: "25 min",
    destacado: true,
    imagen: "img/pizzas/napolitana-suprema.png",
    presentaciones: [
      { nombre: "Mediana (6 porciones · 28cm)", extra: 0 },
      { nombre: "Familiar (8 porciones · 35cm)", extra: 12.00 }
    ]
  },
  {
    id: "pizza-2",
    descripcionCorta: "Pepperoni, mozzarella y miel picante.",
    nombre: "Pepperoni & Miel Picante",
    descripcion: "Abundante pepperoni americano crocante en copas, mozzarella artesanal fundida y nuestro toque de miel pura con ají amarillo ahumado.",
    precio: 45.00,
    categoria: "Pizzas de Autor",
    turno: "Noche",
    tipo: "pizza",
    etiqueta: "Picor Dulce",
    rating: 5.0,
    resenas: 210,
    calorias: "Masa 48h",
    tiempo: "25 min",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediana (6 porciones · 28cm)", extra: 0 },
      { nombre: "Familiar (8 porciones · 35cm)", extra: 12.00 }
    ]
  },
  {
    id: "pizza-3",
    descripcionCorta: "Mozzarella, gorgonzola, parmesano y queso andino.",
    nombre: "Cuatro Quesos Brasa",
    descripcion: "Fusión cremosa de mozzarella fior di latte, gorgonzola italiano, parmesano reggiano de 18 meses y queso andino curado.",
    precio: 46.00,
    categoria: "Pizzas de Autor",
    turno: "Noche",
    tipo: "pizza",
    etiqueta: "Gorgonzola",
    rating: 4.8,
    resenas: 95,
    calorias: "Masa 48h",
    tiempo: "25 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediana (6 porciones · 28cm)", extra: 0 },
      { nombre: "Familiar (8 porciones · 35cm)", extra: 12.00 }
    ]
  },
  {
    id: "pizza-4",
    descripcionCorta: "Champiñones al ajillo, prosciutto y arúgula.",
    nombre: "Champiñones & Prosciutto",
    descripcion: "Champiñones frescos salteados al ajillo, finas lonchas de prosciutto di Parma añadidas post-horno y hojas tiernas de arúgula.",
    precio: 48.00,
    categoria: "Pizzas de Autor",
    turno: "Noche",
    tipo: "pizza",
    etiqueta: "Edición Chef",
    rating: 4.9,
    resenas: 112,
    calorias: "Masa 48h",
    tiempo: "25 min",
    destacado: true,
    imagen: "img/pizzas/champinones-prosciutto.jpg",
    presentaciones: [
      { nombre: "Mediana (6 porciones · 28cm)", extra: 0 },
      { nombre: "Familiar (8 porciones · 35cm)", extra: 14.00 }
    ]
  },
  {
    id: "pizza-5",
    descripcionCorta: "Tomate, mozzarella, jamón y orégano.",
    nombre: "Americana Suprema a la Leña",
    descripcion: "Salsa de tomates italianos horneados, abundante queso mozzarella fundido, jamón inglés ahumado y orégano de chacra.",
    precio: 36.00,
    categoria: "Pizzas Clásicas",
    turno: "Noche",
    tipo: "pizza",
    etiqueta: "Clásica",
    rating: 4.8,
    resenas: 260,
    calorias: "Horno Leña",
    tiempo: "20 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediana (6 porciones · 28cm)", extra: 0 },
      { nombre: "Familiar (8 porciones · 35cm)", extra: 10.00 }
    ]
  },
  {
    id: "pizza-6",
    descripcionCorta: "Jamón, piña caramelizada y mozzarella.",
    nombre: "Hawaiana Golden al Quebracho",
    descripcion: "Jamón inglés premium, trozos de piña Golden caramelizada al fuego de leña y generosa capa de mozzarella.",
    precio: 38.00,
    categoria: "Pizzas Clásicas",
    turno: "Noche",
    tipo: "pizza",
    etiqueta: "Dulce & Ahumado",
    rating: 4.7,
    resenas: 145,
    calorias: "Horno Leña",
    tiempo: "20 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Mediana (6 porciones · 28cm)", extra: 0 },
      { nombre: "Familiar (8 porciones · 35cm)", extra: 10.00 }
    ]
  },
  {
    id: "pizza-7",
    descripcionCorta: "Ricota, mozzarella, jamón y salsa de tomate.",
    nombre: "Calzone Relleno Tradición",
    descripcion: "Masa de leña doblada a mano y sellada con ricota fresca, mozzarella, jamón artesanal y espejo de salsa pomodoro.",
    precio: 36.00,
    categoria: "Calzones & Entradas",
    turno: "Noche",
    tipo: "entrada",
    etiqueta: "Masa Doblada",
    rating: 4.8,
    resenas: 78,
    calorias: "Individual Grande",
    tiempo: "22 min",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=700&q=80",
    presentaciones: [
      { nombre: "Individual Grande", extra: 0 },
      { nombre: "Doble Compartir", extra: 14.00 }
    ]
  },
  {
    id: "pizza-8",
    descripcionCorta: "Pan artesanal con ajo, orégano y mozzarella.",
    nombre: "Pan al Ajo Supremo a la Leña",
    descripcion: "Baguette artesanal tostado al fuego vivo con mantequilla de ajo confitado, orégano fresco y abundante mozzarella dorada.",
    precio: 18.00,
    categoria: "Calzones & Entradas",
    turno: "Noche",
    tipo: "entrada",
    etiqueta: "8 Rodajas",
    rating: 4.9,
    resenas: 240,
    calorias: "Para Compartir",
    tiempo: "12 min",
    destacado: false,
    imagen: "img/pizzas/pan-al-ajo.jpg",
    presentaciones: [
      { nombre: "Porción Clásica (8 rodajas)", extra: 0 },
      { nombre: "Porción Familiar (14 rodajas)", extra: 9.00 }
    ]
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
  },
  {
    id: "combo-noche-1",
    nombre: "Noche de Amigos Pizza",
    descripcion: "2 Pizzas Familiares a elección (Clásicas o Especiales) + 1 Pan al Ajo Supremo + 1 Bebida 1.5L helada.",
    precio: 68.00,
    precioAnterior: 90.00,
    ahorro: "MÁS VENDIDO",
    turno: "Noche",
    rinde: "Rinde 4 a 6 personas",
    imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "combo-noche-2",
    nombre: "Dúo Pizzero Artesanal",
    descripcion: "1 Pizza Mediana de Autor a elección + 1 Calzone Tradición o Pan al Ajo Supremo + 2 Jugos o Cervezas.",
    precio: 49.00,
    precioAnterior: 65.00,
    ahorro: "IDEAL PAREJAS",
    turno: "Noche",
    rinde: "Perfecto para 2",
    imagen: "img/pizzas/champinones-prosciutto.jpg"
  }
];
