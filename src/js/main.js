// 1. La URL de tu motor de ingeniería en Google
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzEFzIxmx-Lwv14LPyA5iHkWLmKdRfBhPDS1R0bfida_rvKYkbxJ-tXreNLRAOkFgv8jg/exec";

document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    
    // Feedback visual para el cliente
    btn.innerText = "ENVIANDO SOLICITUD...";
    btn.disabled = true;

    // 2. Preparar los datos para el envío
    const formData = new FormData(this);

    // 3. Envío REAL a Google Apps Script
    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Crucial para evitar bloqueos de seguridad de Google
        body: new URLSearchParams(formData)
    })
    .then(() => {
        // Éxito: El correo ya va en camino a tu bandeja
        alert("¡Recibido! Un ingeniero de Volt & Data revisará su caso a la brevedad.");
        this.reset();
    })
    .catch(error => {
        console.error('Error de red:', error);
        alert("Hubo un problema de conexión. Por favor, contáctenos por WhatsApp.");
    })
    .finally(() => {
        // Restaurar el botón pase lo que pase
        btn.innerText = originalText;
        btn.disabled = false;
    });
});
