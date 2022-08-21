const { json } = require("body-parser");
const { render } = require("ejs");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado"); 
const moment = require("moment");
const pool = require("../database");


// RENDERIZANDO Y MOSTRANDO TODOS LOS DEPARTAMENTOS********************
router.get('/departamentos', async(req, res) => {
    const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
    res.render("departamentos", {
        arrayDepartamentos: arrayDepartamentosDB

    });

});


// router.get("/crear-departamento", (req, res) => {

//     res.render("crear-departamento");
// })

// RENDERIZANDO Y MOSTRANDO TODOS LOS DEPARTAMENTOS EN VISTA CREAR-DEPARTAMENTO
router.get('/crear-departamento', async(req, res) => {
    const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
    res.render("crear-departamento", {
        arrayDepartamentos: arrayDepartamentosDB

    });

});

//INSERTAR NUEVO DEPARTAMENTO
router.post("/crear-departamento", async(req, res) => {
    const { nombre_dpto } = req.body;
    const nuevoDepartamento = {
        nombre_dpto

    };

    await pool.query('INSERT INTO departamentos set ?', [nuevoDepartamento]);
    // req.flash('success', 'Link guardado correctamente');
    res.redirect('/departamentos');

});

// ELIMINAR DEPARTAMENTO
router.get("/departamentos/:id", async(req, res) => {
    const { id } = req.params;
    console.log(id)

    try {

        await pool.query("DELETE FROM departamentos WHERE idDepartamento = ?", [id]);
        // req.flash('success', 'Link eliminado correctamente');
        res.redirect("/departamentos");

    } catch (error) {
        console.log(error)
    }

});


// RENDERIZANDO Y MOSTRANDO TODOS LOS DEPARTAMENTOS EN VISTA EDITAR-DEPARTAMENTO
// router.get('/departamentos/editar-departamento/:id', async(req, res) => {
//     const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
//     res.render("crear-departamento", {
//         arrayDepartamentos: arrayDepartamentosDB

//     });

// });


//EDITAR DEPARTAMENTO POR NUMERO ID EN VISTA EDITAR-DEPARTAMENTO
router.get("/departamentos/editar-departamento/:id", async(req, res) => {
    const id = req.params.id


    try {
        const departamentoDB = await pool.query("SELECT * FROM departamentos WHERE idDepartamento = ?", [id]);
        // console.log(empleadoDB[0]);
        res.render("editar-departamento", { departamento: departamentoDB[0] });

    } catch (error) {
        console.log(error)
        res.render("editar-departamento", {
            error: true,
            mensaje: "no se encuentra el id seleccionado"
        });
    }
});

//GUARDAR ACTUALIZACION DE DEPARTAMENTO POR NUMERO ID EN VISTA EDITAR-DEPARTAMENTO
router.post('/departamentos/editar-departamento/:id', async(req, res) => {
    const id = req.params.id;
    console.log(req.params.id)
    const { nombre_dpto } = req.body;
    const nuevoDepartamento = {
        nombre_dpto
    };

    await pool.query("UPDATE departamentos set ? WHERE idDepartamento = ?", [nuevoDepartamento, id]);
    // req.flash('success', 'Link actualizado correctamente');
    res.redirect('/departamentos');
});








module.exports = router;