const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


// //12 - Método para controlar que está auth en todas las páginas
router.get('/cursos_talleres', async(req, res) => {

    let sesiones
    const arrayCursosDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" `);

    res.render('cursos_talleres', {
        arrayCursos: arrayCursosDB,
        sesiones
    });

});



// VER CURSO / TALLER
router.get("/cursos_talleres/ver_curso_taller/:id", async(req, res) => {
    const curso = req.params.id
    let sesiones

    console.log('titulo curso params ' + curso)

    const cursoDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.titulo_curso = "${curso}" `);
    const contenidoCursoDB = await pool.query(`SELECT * FROM modulos, cursos where cursos.titulo_curso = "${curso}" and  modulos.id_curso = cursos.id_curso;`);
    const maestroDB = await pool.query(`SELECT * FROM maestros WHERE maestros.id_maestro = ${cursoDB[0].id_maestro}`);

    // calculo porcentaje oferta inicio
    let porcentajeOferta = cursoDB[0].porcentaje_descuento - 1
    let precioRegular = cursoDB[0].costo;
    let resultadoPrecio = precioRegular * porcentajeOferta

    console.log('Precio Precio Regular' + cursoDB[0].costo)
    console.log('Precio Oferta' + Math.abs(resultadoPrecio))
    console.log('Cantidad Cuotas' + cursoDB[0].cantidad_cuota)
    console.log('Monto Cuotas' + Math.abs(resultadoPrecio) / cursoDB[0].cantidad_cuota)

    function obtenerInformacionFecha(fechaString) {
        // Divide la cadena de fecha en día, mes y año
        var partesFecha = fechaString.split('/');
        var dia = parseInt(partesFecha[0], 10);
        var mes = parseInt(partesFecha[1], 10) - 1; // Los meses en JavaScript van de 0 a 11
        var anio = parseInt(partesFecha[2], 10);

        // Crea un objeto de fecha
        var fecha = new Date(anio, mes, dia);

        // Obtiene el día de la semana (0 para domingo, 1 para lunes, etc.)
        var diaSemana = fecha.getDay();

        // Array con los nombres de los días de la semana
        var diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        // Array con los nombres de los meses
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        // Obtiene el nombre del día de la semana, del mes y el día del mes
        var nombreDiaSemana = diasSemana[diaSemana];
        var nombreMes = meses[mes];
        var diaMes = fecha.getDate();

        // Devuelve la información de la fecha
        return {
            diaSemana: nombreDiaSemana,
            mes: nombreMes,
            dia: diaMes
        };
    }

    // Ejemplo de uso
    var fechaInput = cursoDB[0].fecha_inicio.toLocaleString('es-ES', {
        timeZone: "America/Santo_Domingo"
    }).slice(0, 10);
    var informacionFechaResultante = obtenerInformacionFecha(fechaInput);
    // console.log('Fecha: ' + fechaInput);
    // console.log('Día de la semana: ' + informacionFechaResultante.diaSemana);
    // console.log('Mes: ' + informacionFechaResultante.mes);
    // console.log('Día del mes: ' + informacionFechaResultante.dia);

    // horas de clases
    var horasClases = cursoDB[0].horasClases;

    // Divide la cadena en intervalos de tiempo usando la coma como separador
    var intervalosDeTiempo = horasClases.split(',');

    // Variables para almacenar los horarios
    var horario1, horario2;

    // Itera sobre los intervalos de tiempo
    intervalosDeTiempo.forEach(function(intervalo, indice) {
        // Trim para eliminar espacios en blanco al inicio y al final de cada intervalo
        var intervaloLimpio = intervalo.trim();

        // Asigna a las variables horario1 y horario2 en función del índice
        if (indice === 0) {
            horario1 = intervaloLimpio;
        } else if (indice === 1) {
            horario2 = intervaloLimpio;
        }

        // Puedes agregar más lógica aquí según sea necesario para índices adicionales
    });

    // Imprime los horarios almacenados
    // console.log('Horario 1:', horario1);
    // console.log('Horario 2:', horario2);

    // dias de clases
    var diasClases = cursoDB[0].dias_semana_clases;

    // Divide la cadena en intervalos de tiempo usando la coma como separador
    var intervalosDeTiempo = diasClases.split(',');

    // Variables para almacenar los horarios
    var diaClase1, diaClase2, diaClase3;

    // Itera sobre los intervalos de tiempo
    intervalosDeTiempo.forEach(function(intervalo, indice) {
        // Trim para eliminar espacios en blanco al inicio y al final de cada intervalo
        var intervaloLimpio = intervalo.trim();

        // Asigna a las variables horario1 y horario2 en función del índice
        if (indice === 0) {
            diaClase1 = intervaloLimpio;
        } else if (indice === 1) {
            diaClase2 = intervaloLimpio;
        } else if (indice === 2) {
            diaClase3 = intervaloLimpio;
        }

        // Puedes agregar más lógica aquí según sea necesario para índices adicionales
    });

    // Imprime los horarios almacenados
    // console.log('Dia clase 1:', diaClase1);
    // console.log('Dia clase 2:', diaClase2);
    // console.log('Dia clase 3:', diaClase3);




    res.render('ver-curso-taller', {
        curso: cursoDB[0],
        contenidoCurso: contenidoCursoDB,
        maestro: maestroDB[0],
        precioRegular: cursoDB[0].costo,
        precioOferta: Math.abs(resultadoPrecio),
        cantidadCuotas: cursoDB[0].cantidad_cuota,
        montoCuotas: Math.abs(resultadoPrecio) / cursoDB[0].cantidad_cuota,
        porcentaje_descuento: cursoDB[0].porcentaje_descuento,
        diaSemana: informacionFechaResultante.diaSemana,
        mes: informacionFechaResultante.mes,
        dia: informacionFechaResultante.dia,
        horario1,
        horario2,
        diaClase1,
        diaClase2,
        diaClase3,
        sesiones


    });

});

//INSERTAR INSCRIPCION
router.post("/cursos_talleres/ver_curso_taller/:id", async(req, res) => {
    const curso = req.params.id;

    const {
        id_curso,
        precioOferta_inscripcion,
        fecha_inicio_inscripcion,
        promocion_inscripcion,
        oferta_inscripcion_inscripcion,
        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        telefono,
        correo_electronico,
        pais
    } = req.body;

    const nuevaInscripcion = {
        id_curso,
        precioOferta_inscripcion,
        fecha_inicio_inscripcion,
        promocion_inscripcion,
        oferta_inscripcion_inscripcion,
        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        telefono,
        correo_electronico,
        pais
    };

    const nuevoEstudiante = {
        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        telefono,
        correo_electronico,
        pais
    };

    // console.log('NUEVO ESTUDIANTE ' + nuevoEstudiante.cedula);

    const cursoDB = await pool.query(`SELECT * FROM cursos, modulos WHERE cursos.estado_curso = "Activo" AND cursos.titulo_curso = "${curso}"`);
    const contenidoCursoDB = await pool.query(`SELECT * FROM modulos WHERE modulos.id_curso = "${id_curso}"`);
    const maestroDB = await pool.query(`SELECT * FROM maestros WHERE maestros.id_maestro = ${cursoDB[0].id_maestro}`);

    // calculo porcentaje oferta inicio
    let porcentajeOferta = cursoDB[0].porcentaje_descuento - 1
    let precioRegular = cursoDB[0].costo;
    let resultadoPrecio = precioRegular * porcentajeOferta

    // console.log('Precio Precio Regular' + cursoDB[0].costo)
    // console.log('Precio Oferta' + Math.abs(resultadoPrecio))
    // console.log('Cantidad Cuotas' + cursoDB[0].cantidad_cuota)
    // console.log('Monto Cuotas' + Math.abs(resultadoPrecio) / cursoDB[0].cantidad_cuota)

    function obtenerInformacionFecha(fechaString) {
        // Divide la cadena de fecha en día, mes y año
        var partesFecha = fechaString.split('/');
        var dia = parseInt(partesFecha[0], 10);
        var mes = parseInt(partesFecha[1], 10) - 1; // Los meses en JavaScript van de 0 a 11
        var anio = parseInt(partesFecha[2], 10);

        // Crea un objeto de fecha
        var fecha = new Date(anio, mes, dia);

        // Obtiene el día de la semana (0 para domingo, 1 para lunes, etc.)
        var diaSemana = fecha.getDay();

        // Array con los nombres de los días de la semana
        var diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        // Array con los nombres de los meses
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        // Obtiene el nombre del día de la semana, del mes y el día del mes
        var nombreDiaSemana = diasSemana[diaSemana];
        var nombreMes = meses[mes];
        var diaMes = fecha.getDate();

        // Devuelve la información de la fecha
        return {
            diaSemana: nombreDiaSemana,
            mes: nombreMes,
            dia: diaMes
        };
    }

    // Ejemplo de uso
    var fechaInput = cursoDB[0].fecha_inicio.toLocaleString('es-ES', {
        timeZone: "America/Santo_Domingo"
    }).slice(0, 10);
    var informacionFechaResultante = obtenerInformacionFecha(fechaInput);
    // console.log('Fecha: ' + fechaInput);
    // console.log('Día de la semana: ' + informacionFechaResultante.diaSemana);
    // console.log('Mes: ' + informacionFechaResultante.mes);
    // console.log('Día del mes: ' + informacionFechaResultante.dia);

    // horas de clases
    var horasClases = cursoDB[0].horasClases;

    // Divide la cadena en intervalos de tiempo usando la coma como separador
    var intervalosDeTiempo = horasClases.split(',');

    // Variables para almacenar los horarios
    var horario1, horario2;

    // Itera sobre los intervalos de tiempo
    intervalosDeTiempo.forEach(function(intervalo, indice) {
        // Trim para eliminar espacios en blanco al inicio y al final de cada intervalo
        var intervaloLimpio = intervalo.trim();

        // Asigna a las variables horario1 y horario2 en función del índice
        if (indice === 0) {
            horario1 = intervaloLimpio;
        } else if (indice === 1) {
            horario2 = intervaloLimpio;
        }

        // Puedes agregar más lógica aquí según sea necesario para índices adicionales
    });


    // dias de clases
    var diasClases = cursoDB[0].dias_semana_clases;

    // Divide la cadena en intervalos de tiempo usando la coma como separador
    var intervalosDeTiempo = diasClases.split(',');

    // Variables para almacenar los horarios
    var diaClase1, diaClase2, diaClase3;

    // Itera sobre los intervalos de tiempo
    intervalosDeTiempo.forEach(function(intervalo, indice) {
        // Trim para eliminar espacios en blanco al inicio y al final de cada intervalo
        var intervaloLimpio = intervalo.trim();

        // Asigna a las variables horario1 y horario2 en función del índice
        if (indice === 0) {
            diaClase1 = intervaloLimpio;
        } else if (indice === 1) {
            diaClase2 = intervaloLimpio;
        } else if (indice === 2) {
            diaClase3 = intervaloLimpio;
        }

        // Puedes agregar más lógica aquí según sea necesario para índices adicionales
    });


    try {
        const consultaCedulaDB = await pool.query(`SELECT estudiantes.cedula FROM estudiantes WHERE estudiantes.cedula = ${nuevoEstudiante.cedula} LIMIT 1`);

        // console.log('cedula del body' + req.body.cedula)
        // console.log('cedula de BD ' + consultaCedulaDB[0].cedula)

        if (consultaCedulaDB.length > 0 && consultaCedulaDB[0].cedula == req.body.cedula) {
            console.log('Las cédulas son iguales');
        } else {
            console.log('Las cédulas no son iguales');
            await pool.query('INSERT INTO estudiantes SET ?', [nuevoEstudiante]);
        }

        await pool.query('INSERT INTO inscripciones SET ?', [nuevaInscripcion]);

        res.render('ver-curso-taller', {
            curso: cursoDB[0],
            contenidoCurso: contenidoCursoDB,
            maestro: maestroDB[0],
            precioRegular: cursoDB[0].costo,
            precioOferta: Math.abs(resultadoPrecio),
            cantidadCuotas: cursoDB[0].cantidad_cuota,
            montoCuotas: Math.abs(resultadoPrecio) / cursoDB[0].cantidad_cuota,
            porcentaje_descuento: cursoDB[0].porcentaje_descuento,
            diaSemana: informacionFechaResultante.diaSemana,
            mes: informacionFechaResultante.mes,
            dia: informacionFechaResultante.dia,
            horario1,
            horario2,
            diaClase1,
            diaClase2,
            diaClase3,
            alert: true,
            alertTitle: "Inscripcion Exitosa",
            alertMessage: "¡CORRECTO!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 2000,
            ruta: `cursos_talleres/ver_curso_taller/${cursoDB[0].titulo_curso}`
        });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        // Manejar el error según sea necesario
        res.status(500).send('Error interno del servidor');
    }
});



// VER TODOS LOS CURSO / TALLER
router.get("/cursos_talleres", async(req, res) => {


    const curso = req.params.id

    console.log('titulo curso params ' + curso)

    const cursoDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.titulo_curso = "${curso}" `);
    const contenidoCursoDB = await pool.query(`SELECT * FROM modulos, cursos where cursos.titulo_curso = "${curso}" and  modulos.id_curso = cursos.id_curso;`);

    res.render('ver-curso-taller', {
        curso: cursoDB[0],
        contenidoCurso: contenidoCursoDB

    });

});


module.exports = router;