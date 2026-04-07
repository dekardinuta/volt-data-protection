/**
 * Gestión de Peticiones HTTP - Volt & Data Protection
 * Arquitectura Modular: Router
 */

function doGet(e) {
  try {
    // Servir el HTML completo con includes procesados
    const template = HtmlService.createTemplateFromFile('frontend/index');
    
    return template.evaluate()
      .setTitle('Volt & Data Protection | Ingeniería y Seguridad')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      
  } catch (error) {
    console.error('❌ Error en doGet:', error);
    return ContentService.createTextOutput('Error crítico de carga: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doPost(e) {
  try {
    // 1. 🔄 LECTURA HÍBRIDA (Compatibilidad GitHub Pages / Fetch)
    let params;
    if (e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents); // Origen: JSON Fetch (GitHub)
      } catch (err) {
        params = e.parameter; // Fallback: String no JSON
      }
    } else {
      params = e.parameter; // Origen: Formulario estándar / URL Query
    }

    // Definición de variables de contexto
    const ip = params.ip || "IP_no_detectada";
    const cache = CacheService.getScriptCache();
    const cacheKey = 'volt_' + ip.replace(/\s/g, '_');

    // 2. 🛡️ FILTRO 1: HONEYPOT (Anti-Spam)
    if (params.website && params.website !== "") {
      console.warn('🤖 Honeypot activado por IP:', ip);
      return jsonResponse({ result: 'success' }); // Retorno silencioso
    }

    // 3. ⏳ FILTRO 2: RATE LIMITING (Control de saturación)
    if (cache.get(cacheKey)) {
      return jsonResponse({ 
        result: 'error', 
        message: `Espera ${CONFIG.RATE_LIMIT_MINUTES} minutos antes de enviar otro reporte.` 
      });
    }

    // 4. ✅ FILTRO 3: VALIDACIÓN DE DATOS (Rigor Técnico)
    if (!params.tipo || !params.contacto) {
      return jsonResponse({ result: 'error', message: MESSAGES.ERROR_DATA });
    }

    // 5. ⚙️ PROCESAMIENTO (Capa de Negocio)
    // Se pasan los parámetros limpios a la API
    registrarLead(params, ip);

    // 6. 🔒 ACTIVAR BLOQUEO TEMPORAL
    // Evita duplicados inmediatos en la base de datos
    cache.put(cacheKey, 'true', CONFIG.RATE_LIMIT_MINUTES * 60);

    return jsonResponse({ result: 'success', message: MESSAGES.SUCCESS });

  } catch (error) {
    console.error('❌ Error fatal en doPost:', error.toString());
    return jsonResponse({ result: 'error', message: 'Falla interna: ' + error.toString() });
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
