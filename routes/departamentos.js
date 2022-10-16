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

    const { nombre_dpto, estadoDepartamento } = req.body;
    const nuevoDepartamento = {
        nombre_dpto,
        estadoDepartamento
    };

    const name = req.session.name;
    const novedad = { name, nombre_dpto };
    console.log(novedad)

    await pool.query('INSERT INTO departamentos set ?', [nuevoDepartamento]);
    await pool.query('INSERT INTO novedades_add_dpto set ?', [novedad]);
    // req.flash('success', 'Link guardado correctamente');
    res.redirect('/departamentos');

});

// ELIMINAR DEPARTAMENTO
router.get("/departamentos/:id", async(req, res) => {

    const { id } = req.params;
    console.log(id)

    const nombre_dptoDB = await pool.query(`SELECT nombre_dpto FROM departamentos WHERE idDepartamento = ${id} `);
    const nombre_dpto = nombre_dptoDB[0].nombre_dpto;
    const name = req.session.name;
    const novedad = { name, nombre_dpto };
    console.log(novedad)

    try {

        await pool.query('INSERT INTO novedades_delete_dpto set ?', [novedad]);
        await pool.query("DELETE FROM departamentos WHERE idDepartamento = ?", [id]);

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
    const { nombre_dpto, fechaRegistro, estadoDepartamento } = req.body;
    const nuevoDepartamento = {
        nombre_dpto,
        fechaRegistro,
        estadoDepartamento
    };

    const name = req.session.name;
    const novedad = { name, nombre_dpto };
    console.log(novedad)

    await pool.query('INSERT INTO novedades_edit_dpto set ?', [novedad]);
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