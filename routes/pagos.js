const express = require("express");
const pool = require("../database");
const router = express.Router();

// router.get('/pagos', (req, res) => {

//     res.render("pagos");
// })

router.get('/admin/pagos-estudiantes', async(req, res) => {
    if (req.session.loggedin) {

        const estudianteDB = await pool.query("SELECT * FROM estudiantes");

        const totalPagosNetoDB = await pool.query(`select SUM(monto_pago) as totalPagosNeto from pagos_estudiantes`);
        const cantidadPagosEstudiantesDB = await pool.query(`SELECT id_pago_estudiante FROM pagos_estudiantes `);

        // chart
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
        const arrayPagos_estudiantesFebreroDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Febrero"`);
        const arrayPagos_estudiantesEneroDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Enero"`);
        const arrayPagos_estudiantesMarzoDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Marzo"`);
        const arrayPagos_estudiantesAbrilDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Abril"`);
        const arrayPagos_estudiantesMayoDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Mayo"`);
        const arrayPagos_estudiantesJunioDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Junio"`);
        const arrayPagos_estudiantesJulioDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Julio"`);
        const arrayPagos_estudiantesAgostoDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Agosto"`);
        const arrayPagos_estudiantesSeptiembreDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Septiembre"`);
        const arrayPagos_estudiantesOctubreDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Octubre"`);
        const arrayPagos_estudiantesNoviembreDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Noviembre"`);
        const arrayPagos_estudiantesDiciembreDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.periodo = "Diciembre"`);

        const monto_pendiente_pagos_cursos_DB = await pool.query(`SELECT SUM(CAST(REPLACE(REPLACE(precioOferta_inscripcion, '$', ''), ',', '') AS DECIMAL(10,2))) AS monto_pendiente FROM inscripciones where inscripciones.estado_inscripcion in ("Nuevo", "Iniciado", "Finalizado")`);

        const monto_pendiente = monto_pendiente_pagos_cursos_DB[0].monto_pendiente - totalPagosNetoDB[0].totalPagosNeto

        // console.log(empleadoDB[0])
        res.render("pagos-estudiantes", {
            estudiante: estudianteDB[0],
            totalPagosNeto: totalPagosNetoDB[0],
            monto_pendiente,
            cantidadPagosEstudiantes: cantidadPagosEstudiantesDB,
            arrayPagos_estudiantesEnero: arrayPagos_estudiantesEneroDB,
            arrayPagos_estudiantesFebrero: arrayPagos_estudiantesFebreroDB,
            arrayPagos_estudiantesMarzo: arrayPagos_estudiantesMarzoDB,
            arrayPagos_estudiantesAbril: arrayPagos_estudiantesAbrilDB,
            arrayPagos_estudiantesMayo: arrayPagos_estudiantesMayoDB,
            arrayPagos_estudiantesJunio: arrayPagos_estudiantesJunioDB,
            arrayPagos_estudiantesJulio: arrayPagos_estudiantesJulioDB,
            arrayPagos_estudiantesAgosto: arrayPagos_estudiantesAgostoDB,
            arrayPagos_estudiantesSeptiembre: arrayPagos_estudiantesSeptiembreDB,
            arrayPagos_estudiantesOctubre: arrayPagos_estudiantesOctubreDB,
            arrayPagos_estudiantesNoviembre: arrayPagos_estudiantesNoviembreDB,
            arrayPagos_estudiantesDiciembre: arrayPagos_estudiantesDiciembreDB,
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
            login: true,
            name: req.session.name
        });
    } else {
        res.render('pagos-estudiantes', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    // res.end();
});

router.get('/pagos/resul', async(req, res) => {
    if (req.session.loggedin) {

        const cedula = req.params;
        console.log(cedula)
            // const empleadoDB = await pool.query(`SELECT * FROM empleados `)
        const empleadoResultadoDB = await pool.query(`SELECT * FROM empleados WHERE cedula = ${cedula}`)


        res.render('pagos', {
            // empleado: empleadoDB[0],
            empleadoResultado: empleadoResultadoDB[0],
            login: true,
            name: req.session.name

        });
    } else {
        res.render('pagos', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    // res.end();
});






module.exports = router;