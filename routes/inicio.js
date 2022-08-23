const express = require("express");
const router = express.Router();
const pool = require("../database");

// router.get('/', (req, res) => {

//     res.render("inicio");
// });

// RENDERIZANDO Y MOSTRANDO TODOS LOS EMPLEADOS********************
router.get('/inicio', async(req, res) => {
    if (req.session.loggedin) {

        const arrayEmpleadosDB = await pool.query('SELECT * FROM empleados');
        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
        const arrayUserDB = await pool.query('SELECT * FROM users');
        console.log(arrayEmpleadosDB[0])
        res.render("inicio", {
            arrayEmpleados: arrayEmpleadosDB,
            arrayDepartamentos: arrayDepartamentosDB,
            arrayUser: arrayUserDB,
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