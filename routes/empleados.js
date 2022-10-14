const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");


// RENDERIZANDO Y MOSTRANDO TODOS LOS EMPLEADOS********************
router.get('/empleados', async(req, res) => {
    if (req.session.loggedin) {

        const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            
                                                            WHERE empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
        const arrayEmpleadosDB = await pool.query('SELECT * FROM empleados');
        res.render("empleados", {
            empleado_x_departamento: empleado_x_departamentoDB,
            arrayEmpleados: arrayEmpleadosDB,
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



// RENDER DE VISTA DETALLE-EMPLEADO************
// router.get("/empleados/detalle-empleado", (req, res) => {

//     res.render("detalle-empleado");
// });


//EDITAR EMPLEADO POR NUMERO ID EN VISTA DETALLE-EMPLEADO************
router.get("/empleados/detalle-empleado/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(req.params)

        try {
            const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
            console.log(empleadoDB[0]);
            res.render("detalle-empleado", {
                empleado_x_departamento: empleado_x_departamentoDB,
                empleado: empleadoDB[0],
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("detalle-empleado", {
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

//GUARDAR ACTUALIZACION DE EMPLEADO POR NUMERO ID EN VISTA DETALLE-EMPLEADO**************
router.post('/empleados/detalle-empleado/:id', async(req, res) => {
    const id = req.params.id;
    console.log(req.params.id)
    const { nombre, apellido, cedula, sexo, estatus, departamento, nacimiento, lugarNacimiento, nacionalidad, sueldoBruto, afp, ars, cooperativa, club, prestamos, totalDescuentos, sueldoNeto } = req.body;
    const nuevoEmpleado = {
        nombre,
        apellido,
        cedula,
        sexo,
        estatus,
        // tiempoEmpresa,
        departamento,
        nacimiento,
        lugarNacimiento,
        nacionalidad,
        sueldoBruto,
        afp,
        ars,
        cooperativa,
        club,
        prestamos,
        totalDescuentos,
        sueldoNeto
    };

    await pool.query("UPDATE empleados set ? WHERE idEmpleado = ?", [nuevoEmpleado, id]);
    // req.flash('success', 'Link actualizado correctamente');
    res.redirect('/empleados');
});


//ELIMINAR EMPLEADO 
router.get("/empleados/:id", async(req, res) => {
    const { id } = req.params;
    console.log(id)

    try {

        await pool.query("DELETE FROM empleados WHERE idEmpleado = ?", [id]);
        // req.flash('success', 'Link eliminado correctamente');
        res.redirect("/empleados");

    } catch (error) {
        console.log(error)
    }

});




// RENDERIZANDO VISTA INFORMACION-EMPLEADO no necesario 
// router.get("/empleados/informacion-empleado", (req, res) => {
//     res.render("informacion-empleado");
// });

// RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO POR ID EN LA VISTA INFORMACION-EMPLEADO
router.get("/empleados/informacion-empleado/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id

        try {
            const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
            console.log(empleadoDB[0]);
            res.render("informacion-empleado", {
                empleado_x_departamento: empleado_x_departamentoDB[0],
                empleado: empleadoDB[0],
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("informacion-empleado", {
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


// RENDER DE LA VISTA CREAR EMPLEADO 
router.get('/crear-empleado', async(req, res) => {
    if (req.session.loggedin) {

        let now = moment();
        now = now.format("ll")
        console.log(now);

        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
        console.log(arrayDepartamentosDB)
        res.render("crear-empleado", {
            arrayDepartamentos: arrayDepartamentosDB,
            now: now,
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


//INSERTAR NUEVO EMPLEADO A MYSQL****************
router.post("/crear-empleado", async(req, res) => {
    const { nombre, apellido, cedula, sexo, estatus, departamento, nacimiento, lugarNacimiento, nacionalidad, sueldoBruto, afp, ars, cooperativa, club, prestamos, totalDescuentos, sueldoNeto } = req.body;
    const nuevoEmpleado = {
        nombre,
        apellido,
        cedula,
        sexo,
        estatus,

        departamento,
        nacimiento,
        lugarNacimiento,
        nacionalidad,
        sueldoBruto,
        afp,
        ars,
        cooperativa,
        club,
        prestamos,
        totalDescuentos,
        sueldoNeto
    };

    await pool.query('INSERT INTO empleados set ?', [nuevoEmpleado]);
    // req.flash('success', 'Link guardado correctamente');
    res.redirect('/empleados');

});








// RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO X DEPARTAMENTO X ID EN LA VISTA CREAR-EMPLEADO X DEPARTAMENTO
// router.get("/empleados/informacion-empleado/crear-empleado-x-departamento:id", async(req, res) => {
//     const id = req.params.id
//     console.log(id);

//     try {
//         const empleado_x_departamentoDB = await pool.query("SELECT * FROM empleado_x_departamento WHERE idEmpleado = ?", [id]);
//         console.log(empleado_x_departamentoDB[0]);
//         res.render("crear-empleado-x-departamento", { empleado_x_departamento: empleado_x_departamentoDB[0] });

//     } catch (error) {
//         console.log(error)
//         res.render("crear-empleado-x-departamento", {
//             error: true,
//             mensaje: "no se encuentra el id seleccionado"
//         });
//     }
// });


// RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO X DEPARTAMENTO X ID EN LA VISTA VER-EMPLEADO X DEPARTAMENTO
router.get("/empleados/informacion-empleado/ver-empleado-x-departamento/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(id);


        try {
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
            const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
            console.log(empleado_x_departamentoDB[0]);
            res.render("ver-empleado-x-departamento", {
                empleado: empleadoDB[0],
                empleado_x_departamento: empleado_x_departamentoDB[0],
                empleado_x_departamentoDB: empleado_x_departamentoDB,
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("ver-empleado-x-departamento", {
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



// RENDERIZANDO Y MOSTRANDO EMPLEADO EN VISTA CREAR EMPLEADO X DEPARTAMENTO +++++
router.get("/empleados/informacion-empleado/crear-empleado-x-departamento/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(id);

        try {
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
            const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
            const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
            console.log(empleado_x_departamentoDB[0]);
            res.render("crear-empleado-x-departamento", {
                empleado: empleadoDB[0],
                arrayDepartamentos: arrayDepartamentosDB,
                empleado_x_departamento: empleado_x_departamentoDB[0],
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("crear-empleado-x-departamento", {
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

// // RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO POR ID EN LA VISTA INFORMACION-EMPLEADO
// router.get("/empleados/informacion-empleado/crear-empleado-x-departamento/:id", async(req, res) => {
//     const id = req.params.id

//     try {
//         const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
//         console.log(empleadoDB[0]);
//         res.render("crear-empleado-x-departamento", { empleado: empleadoDB[0] });

//     } catch (error) {
//         console.log(error)
//         res.render("crear-empleado-x-departamento", {
//             error: true,
//             mensaje: "no se encuentra el id seleccionado"
//         });
//     }
// });

// RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO POR ID EN LA VISTA INFORMACION-EMPLEADO ++++
// router.get("/empleados/informacion-empleado/ver-empleado-x-departamento/:id", async(req, res) => {
//     const id = req.params.id

//     try {
//         const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
//         console.log(empleadoDB[0]);
//         res.render("ver-empleado-x-departamento", { empleado: empleadoDB[0] });

//     } catch (error) {
//         console.log(error)
//         res.render("ver-empleado-x-departamento", {
//             error: true,
//             mensaje: "no se encuentra el id seleccionado"
//         });
//     }
// });


// RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO POR ID EN LA VISTA INFORMACION-EMPLEADO
router.get("/empleados/informacion-empleado/:id", async(req, res) => {
    const id = req.params.id

    try {
        const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
        console.log(empleadoDB[0]);
        res.render("informacion-empleado", { empleado: empleadoDB[0] });

    } catch (error) {
        console.log(error)
        res.render("informacion-empleado", {
            error: true,
            mensaje: "no se encuentra el id seleccionado"
        });
    }
});



// INSERTANDO NUEVO EMPLEADO X DEPARTAMENTO 
router.post("/empleados/informacion-empleado/crear-empleado-x-departamento/:id", async(req, res) => {
    const { idEmpleado, idDepartamento, fechaRegistroB, estadoDepartamentoB } = req.body;
    const id = req.params.id
    const nuevoEmpleado_x_departamento = {
        idEmpleado,
        idDepartamento,
        fechaRegistroB,
        estadoDepartamentoB

    };

    await pool.query('INSERT INTO empleado_x_departamento set ?', [nuevoEmpleado_x_departamento]);
    // req.flash('success', 'Link guardado correctamente');
    res.redirect(`/empleados/informacion-empleado/ver-empleado-x-departamento/${id}`);

});

//probar 
//MOSTRANDO LOS DEPARTAMENTOS CREADOS EN LA VISTA CREAR-EMPLEADO X DEPARTAMENTO 
// router.get('/empleados/informacion-empleado/crear-empleado-x-departamento/:id', async(req, res) => {
//     const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
//     const id = req.params.id

//     const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
//     console.log(empleadoDB[0]);
//     res.render("crear-empleado-x-departamento", { empleado: empleadoDB[0] });

//     res.render("crear-empleado-x-departamento", {
//         arrayDepartamentos: arrayDepartamentosDB

//     });

// });



//ELIMINAR DEPARTAMENTO POR EMPLEADO
// router.get("/empleados/informacion-empleado/editar-empleado-x-departamento/:id", async(req, res) => {
//     const id = req.params.id
//     console.log(id);

//     try {
//         const empleado_x_departamentoDB = await pool.query(`DELETE FROM empleado_x_departamento WHERE empleado_x_departamento.idEmpleado = ${id}`);
//         console.log(empleado_x_departamentoDB[0]);

//         // res.render("ver-empleado-x-departamento", { empleado_x_departamento: empleado_x_departamentoDB[0] });

//         res.redirect(`/empleados/informacion-empleado/${id}`);

//     } catch (error) {
//         console.log(error)
//     }

// });



// RENDERIZANDO Y MOSTRANDO EMPLEADO EN VISTA EDITAR EMPLEADO X DEPARTAMENTO +++++
router.get("/empleados/informacion-empleado/editar-empleado-x-departamento/:id", async(req, res) => {
    const id = req.params.id
    console.log(id);

    try {
        const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
        const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos WHERE empleados.idEmpleado = ${id} AND empleados.idEmpleado = empleado_x_departamento.idEmpleado AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento;`);
        console.log(empleado_x_departamentoDB[0]);
        res.render("editar-empleado-x-departamento", {
            empleado: empleadoDB[0],
            arrayDepartamentos: arrayDepartamentosDB,
            empleado_x_departamento: empleado_x_departamentoDB[0],
            login: true,
            name: req.session.name
        });

    } catch (error) {
        console.log(error)
        res.render("editar-empleado-x-departamento", {
            error: true,
            mensaje: "no se encuentra el id seleccionado"
        });
    }
});

//GUARDAR ACTUALIZACION DE DEPARTAMENTO POR NUMERO ID EN VISTA EDITAR-DEPARTAMENTO
router.post('/empleados/informacion-empleado/editar-empleado-x-departamento/:id', async(req, res) => {
    const id = req.params.id;
    console.log(req.params.id)
    const { idEmpleado, idDepartamento, fechaRegistroB, estadoDepartamentoB } = req.body;
    const nuevoEmpleado_x_departamento = {
        idEmpleado,
        idDepartamento,
        fechaRegistroB,
        estadoDepartamentoB

    };

    await pool.query("UPDATE empleado_x_departamento set ? WHERE idEmpleado = ?", [nuevoEmpleado_x_departamento, id]);
    // req.flash('success', 'Link actualizado correctamente');
    res.redirect(`/empleados/informacion-empleado/ver-empleado-x-departamento/${id}`);
});


module.exports = router;