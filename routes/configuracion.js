const express = require("express");
const router = express.Router();

// router.get('/configuracion', (req, res) => {

//     res.render("configuracion");
// });

router.get('/configuracion', (req, res) => {
    if (req.session.loggedin) {
        res.render('configuracion', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('configuracion', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    // res.end();
});






module.exports = router;