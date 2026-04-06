/**
 * Gestión de Peticiones HTTP
 */
function doGet(e) {
  // Si decides servir HTML en el futuro, usarías:
  // return HtmlService.createTemplateFromFile('src/frontend/index').evaluate();
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    version: '2.3-modular',
    environment: 'production'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = e.parameter;
    const ip = params.ip || "IP_no_detectada";
    const cache = CacheService.getScriptCache();
    const cacheKey = 'volt_' + ip.replace(/\s/g, '_');

    // 1. 🛡️ HONEYPOT
    if (params.website && params.website !== "") {
      return jsonResponse({ result: 'success' });
    }

    // 2. ⏳ RATE LIMITING
    if (cache.get(cacheKey)) {
      return jsonResponse({ 
        result: 'error', 
        message: `Espera ${RATE_LIMIT_MINUTOS} minutos.` 
      });
    }

    // 3. ✅ VALIDACIÓN
    if (!params.tipo || !params.contacto) {
      return jsonResponse({ result: 'error', message: MSG_ERROR_DATA });
    }

    // 4. ⚙️ PROCESAMIENTO (Llamada a api.js)
    registrarLead(params, ip);

    // 5. 🔒 ACTIVAR BLOQUEO
    cache.put(cacheKey, 'true', RATE_LIMIT_MINUTOS * 60);

    return jsonResponse({ result: 'success', message: MSG_SUCCESS });

  } catch (error) {
    return jsonResponse({ result: 'error', message: error.toString() });
  }
}

/**
 * Utilidad para normalizar respuestas JSON
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Necesario para inyectar CSS/JS en el index.html
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
