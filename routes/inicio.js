const express = require("express");
const router = express.Router();
const pool = require("../database");

// router.get('/', (req, res) => {

//     res.render("inicio");
// });

// RENDERIZANDO Y MOSTRANDO TODOS LOS EMPLEADOS********************
router.get('/inicio', async(req, res) => {
    if (req.session.loggedin) {

        // novedades
        const novedadesDB = await pool.query('SELECT idNovedad, cambio, nombre_dpto, fechaNovedad, name FROM novedades_delete_dpto UNION ALL SELECT idNovedad, cambio, nombre_dpto, fechaNovedad, name FROM novedades_add_dpto UNION ALL SELECT idNovedad, cambio, nombre_dpto, fechaNovedad, name FROM novedades_edit_dpto ;')

        const arrayEmpleadosDB = await pool.query('SELECT idEmpleado FROM empleados WHERE estatus="Activo"');
        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
        const arrayUserDB = await pool.query('SELECT * FROM users');
        const validacionPagos_x_empleadoDB = await pool.query(`SELECT * FROM pagos_x_empleados `);
        const serviciosTotalesDB = await pool.query("SELECT SUM(montoPagoServicio) serviciosTotales FROM pagos_servicios ")
        const cantPagosDB = await pool.query("SELECT COUNT(montoPagoServicio) cantPagos FROM pagos_servicios")
        const sueldosTotalesDB = await pool.query("SELECT SUM(sueldoNeto) sueldosTotales FROM pagos_x_empleados")

        const gastosEneroDB = await pool.query("SELECT SUM(gastosEnero) AS gastosEnero FROM(SELECT SUM(sueldoNeto) AS gastosEnero FROM pagos_x_empleados WHERE periodo = 'Enero' UNION ALL SELECT SUM(montoPagoServicio) AS gastosEnero FROM pagos_servicios WHERE mesPagoServicio = 'Enero') AS temp;")
        const gastosFebreroDB = await pool.query("SELECT SUM(gastosFebrero) AS gastosFebrero FROM(SELECT SUM(sueldoNeto) AS gastosFebrero FROM pagos_x_empleados WHERE periodo = 'Febrero' UNION ALL SELECT SUM(montoPagoServicio) AS gastosFebrero FROM pagos_servicios WHERE mesPagoServicio = 'Febrero') AS temp;")
        const gastosMarzoDB = await pool.query("SELECT SUM(gastosMarzo) AS gastosMarzo FROM(SELECT SUM(sueldoNeto) AS gastosMarzo FROM pagos_x_empleados WHERE periodo = 'Marzo' UNION ALL SELECT SUM(montoPagoServicio) AS gastosMarzo FROM pagos_servicios WHERE mesPagoServicio = 'Marzo') AS temp;")
        const gastosAbrilDB = await pool.query("SELECT SUM(gastosAbril) AS gastosAbril FROM(SELECT SUM(sueldoNeto) AS gastosAbril FROM pagos_x_empleados WHERE periodo = 'Abril' UNION ALL SELECT SUM(montoPagoServicio) AS gastosAbril FROM pagos_servicios WHERE mesPagoServicio = 'Abril') AS temp;")
        const gastosMayoDB = await pool.query("SELECT SUM(gastosMayo) AS gastosMayo FROM(SELECT SUM(sueldoNeto) AS gastosMayo FROM pagos_x_empleados WHERE periodo = 'Mayo' UNION ALL SELECT SUM(montoPagoServicio) AS gastosMayo FROM pagos_servicios WHERE mesPagoServicio = 'Mayo') AS temp;")
        const gastosJunioDB = await pool.query("SELECT SUM(gastosJunio) AS gastosJunio FROM(SELECT SUM(sueldoNeto) AS gastosJunio FROM pagos_x_empleados WHERE periodo = 'Junio' UNION ALL SELECT SUM(montoPagoServicio) AS gastosJunio FROM pagos_servicios WHERE mesPagoServicio = 'Junio') AS temp;")
        const gastosJulioDB = await pool.query("SELECT SUM(gastosJulio) AS gastosJulio FROM(SELECT SUM(sueldoNeto) AS gastosJulio FROM pagos_x_empleados WHERE periodo = 'Julio' UNION ALL SELECT SUM(montoPagoServicio) AS gastosJulio FROM pagos_servicios WHERE mesPagoServicio = 'Julio') AS temp;")
        const gastosAgostoDB = await pool.query("SELECT SUM(gastosAgosto) AS gastosAgosto FROM(SELECT SUM(sueldoNeto) AS gastosAgosto FROM pagos_x_empleados WHERE periodo = 'Agosto' UNION ALL SELECT SUM(montoPagoServicio) AS gastosAgosto FROM pagos_servicios WHERE mesPagoServicio = 'Agosto') AS temp;")
        const gastosSeptiempreDB = await pool.query("SELECT SUM(gastosSeptiempre) AS gastosSeptiempre FROM(SELECT SUM(sueldoNeto) AS gastosSeptiempre FROM pagos_x_empleados WHERE periodo = 'Septiempre' UNION ALL SELECT SUM(montoPagoServicio) AS gastosSeptiempre FROM pagos_servicios WHERE mesPagoServicio = 'Septiempre') AS temp;")
        const gastosOctubreDB = await pool.query("SELECT SUM(gastosOctubre) AS gastosOctubre FROM(SELECT SUM(sueldoNeto) AS gastosOctubre FROM pagos_x_empleados WHERE periodo = 'Octubre' UNION ALL SELECT SUM(montoPagoServicio) AS gastosOctubre FROM pagos_servicios WHERE mesPagoServicio = 'Octubre') AS temp;")
        const gastosNoviembreDB = await pool.query("SELECT SUM(gastosNoviembre) AS gastosNoviembre FROM(SELECT SUM(sueldoNeto) AS gastosNoviembre FROM pagos_x_empleados WHERE periodo = 'Noviembre' UNION ALL SELECT SUM(montoPagoServicio) AS gastosNoviembre FROM pagos_servicios WHERE mesPagoServicio = 'Noviembre') AS temp;")
        const gastosDiciembreDB = await pool.query("SELECT SUM(gastosDiciembre) AS gastosDiciembre FROM(SELECT SUM(sueldoNeto) AS gastosDiciembre FROM pagos_x_empleados WHERE periodo = 'Diciembre' UNION ALL SELECT SUM(montoPagoServicio) AS gastosDiciembre FROM pagos_servicios WHERE mesPagoServicio = 'Diciembre') AS temp;")

        const gastosGenerales = sueldosTotalesDB[0].sueldosTotales + serviciosTotalesDB[0].serviciosTotales

        res.render("dashboard", {
            gastosGenerales,
            novedades: novedadesDB,
            arrayEmpleados: arrayEmpleadosDB,
            arrayDepartamentos: arrayDepartamentosDB,
            arrayUser: arrayUserDB,
            validacionPagos_x_empleado: validacionPagos_x_empleadoDB,
            serviciosTotales: serviciosTotalesDB[0].serviciosTotales,
            sueldosTotales: sueldosTotalesDB[0].sueldosTotales,
            cantPagos: cantPagosDB[0].cantPagos,
            gastosEnero: gastosEneroDB[0].gastosEnero,
            gastosFebrero: gastosFebreroDB[0].gastosFebrero,
            gastosMarzo: gastosMarzoDB[0].gastosMarzo,
            gastosAbril: gastosAbrilDB[0].gastosAbril,
            gastosMayo: gastosMayoDB[0].gastosMayo,
            gastosJunio: gastosJunioDB[0].gastosJunio,
            gastosJulio: gastosJulioDB[0].gastosJulio,
            gastosAgosto: gastosAgostoDB[0].gastosAgosto,
            gastosSeptiempre: gastosSeptiempreDB[0].gastosSeptiempre,
            gastosOctubre: gastosOctubreDB[0].gastosOctubre,
            gastosNoviembre: gastosNoviembreDB[0].gastosNoviembre,
            gastosDiciembre: gastosDiciembreDB[0].gastosDiciembre,
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