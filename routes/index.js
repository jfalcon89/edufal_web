const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


//12 - Método para controlar que está auth en todas las páginas
router.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    // res.end();
});


module.exports = router;