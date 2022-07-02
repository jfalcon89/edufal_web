const express = require("express");
const router = express.Router();

router.get('/pagos', (req, res) => {

    res.render("pagos");
})






module.exports = router;