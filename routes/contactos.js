const express = require("express");
const router = express.Router();

router.get('/contactos', (req, res) => {
    if (req.session.loggedin) {

        res.render("contactos", {
            login: true,
            name: req.session.name
        });

    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
})






module.exports = router;