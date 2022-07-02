const express = require("express");
const router = express.Router();

router.get('/reportes', (req, res) => {

    res.render("reportes");
})






module.exports = router;