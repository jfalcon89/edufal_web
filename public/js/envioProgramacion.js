// Asignar el evento click al botón
document.getElementById('envioProgramacionBtn').addEventListener('click', enviarProgramacion);

// Función que notifica los atrasos
async function enviarProgramacion() {
    try {
        console.log("diste click enviar correo")

        const response = await fetch('/envioProgramacionRuta', { method: 'GET' });
        const message = await response.text();




    } catch (error) {
        console.error('Error al enviar las notificaciones:', error);
        // alert('Error al enviar las notificaciones.');
    }
}