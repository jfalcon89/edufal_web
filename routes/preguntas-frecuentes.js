const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


// //12 - Método para controlar que está auth en todas las páginas
router.get('/preguntas-frecuentes', async(req, res) => {

    // categorias navbar
    const arrayCursosCategoria1DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '1' `);
    const arrayCursosCategoria2DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '2' `);
    const arrayCursosCategoria3DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '3' `);
    const arrayCursosCategoria4DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '4' `);
    const arrayCursosCategoria5DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '5' `);
    const arrayCursosCategoria6DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '6' `);
    const arrayCursosCategoria7DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '7' `);
    const arrayCursosCategoria8DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '8' `);

    const arrayCursosDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" `);

    res.render('preguntas-frecuentes', {
        arrayCursos: arrayCursosDB,
        arrayCursosCategoria1: arrayCursosCategoria1DB,
        arrayCursosCategoria2: arrayCursosCategoria2DB,
        arrayCursosCategoria3: arrayCursosCategoria3DB,
        arrayCursosCategoria4: arrayCursosCategoria4DB,
        arrayCursosCategoria5: arrayCursosCategoria5DB,
        arrayCursosCategoria6: arrayCursosCategoria6DB,
        arrayCursosCategoria7: arrayCursosCategoria7DB,
        arrayCursosCategoria8: arrayCursosCategoria8DB
    });

});



module.exports = router;