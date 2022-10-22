const express = require("express");
const pool = require("../database");
const router = express.Router();

// router.get('/pagos', (req, res) => {

//     res.render("pagos");
// })

router.get('/pagos', async(req, res) => {
    if (req.session.loggedin) {

        // const id = req.params.id

        const pagosEneroDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosEnero, SUM(comisionP) comisionesEnero FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Enero"`);
        const pagosFebreroDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosFebrero, SUM(comisionP) comisionesFebrero FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Febrero"`);
        const pagosMarzoDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosMarzo, SUM(comisionP) comisionesMarzo FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Marzo"`);
        const pagosAbrilDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosAbril, SUM(comisionP) comisionesAbril FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Abril"`);
        const pagosMayoDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosMayo, SUM(comisionP) comisionesMayo FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Mayo"`);
        const pagosJunioDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosJunio, SUM(comisionP) comisionesJunio FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Junio"`);
        const pagosJulioDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosJulio, SUM(comisionP) comisionesJulio FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Julio"`);
        const pagosAgostoDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosAgosto, SUM(comisionP) comisionesAgosto FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Agosto"`);
        const pagosSeptiembreDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosSeptiembre, SUM(comisionP) comisionesSeptiembre FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Septiembre"`);
        const pagosOctubreDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosOctubre, SUM(comisionP) comisionesOctubre FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Octubre"`);
        const pagosNoviembreDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosNoviembre, SUM(comisionP) comisionesNoviembre FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Noviembre"`);
        const pagosDiciembreDB = await pool.query(`SELECT SUM(sueldoNeto) sueldosDiciembre, SUM(comisionP) comisionesDiciembre FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Diciembre"`);


        const totalSueldoNetoDB = await pool.query(`select SUM(sueldoNeto) as totalSueldoNeto from pagos_x_empleados`);
        const totalComisionesDB = await pool.query(`select SUM(comisionP) as totalComisiones from pagos_x_empleados `);
        const validacionPagos_x_empleadoDB = await pool.query(`SELECT * FROM pagos_x_empleados `);
        const arrayPagos_x_empleadoEneroDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Enero"`);
        const arrayPagos_x_empleadoFebreroDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Febrero"`);
        const arrayPagos_x_empleadoMarzoDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Marzo"`);
        const arrayPagos_x_empleadoAbrilDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Abril"`);
        const arrayPagos_x_empleadoMayoDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Mayo"`);
        const arrayPagos_x_empleadoJunioDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Junio"`);
        const arrayPagos_x_empleadoJulioDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Julio"`);
        const arrayPagos_x_empleadoAgostoDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Agosto"`);
        const arrayPagos_x_empleadoSeptiembreDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Septiembre"`);
        const arrayPagos_x_empleadoOctubreDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Octubre"`);
        const arrayPagos_x_empleadoNoviembreDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Noviembre"`);
        const arrayPagos_x_empleadoDiciembreDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.periodo = "Diciembre"`);
        const empleadoDB = await pool.query("SELECT * FROM empleados");


        // console.log(empleadoDB[0])
        res.render("pagos", {
            empleado: empleadoDB[0],
            totalSueldoNeto: totalSueldoNetoDB[0],
            totalComisiones: totalComisionesDB[0],
            validacionPagos_x_empleado: validacionPagos_x_empleadoDB,
            arrayPagos_x_empleadoEnero: arrayPagos_x_empleadoEneroDB,
            arrayPagos_x_empleadoFebrero: arrayPagos_x_empleadoFebreroDB,
            arrayPagos_x_empleadoMarzo: arrayPagos_x_empleadoMarzoDB,
            arrayPagos_x_empleadoAbril: arrayPagos_x_empleadoAbrilDB,
            arrayPagos_x_empleadoMayo: arrayPagos_x_empleadoMayoDB,
            arrayPagos_x_empleadoJunio: arrayPagos_x_empleadoJunioDB,
            arrayPagos_x_empleadoJulio: arrayPagos_x_empleadoJulioDB,
            arrayPagos_x_empleadoAgosto: arrayPagos_x_empleadoAgostoDB,
            arrayPagos_x_empleadoSeptiembre: arrayPagos_x_empleadoSeptiembreDB,
            arrayPagos_x_empleadoOctubre: arrayPagos_x_empleadoOctubreDB,
            arrayPagos_x_empleadoNoviembre: arrayPagos_x_empleadoNoviembreDB,
            arrayPagos_x_empleadoDiciembre: arrayPagos_x_empleadoDiciembreDB,
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
        res.render('pagos', {
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