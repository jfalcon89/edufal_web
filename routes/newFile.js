const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
exports.router = router;
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


// //12 - Método para controlar que está auth en todas las páginas
router.get('/', async(req, res) => {

    const arrayCursosDB = await pool.query('SELECT * FROM cursos where cursos.estado = "Activo";');

    res.render('inicio', {
        arrayCursos: arrayCursosDB
    });

});


module.exports = router;