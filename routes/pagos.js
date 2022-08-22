const express = require("express");
const router = express.Router();

// router.get('/pagos', (req, res) => {

//     res.render("pagos");
// })

router.get('/pagos', (req, res) => {
    if (req.session.loggedin) {
        res.render('pagos', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('pagos', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    // res.end();
});






module.exports = router;