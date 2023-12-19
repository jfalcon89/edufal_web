const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


// //12 - Método para controlar que está auth en todas las páginas
router.get('/ofertas-inscripciones', async(req, res) => {

    const arrayCursosDB = await pool.query('SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.oferta_inscripcion = "Si";');

    res.render('ofertas-inscripciones', {
        arrayCursos: arrayCursosDB
    });

});



module.exports = router;