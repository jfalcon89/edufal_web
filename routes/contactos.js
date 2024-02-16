const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');

router.get('/contactos', async(req, res) => {

    const arrayCursosDB = await pool.query(`SELECT * FROM cursos where cursos.estado_curso = "Activo" `);

    res.render("contactos", { arrayCursos: arrayCursosDB });


})






module.exports = router;