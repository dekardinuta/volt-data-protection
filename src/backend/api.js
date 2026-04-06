/**
 * Lógica de negocio y persistencia
 */
function registrarLead(params, ip) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets(); // Acceso directo a la primera pestaña
  
  // Registro en la hoja de cálculo
  sheet.appendRow([
    new Date(), 
    params.tipo || "TEST", 
    params.specs || "TEST", 
    params.urgencia || "TEST", 
    params.contacto || "TEST",
    ip
  ]);
  
  SpreadsheetApp.flush();
  enviarNotificacionEmail(params, ip);
}

function enviarNotificacionEmail(params, ip) {
  const asunto = "🚀 NUEVO LEAD: " + params.tipo + " - Volt & Data";
  const cuerpo = `Detalles de la solicitud técnica:
------------------------------------------
📌 TIPO: ${params.tipo}
📝 SPECS: ${params.specs || 'N/A'}
⚠️ URGENCIA: ${params.urgencia || 'Normal'}
📞 CONTACTO: ${params.contacto}
🌐 IP ORIGEN: ${ip}
------------------------------------------
Generado por el motor modular de Volt & Data.`;

  MailApp.sendEmail(MI_CORREO, asunto, cuerpo);
}
