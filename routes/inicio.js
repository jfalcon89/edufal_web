const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


// //12 - Método para controlar que está auth en todas las páginas
router.get('/', async(req, res) => {

    const arrayCursosDB = await pool.query('SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.promocion = "Si";');

    // // Función para convertir la fecha al formato deseado
    // function formatoPersonalizado(fecha) {
    //     // Dividir la fecha en día, mes y año
    //     const [dia, mes, año] = fecha.split('/');
    //     // Crear un objeto Date con la fecha
    //     const fechaObj = new Date(`${año}-${mes}-${dia}`);
    //     // Días de la semana y meses en español
    //     const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    //     const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    //     // Obtener el nombre del día de la semana
    //     const nombreDiaSemana = diasSemana[fechaObj.getDay()];
    //     // Obtener el nombre del mes
    //     const nombreMes = meses[fechaObj.getMonth()];
    //     // Formatear la fecha como se desea
    //     const fechaFormateada = `${nombreDiaSemana} ${dia} De ${nombreMes}`;
    //     // Devolver el resultado
    //     return fechaFormateada;
    // }

    // // Fecha de ejemplo en formato dd/mm/yyyy
    // const fecha = arrayCursosDB[0].fecha_inicio;

    // // Aplicar el formato personalizado
    // const fechaFormateada = formatoPersonalizado(fecha);

    // // Imprimir el resultado
    // console.log(fechaFormateada); // Salida: Miércoles 18 De Diciembre



    // function obtenerInformacionFecha(fechaString) {
    //     // Divide la cadena de fecha en día, mes y año
    //     var partesFecha = fechaString.split('/');
    //     var dia = parseInt(partesFecha[0], 10);
    //     var mes = parseInt(partesFecha[1], 10) - 1; // Los meses en JavaScript van de 0 a 11
    //     var anio = parseInt(partesFecha[2], 10);

    //     // Crea un objeto de fecha
    //     var fecha = new Date(anio, mes, dia);

    //     // Obtiene el día de la semana (0 para domingo, 1 para lunes, etc.)
    //     var diaSemana = fecha.getDay();

    //     // Array con los nombres de los días de la semana
    //     var diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    //     // Array con los nombres de los meses
    //     var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    //     // Obtiene el nombre del día de la semana, del mes y el día del mes
    //     var nombreDiaSemana = diasSemana[diaSemana];
    //     var nombreMes = meses[mes];
    //     var diaMes = fecha.getDate();

    //     // Devuelve la información de la fecha
    //     return {
    //         diaSemana: nombreDiaSemana,
    //         mes: nombreMes,
    //         dia: diaMes
    //     };
    // }

    // // Ejemplo de uso
    // var fechaInput = arrayCursosDB[0].fecha_inicio.toLocaleString('es-ES', {
    //     timeZone: "America/Santo_Domingo"
    // }).slice(0, 10);
    // var informacionFechaResultante = obtenerInformacionFecha(fechaInput);
    // // console.log('Fecha: ' + fechaInput);
    // // console.log('Día de la semana: ' + informacionFechaResultante.diaSemana);
    // // console.log('Mes: ' + informacionFechaResultante.mes);
    // // console.log('Día del mes: ' + informacionFechaResultante.dia);

    // // horas de clases
    // var horasClases = arrayCursosDB[0].horasClases;

    // // Divide la cadena en intervalos de tiempo usando la coma como separador
    // var intervalosDeTiempo = horasClases.split(',');

    // // Variables para almacenar los horarios
    // var horario1, horario2;

    // // Itera sobre los intervalos de tiempo
    // intervalosDeTiempo.forEach(function(intervalo, indice) {
    //     // Trim para eliminar espacios en blanco al inicio y al final de cada intervalo
    //     var intervaloLimpio = intervalo.trim();

    //     // Asigna a las variables horario1 y horario2 en función del índice
    //     if (indice === 0) {
    //         horario1 = intervaloLimpio;
    //     } else if (indice === 1) {
    //         horario2 = intervaloLimpio;
    //     }

    //     // Puedes agregar más lógica aquí según sea necesario para índices adicionales
    // });

    // // Imprime los horarios almacenados
    // // console.log('Horario 1:', horario1);
    // // console.log('Horario 2:', horario2);

    // // dias de clases
    // var diasClases = arrayCursosDB[0].dias_semana_clases;

    // // Divide la cadena en intervalos de tiempo usando la coma como separador
    // var intervalosDeTiempo = diasClases.split(',');

    // // Variables para almacenar los horarios
    // var diaClase1, diaClase2, diaClase3;

    // // Itera sobre los intervalos de tiempo
    // intervalosDeTiempo.forEach(function(intervalo, indice) {
    //     // Trim para eliminar espacios en blanco al inicio y al final de cada intervalo
    //     var intervaloLimpio = intervalo.trim();

    //     // Asigna a las variables horario1 y horario2 en función del índice
    //     if (indice === 0) {
    //         diaClase1 = intervaloLimpio;
    //     } else if (indice === 1) {
    //         diaClase2 = intervaloLimpio;
    //     } else if (indice === 2) {
    //         diaClase3 = intervaloLimpio;
    //     }

    //     // Puedes agregar más lógica aquí según sea necesario para índices adicionales
    // });

    // // Imprime los horarios almacenados
    // // console.log('Dia clase 1:', diaClase1);
    // // console.log('Dia clase 2:', diaClase2);
    // // console.log('Dia clase 3:', diaClase3);

    // console.log(informacionFechaResultante.diaSemana)
    // console.log(informacionFechaResultante.mes)
    // console.log(informacionFechaResultante.dia)



    res.render('inicio', {
        arrayCursos: arrayCursosDB

        // diaSemana: informacionFechaResultante.diaSemana,
        // mes: informacionFechaResultante.mes,
        // dia: informacionFechaResultante.dia
    });

});





module.exports = router;