const express = require("express");
const router = express.Router();

router.get('/empleados', (req, res) => {

    res.render("empleados");
})






module.exports = router;