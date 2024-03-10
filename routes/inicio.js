const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


// //12 - Método para controlar que está auth en todas las páginas
router.get('/', async(req, res) => {

    // categorias navbar
    const arrayCursosCategoria1DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '1' `);
    const arrayCursosCategoria2DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '2' `);
    const arrayCursosCategoria3DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '3' `);
    const arrayCursosCategoria4DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '4' `);
    const arrayCursosCategoria5DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '5' `);
    const arrayCursosCategoria6DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '6' `);
    const arrayCursosCategoria7DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '7' `);
    const arrayCursosCategoria8DB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.id_categoria = '8' `);

    const arrayCursosDB = await pool.query('SELECT * FROM cursos where cursos.estado_curso = "Activo" ;');
    const arrayCursosPromoDB = await pool.query('SELECT * FROM cursos where cursos.estado_curso = "Activo" and cursos.promocion = "Si";');

    const categoria1DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '1' `);
    const categoria2DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '2' `);
    const categoria3DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '3' `);
    const categoria4DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '4' `);
    const categoria5DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '5' `);
    const categoria6DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '6' `);
    const categoria7DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '7' `);
    const categoria8DB = await pool.query(`SELECT * FROM categorias where categorias.id_categoria = '8' `);

    console.log('categoria ' + categoria1DB[0].nombre_categoria)

    var ahora = new Date().getTime();
    var fecha_hoy = new Date(ahora);


    res.render('inicio', {
        arrayCursos: arrayCursosDB,
        arrayCursosPromo: arrayCursosPromoDB,
        fecha_hoy,
        arrayCursosCategoria1: arrayCursosCategoria1DB,
        arrayCursosCategoria2: arrayCursosCategoria2DB,
        arrayCursosCategoria3: arrayCursosCategoria3DB,
        arrayCursosCategoria4: arrayCursosCategoria4DB,
        arrayCursosCategoria5: arrayCursosCategoria5DB,
        arrayCursosCategoria6: arrayCursosCategoria6DB,
        arrayCursosCategoria7: arrayCursosCategoria7DB,
        arrayCursosCategoria8: arrayCursosCategoria8DB,
        categoria1: categoria1DB[0],
        categoria2: categoria2DB[0],
        categoria3: categoria3DB[0],
        categoria4: categoria4DB[0],
        categoria5: categoria5DB[0],
        categoria6: categoria6DB[0],
        categoria7: categoria7DB[0],
        categoria8: categoria8DB[0]


        // diaSemana: informacionFechaResultante.diaSemana,
        // mes: informacionFechaResultante.mes,
        // dia: informacionFechaResultante.dia
    });

});





module.exports = router;