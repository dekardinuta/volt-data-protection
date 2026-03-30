/**
 * Volt & Data Protection - Backend v2.2 (Referencia Explícita)
 * Sincronizado con hoja: "Leads"
 */

// --- CONFIGURACIÓN SEGURA ---
// Extraemos el ID desde las Propiedades del Script (entorno seguro de Google)
var SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('MY_SHEET_ID'); 
var MI_CORREO = Session.getEffectiveUser().getEmail();
var RATE_LIMIT_MINUTOS = 5;

function doPost(e) {
  try {
    var params = e.parameter;
    
    // 1. 🛡️ HONEYPOT: Si el bot llenó el campo oculto, salimos silenciosamente
    if (params.website && params.website !== "") {
      return ContentService.createTextOutput(JSON.stringify({
        result: 'success'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. ⏳ RATE LIMITING: Evitar múltiples envíos seguidos desde la misma IP
    var cache = CacheService.getScriptCache();
    var ip = params.ip || "IP_no_detectada";
    var cacheKey = 'volt_' + ip.replace(/\s/g, '_');
    
    if (cache.get(cacheKey)) {
      return ContentService.createTextOutput(JSON.stringify({
        result: 'error',
        message: 'Por favor espera ' + RATE_LIMIT_MINUTOS + ' minutos entre solicitudes.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 3. ✅ VALIDACIÓN: Asegurar que los datos críticos existan
    if (!params.tipo || !params.contacto) {
      return ContentService.createTextOutput(JSON.stringify({
        result: 'error',
        message: 'Datos incompletos.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 4. 📊 GOOGLE SHEETS: Registro en la pestaña específica "Leads"
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Leads"); // <--- Ajuste para tu pestaña renombrada
    
    if (!sheet) {
      // Si por alguna razón no la encuentra, intenta en la primera
      sheet = ss.getSheets();
    }
    
    sheet.appendRow([
      new Date(),           // Columna A: Fecha
      params.tipo,          // Columna B: Servicio
      params.specs || '',   // Columna C: Detalle técnico
      params.urgencia || '',// Columna D: Prioridad
      params.contacto,      // Columna E: WhatsApp/Mail
      ip                    // Columna F: Auditoría IP
    ]);

    // 5. 📧 EMAIL: Notificación inmediata de lead calificado
    var asunto = "🚀 NUEVO LEAD: " + params.tipo + " - Volt & Data";
    var cuerpo = "Detalles de la solicitud técnica:\n" +
                 "------------------------------------------\n" +
                 "📌 TIPO: " + params.tipo + "\n" +
                 "📝 SPECS: " + (params.specs || 'N/A') + "\n" +
                 "⚠️ URGENCIA: " + (params.urgencia || 'Normal') + "\n" +
                 "📞 CONTACTO: " + params.contacto + "\n" +
                 "🌐 IP ORIGEN: " + ip + "\n" +
                 "------------------------------------------\n" +
                 "Generado automáticamente por el motor de Volt & Data.";

    MailApp.sendEmail(MI_CORREO, asunto, cuerpo);
    
    // 6. 🔒 ACTIVAR BLOQUEO TEMPORAL (Anti-Spam)
    cache.put(cacheKey, 'true', RATE_LIMIT_MINUTOS * 60);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Solicitud procesada con éxito'
    })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Error interno: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    version: '2.2-leads-fix'
  })).setMimeType(ContentService.MimeType.JSON);
}
