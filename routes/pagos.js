const express = require("express");
const pool = require("../database");
const router = express.Router();

// router.get('/pagos', (req, res) => {

//     res.render("pagos");
// })

router.get('/pagos', async(req, res) => {
    if (req.session.loggedin) {

        const cedula = req.params;
        console.log(cedula)

        const empleadoDB = await pool.query(`SELECT * FROM empleados `)
            // const empleadoResultadoDB = await pool.query(`SELECT * FROM empleados WHERE cedula = ${cedula}`)



        res.render('pagos', {
            empleado: empleadoDB[0],
            // empleadoResultado: empleadoResultadoDB[0],
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