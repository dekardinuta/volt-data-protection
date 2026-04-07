/**
 * Gestión de Peticiones HTTP
 */

function doGet(e) {
  try {
    // Servir el HTML completo con includes procesados
    const template = HtmlService.createTemplateFromFile('frontend/index');
    
    return template.evaluate()
      .setTitle('Volt & Data Protection | Ingeniería y Seguridad')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .addMetaTag('description', 'Ingeniería especializada en Seguridad Electrónica, Redes y Energía')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      
  } catch (error) {
    console.error('Error en doGet:', error);
    return ContentService.createTextOutput('Error: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
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

    // 4. ⚙️ PROCESAMIENTO
    registrarLead(params, ip);

    // 5. 🔒 ACTIVAR BLOQUEO
    cache.put(cacheKey, 'true', RATE_LIMIT_MINUTOS * 60);

    return jsonResponse({ result: 'success', message: MSG_SUCCESS });

  } catch (error) {
    console.error('Error en doPost:', error);
    return jsonResponse({ result: 'error', message: error.toString() });
  }
}

/**
 * Necesario para inyectar CSS/JS en el index.html
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Utilidad para normalizar respuestas JSON
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
