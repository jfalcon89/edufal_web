 // Fecha de finalización (Año, Mes (0-11), Día, Hora, Minuto, Segundo)
 //  var fechaFinal = new Date('2024-02-22T22:20:00');
 var fechaFinal = new Date(document.getElementById("fecha_oferta").innerHTML);
 //  var fechaFinal = document.getElementById("fecha_oferta").innerHTML;

 console.log(fechaFinal)

 // Actualiza el contador cada segundo
 var x = setInterval(function() {

     // Obtiene la fecha y hora actuales
     var ahora = new Date().getTime();

     // Calcula la diferencia entre la fecha final y la fecha actual
     var diferencia = fechaFinal - ahora;

     // Calcula los días, horas, minutos y segundos restantes
     var dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
     var horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
     var minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
     var segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

     // Muestra el resultado en el elemento con id="demo"
     document.getElementById("demo").innerHTML = "Faltan: " + dias + " Dia " + horas + " Hora " +
         minutos + " Minutos " + segundos + " Seg ";

     // Si el contador llega a cero, detenemos el intervalo
     if (diferencia < 0) {
         clearInterval(x);
         document.getElementById("demo").innerHTML = "Tiempo terminado";
     }
 }, 1000);