const { json } = require("body-parser");
const { render } = require("ejs");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado"); 
const moment = require("moment");
const pool = require("../database");


// RENDERIZANDO Y MOSTRANDO TODOS LOS DEPARTAMENTOS*********************
router.get('/departamentos', async(req, res) => {
    if (req.session.loggedin) {
        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
        res.render("departamentos", {
            arrayDepartamentos: arrayDepartamentosDB,
            login: true,
            name: req.session.name

        });
    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }

});

// router.get('/pagos', (req, res) => {
//     if (req.session.loggedin) {
//         res.render('pagos', {
//             login: true,
//             name: req.session.name
//         });
//     } else {
//         res.render('pagos', {
//             login: false,
//             name: 'Debe iniciar sesión',
//         });
//     }
//     // res.end();
// });


// router.get("/crear-departamento", (req, res) => {

//     res.render("crear-departamento");
// })

// RENDERIZANDO Y MOSTRANDO TODOS LOS DEPARTAMENTOS EN VISTA CREAR-DEPARTAMENTO
router.get('/crear-departamento', async(req, res) => {
    if (req.session.loggedin) {

        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
        res.render("crear-departamento", {
            arrayDepartamentos: arrayDepartamentosDB,
            login: true,
            name: req.session.name

        });
    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }

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




//EDITAR DEPARTAMENTO POR NUMERO ID EN VISTA EDITAR-DEPARTAMENTO
router.get("/departamentos/editar-departamento/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id

        try {
            const departamentoDB = await pool.query("SELECT * FROM departamentos WHERE idDepartamento = ?", [id]);
            // console.log(empleadoDB[0]);
            res.render("editar-departamento", {
                departamento: departamentoDB[0],
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("editar-departamento", {
                error: true,
                mensaje: "no se encuentra el id seleccionado"
            });
        }

    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
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


// RENDERIZANDO Y MOSTRANDO TODOS LOS DESIGNAMIENTO EMPLEADOS*********************
router.get('/asignamientos-departamentos', async(req, res) => {
    if (req.session.loggedin) {

        const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            
                                                            WHERE empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
        res.render("asignamientos-departamentos", {
            empleado_x_departamento: empleado_x_departamentoDB,
            arrayDepartamentos: arrayDepartamentosDB,
            login: true,
            name: req.session.name

        });
    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }

});








module.exports = router;