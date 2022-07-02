const express = require("express");
const router = express.Router();


router.get('/nomina', (req, res) => {

    res.render("nomina");
})



module.exports = router;