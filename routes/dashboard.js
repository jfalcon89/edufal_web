const express = require("express");
const router = express.Router();
const pool = require("../database");

// router.get('/', (req, res) => {

//     res.render("inicio");
// });

// RENDERIZANDO Y MOSTRANDO TODOS LOS EMPLEADOS********************
router.get('/admin/dashboard', async(req, res) => {
    if (req.session.loggedin) {

        const total_estudiantesDB = await pool.query('SELECT count(id_estudiante) as total_estudiantes FROM estudiantes');
        const estudiantes_activosDB = await pool.query('SELECT count(id_estudiante) as estudiantes_activos FROM estudiantes WHERE estudiantes.estatus = "Activo"');
        const estudiantes_inactivosDB = await pool.query('SELECT count(id_estudiante) as estudiantes_inactivos FROM estudiantes WHERE estudiantes.estatus = "Inactivo";');

        const total_cursosDB = await pool.query('SELECT count(id_curso) as total_cursos FROM cursos;');
        const cursos_activosDB = await pool.query('SELECT count(id_curso) as cursos_activos FROM cursos where cursos.estado_curso = "Activo"');
        const cursos_inactivosDB = await pool.query('SELECT count(id_curso) as cursos_inactivos FROM cursos where cursos.estado_curso = "Inactivo"');

        const total_inscripcionesDB = await pool.query('SELECT count(id_inscripcion) as total_inscripciones FROM inscripciones');
        const inscripciones_nuevasDB = await pool.query('SELECT count(id_inscripcion) as inscripciones_nuevas FROM inscripciones where inscripciones.estado_inscripcion = "Nuevo"');
        const inscripciones_iniciadasDB = await pool.query('SELECT count(id_inscripcion) as inscripciones_iniciadas FROM inscripciones where inscripciones.estado_inscripcion = "Iniciado"');
        const inscripciones_finalizadasDB = await pool.query('SELECT count(id_inscripcion) as inscripciones_finalizadas FROM inscripciones where inscripciones.estado_inscripcion = "Finalizado"');
        const inscripciones_declinadas_retiradasDB = await pool.query('SELECT count(id_inscripcion) as inscripciones_declinadas_retiradas FROM inscripciones where inscripciones.estado_inscripcion = "Declinado/Retirado"');

        const total_maestrosDB = await pool.query('SELECT count(id_maestro) as total_maestros FROM maestros');
        const maestros_activoDB = await pool.query('SELECT count(id_maestro) as maestros_activo FROM maestros where maestros.estado = "Activo"');
        const maestros_inactivosDB = await pool.query('SELECT count(id_maestro) as maestros_inactivos FROM maestros where maestros.estado = "Inactivo"');


        // pagos por mes
        const pagosEneroDB = await pool.query(`SELECT SUM(monto_pago) pagosEnero FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Enero"`);
        const pagosFebreroDB = await pool.query(`SELECT SUM(monto_pago) pagosFebrero FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Febrero"`);
        const pagosMarzoDB = await pool.query(`SELECT SUM(monto_pago) pagosMarzo FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Marzo"`);
        const pagosAbrilDB = await pool.query(`SELECT SUM(monto_pago) pagosAbril FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Abril"`);
        const pagosMayoDB = await pool.query(`SELECT SUM(monto_pago) pagosMayo FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Mayo"`);
        const pagosJunioDB = await pool.query(`SELECT SUM(monto_pago) pagosJunio FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Junio"`);
        const pagosJulioDB = await pool.query(`SELECT SUM(monto_pago) pagosJulio FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Julio"`);
        const pagosAgostoDB = await pool.query(`SELECT SUM(monto_pago) pagosAgosto FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Agosto"`);
        const pagosSeptiembreDB = await pool.query(`SELECT SUM(monto_pago) pagosSeptiembre FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Septiembre"`);
        const pagosOctubreDB = await pool.query(`SELECT SUM(monto_pago) pagosOctubre FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Octubre"`);
        const pagosNoviembreDB = await pool.query(`SELECT SUM(monto_pago) pagosNoviembre FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Noviembre"`);
        const pagosDiciembreDB = await pool.query(`SELECT SUM(monto_pago) pagosDiciembre FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Diciembre"`);

        // pagos por mes
        const cant_pagosEneroDB = await pool.query(`SELECT count(monto_pago) pagosEnero FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Enero"`);
        const cant_pagosFebreroDB = await pool.query(`SELECT count(monto_pago) pagosFebrero FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Febrero"`);
        const cant_pagosMarzoDB = await pool.query(`SELECT count(monto_pago) pagosMarzo FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Marzo"`);
        const cant_pagosAbrilDB = await pool.query(`SELECT count(monto_pago) pagosAbril FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Abril"`);
        const cant_pagosMayoDB = await pool.query(`SELECT count(monto_pago) pagosMayo FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Mayo"`);
        const cant_pagosJunioDB = await pool.query(`SELECT count(monto_pago) pagosJunio FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Junio"`);
        const cant_pagosJulioDB = await pool.query(`SELECT count(monto_pago) pagosJulio FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Julio"`);
        const cant_pagosAgostoDB = await pool.query(`SELECT count(monto_pago) pagosAgosto FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Agosto"`);
        const cant_pagosSeptiembreDB = await pool.query(`SELECT count(monto_pago) pagosSeptiembre FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Septiembre"`);
        const cant_pagosOctubreDB = await pool.query(`SELECT count(monto_pago) pagosOctubre FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Octubre"`);
        const cant_pagosNoviembreDB = await pool.query(`SELECT count(monto_pago) pagosNoviembre FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Noviembre"`);
        const cant_pagosDiciembreDB = await pool.query(`SELECT count(monto_pago) pagosDiciembre FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Diciembre"`);



        res.render("dashboard", {
            total_estudiantes: total_estudiantesDB[0].total_estudiantes,
            estudiantes_activos: estudiantes_activosDB[0].estudiantes_activos,
            estudiantes_inactivos: estudiantes_inactivosDB[0].estudiantes_inactivos,
            total_cursos: total_cursosDB[0].total_cursos,
            cursos_activos: cursos_activosDB[0].cursos_activos,
            cursos_inactivos: cursos_inactivosDB[0].cursos_inactivos,
            total_inscripciones: total_inscripcionesDB[0].total_inscripciones,
            inscripciones_nuevas: inscripciones_nuevasDB[0].inscripciones_nuevas,
            inscripciones_iniciadas: inscripciones_iniciadasDB[0].inscripciones_iniciadas,
            inscripciones_finalizadas: inscripciones_finalizadasDB[0].inscripciones_finalizadas,
            inscripciones_declinadas_retiradas: inscripciones_declinadas_retiradasDB[0].inscripciones_declinadas_retiradas,
            total_maestros: total_maestrosDB[0].total_maestros,
            maestros_activo: maestros_activoDB[0].maestros_activo,
            maestros_inactivos: maestros_inactivosDB[0].maestros_inactivos,
            pagosEnero: pagosEneroDB[0],
            pagosFebrero: pagosFebreroDB[0],
            pagosMarzo: pagosMarzoDB[0],
            pagosAbril: pagosAbrilDB[0],
            pagosMayo: pagosMayoDB[0],
            pagosJunio: pagosJunioDB[0],
            pagosJulio: pagosJulioDB[0],
            pagosAgosto: pagosAgostoDB[0],
            pagosSeptiembre: pagosSeptiembreDB[0],
            pagosOctubre: pagosOctubreDB[0],
            pagosNoviembre: pagosNoviembreDB[0],
            pagosDiciembre: pagosDiciembreDB[0],
            cant_pagosEnero: cant_pagosEneroDB[0],
            cant_pagosFebrero: cant_pagosFebreroDB[0],
            cant_pagosMarzo: cant_pagosMarzoDB[0],
            cant_pagosAbril: cant_pagosAbrilDB[0],
            cant_pagosMayo: cant_pagosMayoDB[0],
            cant_pagosJunio: cant_pagosJunioDB[0],
            cant_pagosJulio: cant_pagosJulioDB[0],
            cant_pagosAgosto: cant_pagosAgostoDB[0],
            cant_pagosSeptiembre: cant_pagosSeptiembreDB[0],
            cant_pagosOctubre: cant_pagosOctubreDB[0],
            cant_pagosNoviembre: cant_pagosNoviembreDB[0],
            cant_pagosDiciembre: cant_pagosDiciembreDB[0],
            login: true,
            name: req.session.name

        });

    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }

    // console.log(arrayEmpleados)
});

// router.get('/inicio', async(req, res) => {
//     if (req.session.loggedin) {
//         const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
//         res.render("inicio", {
//             arrayDepartamentos: arrayDepartamentosDB,
//             login: true,
//             name: req.session.name

//         });
//     } else {
//         res.render('login', {
//             login: false,
//             name: 'Debe iniciar sesión',
//         });
//     }

// });








module.exports = router;