# Sol & Brasa — Juguería Natural & Pizzería a la Leña (Web Dual)

Aplicación web comercial dual (**Modo Día: Juguería** / **Modo Noche: Pizzería al Horno de Leña**) con detección automática de hora de Perú (`America/Lima`), validación y autocompletado por **DNI peruano**, **ubicación GPS para delivery**, cálculo automático de vuelto, envío de pedidos ultra-detallados a **WhatsApp (`wa.me`)** y pantalla de confirmación/seguimiento.

## Estructura del Proyecto

```text
jugos-pizzas/
├── index.html                        # Interfaz principal (Desktop & Mobile First)
├── css/
│   ├── temas.css                     # Variables CSS para Modo Día y Modo Noche
│   ├── estilos.css                   # Layout, componentes, DNI/GPS, pagos, carrito y tracker
│   └── responsive.css                # Adaptación tablet, smartphone y barra inferior app
├── js/
│   ├── config.js                     # WhatsApp, Yape/Plin, horarios, tarifas por distrito
│   ├── productos.js                  # Catálogo de jugos, pizzas, combos y personalizadores
│   ├── horarios.js                   # Reloj en vivo de Perú (America/Lima) y turnos
│   ├── dni.js                        # Validación anti-broma y consulta de DNI peruano
│   ├── whatsapp.js                   # Ticket detallado para wa.me con DNI, GPS y vuelto
│   ├── carrito.js                    # Carrito persistente, tarifa por distrito y LocalStorage
│   └── app.js                        # Controlador UI, filtros, modales, GPS y checkout
├── netlify/
│   └── functions/
│       └── consultar-dni.js          # Función serverless para consultar RENIEC sin exponer tu token
├── img/                              # Activos visuales locales
├── netlify.toml                      # Configuración de publicación + Netlify Functions
└── README.md
```

## 1. Configurar WhatsApp y Yape / Plin

Edita `js/config.js`:
- `telefonoWhatsApp`: tu número en formato internacional sin `+` (Perú: `51` + 9 dígitos).
- `pagos.yapePlinNumero` y `pagos.yapePlinTitular`: datos reales de tu cuenta Yape/Plin.
- `tarifasDelivery`: costo de envío por cada distrito.

## 2. Conectar consulta real de DNI (RENIEC) en Netlify

El proyecto incluye `netlify/functions/consultar-dni.js` para consultar DNI de Perú de forma segura (sin exponer tu API Key en el navegador):

1. Sube la carpeta `jugos-pizzas/` a **Netlify** (conectando tu repositorio Git).
2. Obtén un token gratuito o de pago en **apis.net.pe** (o **decolecta.com**).
3. En Netlify → **Site configuration → Environment variables**, agrega:
   - `DNI_API_TOKEN` = tu token
   - (Opcional) `DNI_API_PROVIDER` = `apisnet` (por defecto) o `decolecta`
4. En pruebas locales (sin Netlify Functions), puedes probar el autocompletado con los DNIs demo: `72345678`, `45678912`, `41239876` o `70112233`.

## 3. Probar localmente

```bash
python3 -m http.server 8765
```

Abre `http://127.0.0.1:8765` en tu navegador.
