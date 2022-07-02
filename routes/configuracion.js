const express = require("express");
const router = express.Router();

router.get('/configuracion', (req, res) => {

    res.render("configuracion");
})






module.exports = router;