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
    const arrayCursosCategoria1DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '1' `);
    const arrayCursosCategoria2DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '2' `);
    const arrayCursosCategoria3DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '3' `);
    const arrayCursosCategoria4DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '4' `);
    const arrayCursosCategoria5DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '5' `);
    const arrayCursosCategoria6DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '6' `);
    const arrayCursosCategoria7DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '7' `);
    const arrayCursosCategoria8DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '8' `);
    const arrayCursosDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo"  `);

    const categoria1DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '1' `);
    const categoria2DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '2' `);
    const categoria3DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '3' `);
    const categoria4DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '4' `);
    const categoria5DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '5' `);
    const categoria6DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '6' `);
    const categoria7DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '7' `);
    const categoria8DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '8' `);

    res.render('cursos_talleres', {
        arrayCursosCategoria1: arrayCursosCategoria1DB,
        arrayCursosCategoria2: arrayCursosCategoria2DB,
        arrayCursosCategoria3: arrayCursosCategoria3DB,
        arrayCursosCategoria4: arrayCursosCategoria4DB,
        arrayCursosCategoria5: arrayCursosCategoria5DB,
        arrayCursosCategoria6: arrayCursosCategoria6DB,
        arrayCursosCategoria7: arrayCursosCategoria7DB,
        arrayCursosCategoria8: arrayCursosCategoria8DB,
        arrayCursos: arrayCursosDB,
        sesiones,
        categoria1: categoria1DB[0],
        categoria2: categoria2DB[0],
        categoria3: categoria3DB[0],
        categoria4: categoria4DB[0],
        categoria5: categoria5DB[0],
        categoria6: categoria6DB[0],
        categoria7: categoria7DB[0],
        categoria8: categoria8DB[0]
    });

});



// VER CURSO / TALLER
router.get("/cursos_talleres/ver_curso_taller/:id", async(req, res) => {
    const curso = req.params.id
    let sesiones

    console.log('titulo curso params ' + curso)

    // categorias navbar
    const arrayCursosCategoria1DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '1' `);
    const arrayCursosCategoria2DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '2' `);
    const arrayCursosCategoria3DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '3' `);
    const arrayCursosCategoria4DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '4' `);
    const arrayCursosCategoria5DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '5' `);
    const arrayCursosCategoria6DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '6' `);
    const arrayCursosCategoria7DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '7' `);
    const arrayCursosCategoria8DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '8' `);

    const cursoDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.titulo_curso = "${curso}" `);
    const contenidoCursoDB = await pool.query(`SELECT * FROM modulos, cursos where cursos.titulo_curso = "${curso}" and  modulos.id_curso = cursos.id_curso;`);
    const maestroDB = await pool.query(`SELECT * FROM maestros WHERE maestros.id_maestro = ${cursoDB[0].id_maestro}`);
    const arrayCursosDB = await pool.query('SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.promocion = "Si";');

    const arrayCursosRelacionadosDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = "${cursoDB[0].id_categoria}" `);


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

    // separacion dirigido a candidatos
    if (cursoDB[0].dirigido_a) {
        var dirigido_a = cursoDB[0].dirigido_a;

        // Divide la cadena en intervalos de tiempo usando la coma como separador
        var intervalosDeCandidatos = dirigido_a.split('*');

        // Variables para almacenar los horarios
        var candidato_1, candidato_2, candidato_3, candidato_4;

        // Itera sobre los intervalos de tiempo
        intervalosDeCandidatos.forEach(function(intervalo, indice) {
            // Trim para eliminar espacios en blanco al inicio y al final de cada intervalo
            var intervaloLimpio = intervalo.trim();

            // Asigna a las variables horario1 y horario2 en función del índice
            if (indice === 0) {
                candidato_1 = intervaloLimpio;
            } else if (indice === 1) {
                candidato_2 = intervaloLimpio;
            } else if (indice === 2) {
                candidato_3 = intervaloLimpio;
            } else if (indice === 3) {
                candidato_4 = intervaloLimpio;
            }

            // Puedes agregar más lógica aquí según sea necesario para índices adicionales
        });
    }

    var ahora = new Date().getTime();
    var diferencia = cursoDB[0].fecha_oferta - ahora;

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
        sesiones,
        arrayCursos: arrayCursosDB,
        candidato_1,
        candidato_2,
        candidato_3,
        candidato_4,
        diferencia,
        arrayCursosCategoria1: arrayCursosCategoria1DB,
        arrayCursosCategoria2: arrayCursosCategoria2DB,
        arrayCursosCategoria3: arrayCursosCategoria3DB,
        arrayCursosCategoria4: arrayCursosCategoria4DB,
        arrayCursosCategoria5: arrayCursosCategoria5DB,
        arrayCursosCategoria6: arrayCursosCategoria6DB,
        arrayCursosCategoria7: arrayCursosCategoria7DB,
        arrayCursosCategoria8: arrayCursosCategoria8DB,
        arrayCursosRelacionados: arrayCursosRelacionadosDB


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

    // categorias navbar
    const arrayCursosCategoria1DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '1' `);
    const arrayCursosCategoria2DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '2' `);
    const arrayCursosCategoria3DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '3' `);
    const arrayCursosCategoria4DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '4' `);
    const arrayCursosCategoria5DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '5' `);
    const arrayCursosCategoria6DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '6' `);
    const arrayCursosCategoria7DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '7' `);
    const arrayCursosCategoria8DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '8' `);



    const cursoDB = await pool.query(`SELECT * FROM cursos, modulos WHERE cursos.estado_curso = "Activo" AND cursos.titulo_curso = "${curso}"`);
    const contenidoCursoDB = await pool.query(`SELECT * FROM modulos WHERE modulos.id_curso = "${id_curso}"`);
    const maestroDB = await pool.query(`SELECT * FROM maestros WHERE maestros.id_maestro = ${cursoDB[0].id_maestro}`);
    const arrayCursosDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" `);

    const arrayCursosRelacionadosDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = "${cursoDB[0].id_categoria}" `);

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

    var ahora = new Date().getTime();
    var diferencia = cursoDB[0].fecha_oferta - ahora;

    // separacion dirigido a candidatos
    if (cursoDB[0].dirigido_a) {
        var dirigido_a = cursoDB[0].dirigido_a;

        // Divide la cadena en intervalos de tiempo usando la coma como separador
        var intervalosDeCandidatos = dirigido_a.split('*');

        // Variables para almacenar los horarios
        var candidato_1, candidato_2, candidato_3, candidato_4;

        // Itera sobre los intervalos de tiempo
        intervalosDeCandidatos.forEach(function(intervalo, indice) {
            // Trim para eliminar espacios en blanco al inicio y al final de cada intervalo
            var intervaloLimpio = intervalo.trim();

            // Asigna a las variables horario1 y horario2 en función del índice
            if (indice === 0) {
                candidato_1 = intervaloLimpio;
            } else if (indice === 1) {
                candidato_2 = intervaloLimpio;
            } else if (indice === 2) {
                candidato_3 = intervaloLimpio;
            } else if (indice === 3) {
                candidato_4 = intervaloLimpio;
            }

            // Puedes agregar más lógica aquí según sea necesario para índices adicionales
        });
    }


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
            ruta: `cursos_talleres/ver_curso_taller/${cursoDB[0].titulo_curso}`,
            arrayCursos: arrayCursosDB,
            candidato_1,
            candidato_2,
            candidato_3,
            candidato_4,
            diferencia,
            arrayCursosCategoria1: arrayCursosCategoria1DB,
            arrayCursosCategoria2: arrayCursosCategoria2DB,
            arrayCursosCategoria3: arrayCursosCategoria3DB,
            arrayCursosCategoria4: arrayCursosCategoria4DB,
            arrayCursosCategoria5: arrayCursosCategoria5DB,
            arrayCursosCategoria6: arrayCursosCategoria6DB,
            arrayCursosCategoria7: arrayCursosCategoria7DB,
            arrayCursosCategoria8: arrayCursosCategoria8DB,
            arrayCursosRelacionados: arrayCursosRelacionadosDB
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

    // categorias navbar
    const arrayCursosCategoria1DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '1' `);
    const arrayCursosCategoria2DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '2' `);
    const arrayCursosCategoria3DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '3' `);
    const arrayCursosCategoria4DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '4' `);
    const arrayCursosCategoria5DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '5' `);
    const arrayCursosCategoria6DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '6' `);
    const arrayCursosCategoria7DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '7' `);
    const arrayCursosCategoria8DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '8' `);



    const cursoDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.titulo_curso = "${curso}" `);
    const contenidoCursoDB = await pool.query(`SELECT * FROM modulos, cursos where cursos.titulo_curso = "${curso}" and  modulos.id_curso = cursos.id_curso;`);
    const arrayCursosDB = await pool.query('SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.promocion = "Si";');

    res.render('ver-curso-taller', {
        curso: cursoDB[0],
        contenidoCurso: contenidoCursoDB,
        arrayCursos: arrayCursosDB,
        arrayCursosCategoria1: arrayCursosCategoria1DB,
        arrayCursosCategoria2: arrayCursosCategoria2DB,
        arrayCursosCategoria3: arrayCursosCategoria3DB,
        arrayCursosCategoria4: arrayCursosCategoria4DB,
        arrayCursosCategoria5: arrayCursosCategoria5DB,
        arrayCursosCategoria6: arrayCursosCategoria6DB,
        arrayCursosCategoria7: arrayCursosCategoria7DB,
        arrayCursosCategoria8: arrayCursosCategoria8DB


    });

});

