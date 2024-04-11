// // Fecha en formato "30/04/2024"
// const fechaString = document.getElementById("fecha_inicio").innerHTML;
// console.log(fechaString + ' fecha directa')

// var fechaFormateada = fechaString.split("/").reverse().join("-") + "T00:00:00";
// // Eliminar todos los espacios en blanco
// fechaFormateada = fechaFormateada.replace(/\s/g, '');

// // fecha completa
// var fechaObjeto = new Date(fechaFormateada);
// console.log(fechaObjeto + '' + ' fecha formateada final ');

// // Restar dos días a la fecha
// fechaObjeto.setDate(fechaObjeto.getDate() - 2);

// var fechaRestada = fechaObjeto.toString();

// // cadena de fecha
// var fechaFormateadaFinal = fechaRestada.toString();
// console.log(fechaFormateadaFinal + '' + ' fecha formateada a cadena ');

// var fechaFinal = new Date(fechaFormateadaFinal);
// console.log(fechaFinal + '' + ' fecha final ');


// // Obtiene la fecha y hora actuales
// var ahora = new Date().getTime();

// // Calcula la diferencia entre la fecha final y la fecha actual
// var diferencia = fechaFinal - ahora;

// console.log(diferencia + 'diferencia')

// // Calcula los días, horas, minutos y segundos restantes
// var dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
// var horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// var minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
// // var segundos = Math.floor((diferencia % (1000 * 60)) / 1000);


// // Si el contador llega a cero, detenemos el intervalo
// if (diferencia < 0) {
//     clearInterval(x);
//     document.getElementById("demo").innerHTML = "Enviar Notificacion";
// } else {
//     // Muestra el resultado en el elemento con id="demo"
//     document.getElementById("demo").innerHTML = "Faltan: " + dias + " Dia " + horas + " Hora " +
//         minutos + " Min ";
// }


// // Actualiza el contador cada segundo
// // var x = setInterval(function() {


// // }, 100000);