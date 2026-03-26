function doGet(e) {
  return ContentService.createTextOutput("Backend Volt & Data activo. Si ves esto, tu navegador está enviando un GET. Intenta limpiar la caché.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var params = e.parameter;
    var miCorreo = "***REMOVED***"; 
    
    var asunto = "🚀 NUEVO LEAD: " + (params.tipo || "Consulta") + " - Volt & Data";
    
    var mensaje = "Has recibido una nueva solicitud técnica:\n\n" +
                  "------------------------------------------\n" +
                  "📌 TIPO: " + params.tipo + "\n" +
                  "📝 SPECS: " + params.specs + "\n" +
                  "⚠️ URGENCIA: " + params.urgencia + "\n" +
                  "📞 CONTACTO: " + params.contacto + "\n" +
                  "------------------------------------------\n" +
                  "Enviado desde el portal Volt & Data Protection.";

    MailApp.sendEmail(miCorreo, asunto, mensaje);
    
    return ContentService.createTextOutput("SUCCESS")
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    return ContentService.createTextOutput("ERROR: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}