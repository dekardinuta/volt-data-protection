document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue
    
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = "Enviando...";
    btn.disabled = true;

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Aquí conectaremos la URL de tu Google Apps Script más adelante
    console.log("Datos capturados para ingeniería:", data);
    
    // Simulación de envío (esto lo cambiaremos por un fetch real)
    setTimeout(() => {
        alert("Solicitud enviada con éxito. Un ingeniero se contactará con usted.");
        btn.innerText = originalText;
        btn.disabled = false;
        this.reset();
    }, 1500);
});
