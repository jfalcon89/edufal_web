const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


// //12 - Método para controlar que está auth en todas las páginas
router.get('/', async(req, res) => {

    const arrayCursosDB = await pool.query('SELECT * FROM cursos where cursos.estado_curso = "Activo" ;');
    const arrayCursosPromoDB = await pool.query('SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.promocion = "Si";');


    res.render('inicio', {
        arrayCursos: arrayCursosDB,
        arrayCursosPromo: arrayCursosPromoDB

        // diaSemana: informacionFechaResultante.diaSemana,
        // mes: informacionFechaResultante.mes,
        // dia: informacionFechaResultante.dia
    });

});





module.exports = router;