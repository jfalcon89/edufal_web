// Asignar el evento click al botón 100% OFF
document.getElementById('envioProgramacionCursosGratisBtn').addEventListener('click', envioProgramacionCursosGratis);

// Función que notifica los atrasos
async function envioProgramacionCursosGratis() {
    try {
        console.log("diste click enviar correo")

        const response = await fetch('/envioProgramacionCursosGratisRuta', { method: 'GET' });
        const message = await response.text();




    } catch (error) {
        console.error('Error al enviar las notificaciones:', error);
        // alert('Error al enviar las notificaciones.');
    }
}