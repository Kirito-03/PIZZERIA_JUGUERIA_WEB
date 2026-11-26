/**
 * Netlify Serverless Function: Consulta Segura de DNI (Perú - RENIEC)
 *
 * Configura la variable de entorno DNI_API_TOKEN en Netlify (Site settings -> Environment variables).
 * Proveedor por defecto: apis.net.pe v2 (https://apis.net.pe/api-consulta-dni.html).
 * También puedes cambiar DNI_API_PROVIDER="decolecta" si prefieres ese proveedor.
 */
exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "private, max-age=3600"
  };

  const dni = ((event.queryStringParameters && event.queryStringParameters.dni) || "").trim();

  if (!/^\d{8}$/.test(dni)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        ok: false,
        error: "El DNI debe tener exactamente 8 dígitos numéricos."
      })
    };
  }

  const token = process.env.DNI_API_TOKEN;
  if (!token) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        ok: false,
        needsToken: true,
        error: "Falta configurar DNI_API_TOKEN en las variables de entorno de Netlify."
      })
    };
  }

  const provider = (process.env.DNI_API_PROVIDER || "apisnet").toLowerCase();
  const url =
    provider === "decolecta"
      ? `https://api.decolecta.com/v1/reniec/dni?numero=${dni}`
      : `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status === 404 ? 404 : 502,
        headers,
        body: JSON.stringify({
          ok: false,
          error: response.status === 404
            ? "No se encontró un ciudadano registrado con ese DNI."
            : "No se pudo consultar RENIEC en este momento."
        })
      };
    }

    const data = await response.json();
    const nombres = data.nombres || data.first_name || "";
    const apPaterno = data.apellidoPaterno || data.first_last_name || "";
    const apMaterno = data.apellidoMaterno || data.second_last_name || "";
    const nombreCompleto =
      data.nombreCompleto ||
      data.full_name ||
      [nombres, apPaterno, apMaterno].filter(Boolean).join(" ").trim();

    if (!nombreCompleto) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "El DNI no devolvió nombres válidos."
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        dni,
        nombreCompleto,
        nombres,
        apellidoPaterno: apPaterno,
        apellidoMaterno: apMaterno,
        verificado: true
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        error: "Error de conexión al consultar el servicio de DNI."
      })
    };
  }
};
