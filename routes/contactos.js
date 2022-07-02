const express = require("express");
const router = express.Router();

router.get('/contactos', (req, res) => {

    res.render("contactos");
})






module.exports = router;