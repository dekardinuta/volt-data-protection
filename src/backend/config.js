/**
 * CONFIGURACIÓN CENTRALIZADA - Volt & Data Protection
 * ZERO secrets hardcoded
 * Compatible con entornos Staging y Producción
 */

// Helper: Obtener propiedad de PropertiesService con validación
const getProp = (key, required = true) => {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value && required) {
    console.error(`❌ FATAL: Propiedad "${key}" no encontrada en PropertiesService`);
    console.error(`   Ve a GAS Editor → Project Settings → Script Properties`);
    throw new Error(`Configuración incompleta: ${key}`);
  }
  return value || null;
};

// Helper: Obtener número con fallback
const getNumber = (key, defaultValue) => {
  const val = getProp(key, false);
  return val ? parseInt(val) : defaultValue;
};

// CONFIGURACIÓN INMUTABLE (no se puede modificar después)
const CONFIG = Object.freeze({
  // Google Sheets IDs
  SHEET_ID: getProp('SHEET_ID'),
  
  // Contactos
  ADMIN_EMAIL: getProp('ADMIN_EMAIL'),
  
  // Límites y reintentos
  RATE_LIMIT_MINUTES: getNumber('RATE_LIMIT_MINUTES', 5),
  MAX_RETRY_ATTEMPTS: 3,
  
  // Identificación de entorno (staging/production)
  ENV: getProp('ENV', false) || 'production'
});

// MENSAJES ESTANDARIZADOS
const MESSAGES = Object.freeze({
  ERROR_DATA: 'Datos incompletos o formato incorrecto.',
  ERROR_CONFIG: 'Error de configuración del sistema. Contacte al administrador.',
  ERROR_RATE_LIMIT: 'Demasiadas solicitudes. Por favor espere unos minutos.',
  SUCCESS: 'Solicitud procesada con éxito.',
  NOT_FOUND: 'Recurso no encontrado.',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción.'
});

// Helper: Obtener email del usuario actual con fallback
const getCurrentUserEmail = () => {
  try {
    return Session.getEffectiveUser().getEmail();
  } catch (e) {
    console.warn('No se pudo obtener email de sesión, usando ADMIN_EMAIL como fallback');
    return CONFIG.ADMIN_EMAIL;
  }
};

// Exportar para testing local (Node.js/Jest)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, MESSAGES, getCurrentUserEmail };
}
