const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {

    res.render("inicio");
});

router.get('/inicio', (req, res) => {

    res.render("inicio");
});






module.exports = router;