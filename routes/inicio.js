const express = require("express");
const router = express.Router();
const pool = require("../database");

// router.get('/', (req, res) => {

//     res.render("inicio");
// });

// RENDERIZANDO Y MOSTRANDO TODOS LOS EMPLEADOS********************
router.get('/inicio', async(req, res) => {
    const arrayEmpleadosDB = await pool.query('SELECT * FROM empleados where estatus="inactivo"');
    res.render("inicio", {
        arrayEmpleados: arrayEmpleadosDB

    });

});








module.exports = router;