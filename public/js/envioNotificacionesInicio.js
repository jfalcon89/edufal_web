// Asignar el evento click al botón
document.getElementById('envioNotificacionesInicioBtn').addEventListener('click', envioNotificacionesInicio);

const id_curso = document.getElementById('id_curso').innerHTML;

// Función que notifica los atrasos
async function envioNotificacionesInicio() {
    try {
        console.log("diste click enviar correo")

        const response = await fetch(`/envioNotificacionesInicioRuta/${id_curso}`, { method: 'GET' });
        const message = await response.text();




    } catch (error) {
        console.error('Error al enviar las notificaciones:', error);
        // alert('Error al enviar las notificaciones.');
    }
}