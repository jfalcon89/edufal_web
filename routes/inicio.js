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

    var ahora = new Date().getTime();
    var fecha_hoy = new Date(ahora);
    // treintaDiasDespues.setDate(treintaDiasDespues.getDate() + 30);



    // let fecha_hoy = treintaDiasDespues.toLocaleString('es-ES', {
    //     timeZone: "America/Santo_Domingo"
    // }).slice(0, 10);

    // let fecha_hoy = new Date(treintaDiasDespues);




    // var ahora = new Date();

    // var dia = ahora.getDate();
    // var mes = ahora.getMonth() + 1; // Los meses van de 0 a 11, por lo que se suma 1
    // var anio = ahora.getFullYear();

    // // Agregar ceros a la izquierda si es necesario
    // if (dia < 10) {
    //     dia = '0' + dia;
    // }
    // if (mes < 10) {
    //     mes = '0' + mes;
    // }

    // var fecha_hoy = dia + '/' + mes + '/' + anio;

    // console.log(Date(fecha_hoy) + typeof fecha_hoy)

    res.render('inicio', {
        arrayCursos: arrayCursosDB,
        arrayCursosPromo: arrayCursosPromoDB,
        fecha_hoy


        // diaSemana: informacionFechaResultante.diaSemana,
        // mes: informacionFechaResultante.mes,
        // dia: informacionFechaResultante.dia
    });

});





module.exports = router;