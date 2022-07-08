const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const empleado = require("../modelo/empleado");
const moment = require("moment");




// CONSULTANDO TODOS LOS EMPLEADOS
router.get("/", async(req, res) => {


    try {

        const arrayEmpleadosDB = await empleado.find();
        console.log(arrayEmpleadosDB);

        res.render("empleados", {
            arrayEmpleados: arrayEmpleadosDB
                // mensaje: "Empleado eleminado correct"
        });

    } catch (error) {
        console.log(error)
    }

});

// RENDER DE VISTA detalle-empleado
router.get("/detalle-empleado", (req, res) => {


    res.render("detalle-empleado");
});

// MOSTRAR SOLO UN EMPLEADO EN LA VISTA nomina USANDO SU ID  
router.get("/detalle-empleado/:id", async(req, res) => {

    const id = req.params.id

    try {
        const empleadoDB = await empleado.findOne({ _id: id });
        console.log(empleadoDB);

        res.render("detalle-empleado", {
            empleado: empleadoDB,
            error: false
        })


    } catch (error) {
        console.log(error)
        res.render("detalle-empleado", {
            error: true,
            mensaje: "no se encuentra el id seleccionado"
        });
    }

});

//ELIMINAR PERSONA
router.delete("/detalle-empleado/:id", async(req, res) => {

    const id = req.params.id

    try {

        const empleadoDB = await empleado.findByIdAndDelete({ _id: id })

        if (empleadoDB) {
            res.json({
                estado: true,
                mensaje: "eliminado"
            })
        } else {
            res.json({
                estado: false,
                mensaje: "fallo eliminar"
            })
        }
    } catch (error) {
        console.log(error)
    }

});

//EDITAR EMPLEADO
router.put("/detalle-empleado/:id", async(req, res) => {

    const id = req.params.id
    const body = req.body

    try {
        const empleadoDB = await empleado.findByIdAndUpdate(id, body, { useFindAndModify: false })
        console.log(empleadoDB)

        res.json({
            estado: true,
            mensaje: "empleado editado"
        })

    } catch (error) {
        console.log(error)
        res.json({
            estado: false,
            mensaje: "empleado fallida"
        })
    }

});


// MOSTRAR SOLO UN EMPLEADO EN LA VISTA INFORMACION EMPLEADO USANDO SU ID  

// render de la vista informacion-empleado
router.get("/informacion-empleado", (req, res) => {
    res.render("informacion-empleado");
});


router.get("/informacion-empleado/:id", async(req, res) => {

    const id = req.params.id

    try {
        const empleadoDB = await empleado.findOne({ _id: id });
        console.log(empleadoDB);

        res.render("informacion-empleado", {
            empleado: empleadoDB,
            error: false
        })


    } catch (error) {
        console.log(error)
        res.render("informacion-empleado", {
            error: true,
            mensaje: "no se encuentra el id seleccionado"
        });
    }

});


//vista para controlar los informe del empleado COMENTADA POR AHORA 
// router.get("/informacion-empleado/:id", async(req, res) => {

//     const id = req.params.id

//     try {
//         const informeDB = await informe.findOne({ _id: id });
//         console.log(informeDB);

//         res.render("informacion-empleado", {
//             empleado: informeDB,
//             error: false
//         })


//     } catch (error) {
//         console.log(error)
//         res.render("informacion-empleado", {
//             error: true,
//             mensaje: "no se encuentra el id seleccionado"
//         });
//     }

// });


//CREAR EMPLEADO
// router.post("/empleado", async(req, res) => {
//     const body = req.body
//     try {
//         await empleado.create(body)

//         res.redirect("/empleados");

//     } catch (error) {
//         console.log(error)
//     }
// });






module.exports = router;