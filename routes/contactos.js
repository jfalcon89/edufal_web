const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');

router.get('/contactos', (req, res) => {


    res.render("contactos");


})






module.exports = router;