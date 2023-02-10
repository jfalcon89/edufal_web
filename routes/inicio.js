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