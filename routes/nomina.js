const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const empleado = require("../modelo/empleado");
const moment = require("moment");


// MOSTRANDO LA VISTA
router.get('/nomina', (req, res) => {
    let now = moment();
    now = now.format("ll")
    console.log(now);

    res.render("nomina", { now: now });
})

// CREANDO UN EMPLEADO
router.post("/nomina", async(req, res) => {
    const body = req.body
    console.log(body);
    try {
        await empleado.create(body)

        res.redirect("/empleados");

    } catch (error) {
        console.log(error)
    }
});


// MOSTRAR SOLO UN EMPLEADO EN LA VISTA NOMINA USANDO SU ID  
// router.get("/:id", async(req, res) => {

//     const id = req.params.id

//     try {
//         const empleadoDB = await empleado.findOne({ _id: id });
//         console.log(empleadoDB);

//         res.render("nomina", {
//             empleado: empleadoDB,
//             error: false
//         })


//     } catch (error) {
//         console.log(error)
//         res.render("empleados", {
//             error: true,
//             mensaje: "no se encuentra el id seleccionado"
//         });
//     }

// });



module.exports = router;