// VER TODOS LOS CURSO / TALLER POR CATEGORIA
router.get("/cursos_talleres-categoria/:id", async(req, res) => {


    const nombre_categoria = req.params.id



    // categorias navbar
    const arrayCursosCategoria1DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '1' `);
    const arrayCursosCategoria2DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '2' `);
    const arrayCursosCategoria3DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '3' `);
    const arrayCursosCategoria4DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '4' `);
    const arrayCursosCategoria5DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '5' `);
    const arrayCursosCategoria6DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '6' `);
    const arrayCursosCategoria7DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '7' `);
    const arrayCursosCategoria8DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '8' `);

    const arrayCursosCategoriaDB = await pool.query(`SELECT * FROM categorias, cursos where cursos.id_categoria = categorias.id_categoria and categorias.nombre_categoria = "${nombre_categoria}";`);

    const categoriaDB = await pool.query(`SELECT * FROM categorias where categorias.nombre_categoria = "${nombre_categoria}";`);

    console.log('categoria de curso ' + categoriaDB[0].nombre_categoria)

    res.render('ver-curso-taller-categoria', {

        arrayCursosCategoria: arrayCursosCategoriaDB,
        categoria: categoriaDB[0],
        arrayCursosCategoria1: arrayCursosCategoria1DB,
        arrayCursosCategoria2: arrayCursosCategoria2DB,
        arrayCursosCategoria3: arrayCursosCategoria3DB,
        arrayCursosCategoria4: arrayCursosCategoria4DB,
        arrayCursosCategoria5: arrayCursosCategoria5DB,
        arrayCursosCategoria6: arrayCursosCategoria6DB,
        arrayCursosCategoria7: arrayCursosCategoria7DB,
        arrayCursosCategoria8: arrayCursosCategoria8DB

    });

});


module.exports = router;