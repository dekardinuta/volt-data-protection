/**
 * Lógica de negocio y persistencia
 */

function registrarLead(params, ip) {
  console.log('📝 === INICIANDO REGISTRO ===');
  console.log('📧 CONFIG.ADMIN_EMAIL:', CONFIG.ADMIN_EMAIL);
  console.log('📊 CONFIG.SHEET_ID:', CONFIG.SHEET_ID ? 'Configurado' : 'Vacío');
  
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheets = ss.getSheets();
    const sheet = sheets[0];
    
    console.log('📄 Hoja activa:', sheet.getName());

    // Registro en la hoja de cálculo
    sheet.appendRow([
      new Date(), 
      params.tipo || "No especificado", 
      params.specs || "No especificado", 
      params.urgencia || "Normal", 
      params.contacto || "No especificado",
      ip,
      CONFIG.ENV || 'production'
    ]);
    
    SpreadsheetApp.flush();
    console.log('✅ Datos guardados en Sheet');

    // Enviar email usando CONFIG.ADMIN_EMAIL
    console.log('📤 Enviando email a:', CONFIG.ADMIN_EMAIL);
    enviarNotificacionEmail(params, ip);
    console.log('✅ === PROCESO COMPLETADO ===');
    
  } catch (error) {
    console.error('❌ ERROR en registrarLead:', error.toString());
    throw error;
  }
}

function enviarNotificacionEmail(params, ip) {
  const asunto = `🚀 NUEVO LEAD: ${params.tipo} - Volt & Data`;
  const cuerpo = `Detalles de la solicitud técnica:
------------------------------------------
📌 TIPO: ${params.tipo}
📝 SPECS: ${params.specs || 'N/A'}
⚠️ URGENCIA: ${params.urgencia || 'Normal'}
📞 CONTACTO: ${params.contacto}
🌐 IP ORIGEN: ${ip}
🌍 ENTORNO: ${CONFIG.ENV}
------------------------------------------
Generado por el motor modular de Volt & Data.`;

  MailApp.sendEmail(CONFIG.ADMIN_EMAIL, asunto, cuerpo);
}
