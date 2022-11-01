const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");


// RENDERIZANDO Y MOSTRANDO TODOS LOS EMPLEADOS********************
router.get('/empleados', async(req, res) => {
    if (req.session.loggedin) {

        // const descuentoAcumuladoDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoAcumulado FROM descuentos_x_empleados 
        //                                                     WHERE nombreDescuento IN ('Afp','Ars','Cooperativa','Otros','Prestamo')
        //                                                     AND descuentos_x_empleados.idEmpleado = ${id}
        //                                                     AND descuentos_x_empleados.estadoDescuento = 'Activo'`);
        const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            
                                                            WHERE empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
        const arrayEmpleadosDB = await pool.query('SELECT * FROM empleados WHERE estatus="Activo"');
        res.render("empleados", {
            // descuentoAcumulado: descuentoAcumuladoDB,
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

// RENDERIZANDO Y MOSTRANDO  EMPLEADOS INACTIVOS********************
router.get('/empleados-inactivos', async(req, res) => {
    if (req.session.loggedin) {

        // const descuentoAcumuladoDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoAcumulado FROM descuentos_x_empleados 
        //                                                     WHERE nombreDescuento IN ('Afp','Ars','Cooperativa','Otros','Prestamo')
        //                                                     AND descuentos_x_empleados.idEmpleado = ${id}
        //                                                     AND descuentos_x_empleados.estadoDescuento = 'Activo'`);
        const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            
                                                            WHERE empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
        const arrayEmpleadosDB = await pool.query('SELECT * FROM empleados WHERE estatus="Inactivo"');
        res.render("empleados-inactivos", {
            // descuentoAcumulado: descuentoAcumuladoDB,
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



//EDITAR EMPLEADO POR NUMERO ID EN VISTA DETALLE-EMPLEADO************
router.get("/empleados/detalle-empleado/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(req.params)

        try {


            const sueldoNetoDB = await pool.query(`SELECT 
                                                            (empleados.sueldoBruto + empleados.comision ) - SUM(descuentos_x_empleados.montoDescuento) montoSueldoNeto
                                                            FROM descuentos_x_empleados, empleados
                                                            WHERE descuentos_x_empleados.idEmpleado = ${id}
                                                            AND empleados.idEmpleado = descuentos_x_empleados.idEmpleado
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE() `);
            const descuentoAcumuladoDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoAcumulado FROM descuentos_x_empleados 
                                                            WHERE nombreDescuento IN ('Afp','Ars','Cooperativa','Otros','Prestamo')
                                                            AND descuentos_x_empleados.idEmpleado = ${id}
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE()`);
            const descuentoOtrosDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoOtros FROM descuentos_x_empleados 
                                                            WHERE nombreDescuento = 'Otros'
                                                            AND descuentos_x_empleados.idEmpleado = ${id}
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE()`);
            const descuentoCooperativaDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoCooperativa FROM descuentos_x_empleados 
                                                            WHERE nombreDescuento = 'Cooperativa'
                                                            AND descuentos_x_empleados.idEmpleado = ${id}
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE()`);
            const descuentoAfpDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoAfp FROM descuentos_x_empleados 
                                                            WHERE nombreDescuento = 'Afp'
                                                            AND descuentos_x_empleados.idEmpleado = ${id}
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE()`);
            const descuentoArsDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoArs FROM descuentos_x_empleados 
                                                            WHERE nombreDescuento = 'Ars'
                                                            AND descuentos_x_empleados.idEmpleado = ${id}
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE()`);
            const descuentoPrestamoDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoPrestamo FROM descuentos_x_empleados 
                                                            WHERE nombreDescuento = 'Prestamo'
                                                            AND descuentos_x_empleados.idEmpleado = ${id}
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE()`);
            const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento
                                                            AND empleado_x_departamento.estadoDepartamentoB = "Activo"`);
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
            // await pool.query(`INSERT INTO empleados WHERE empleados.idEmpleado = ${id} `);
            console.log(descuentoAfpDB[0]);
            console.log(descuentoArsDB[0]);
            console.log(descuentoPrestamoDB[0]);
            console.log(empleadoDB[0]);
            res.render("detalle-empleado", {
                sueldoNeto: sueldoNetoDB[0],
                descuentoAcumulado: descuentoAcumuladoDB[0],
                descuentoOtros: descuentoOtrosDB[0],
                descuentoCooperativa: descuentoCooperativaDB[0],
                descuentoAfp: descuentoAfpDB[0],
                descuentoPrestamo: descuentoPrestamoDB[0],
                descuentoArs: descuentoArsDB[0],
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
    const { nombre, apellido, cedula, sexo, estatus, departamento, nacimiento, lugarNacimiento, nacionalidad, sueldoBruto, afp, ars, cooperativa, club, prestamos, totalDescuentos, sueldoNeto, comision } = req.body;
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
        sueldoNeto,
        comision
    };

    await pool.query("UPDATE empleados set ? WHERE idEmpleado = ?", [nuevoEmpleado, id]);
    // req.flash('success', 'Link actualizado correctamente');
    res.redirect(`/empleados/detalle-empleado/${id}`);
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


// RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO POR ID EN LA VISTA INFORMACION-EMPLEADO
router.get("/empleados/informacion-empleado/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id

        try {
            const validacionPagos_x_empleadoDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} `);

            const arrayDescuento_x_empleadoDB = await pool.query(`SELECT descuentos_x_empleados.idDescuento_x_empleado FROM descuentos_x_empleados, empleados
                                                                    WHERE descuentos_x_empleados.idEmpleado  = ${id}
                                                                    AND empleados.idEmpleado = descuentos_x_empleados.idEmpleado 
                                                                    AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                                    AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                                    AND descuentos_x_empleados.fechaFinal >= CURDATE() `);
            const descuentoAcumuladoDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoAcumulado FROM descuentos_x_empleados 
                                                            WHERE nombreDescuento IN ('Afp','Ars','Cooperativa','Otros','Prestamo')
                                                            AND descuentos_x_empleados.idEmpleado = ${id}
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE()`);
            const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento
                                                            AND empleado_x_departamento.estadoDepartamentoB = "Activo"`);
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
            console.log(empleadoDB[0]);
            res.render("informacion-empleado", {
                validacionPagos_x_empleado: validacionPagos_x_empleadoDB,
                arrayDescuento_x_empleado: arrayDescuento_x_empleadoDB,
                descuentoAcumulado: descuentoAcumuladoDB[0],
                empleado_x_departamento: empleado_x_departamentoDB[0],
                empleado: empleadoDB[0],
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("informacion-empleado", {
                error: true,
                mensaje: "no se encuentra el id seleccionado",

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
    const { nombre, apellido, cedula, sexo, estatus, departamento, nacimiento, lugarNacimiento, nacionalidad, direccion, correo, sueldoBruto, afp, ars, cooperativa, club, prestamos, totalDescuentos, sueldoNeto, comision, condicionContrato, formaPago } = req.body;
    const nuevoEmpleado = {
        nombre,
        apellido,
        cedula,
        sexo,
        estatus,
        departamento,
        nacimiento,
        direccion,
        correo,
        lugarNacimiento,
        nacionalidad,
        sueldoBruto,
        afp,
        ars,
        cooperativa,
        club,
        prestamos,
        totalDescuentos,
        sueldoNeto,
        comision,
        condicionContrato,
        formaPago

    };

    await pool.query('INSERT INTO empleados set ?', [nuevoEmpleado]);
    // req.flash('success', 'Link guardado correctamente');
    res.redirect('/empleados');

});


// RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO X DEPARTAMENTO X ID EN LA VISTA VER-EMPLEADO X DEPARTAMENTO
router.get("/empleados/informacion-empleado/ver-empleado-x-departamento/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(id);


        try {

            const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
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

// ELIMINANDO DEPARTAMENTO POR EMPLEADO
router.get("/empleados/informacion-empleado/eliminar-departamento-x-empleado/:id", async(req, res) => {
    const { id } = req.params;
    console.log(id)

    try {


        const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado_x_departamento  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento`);

        await pool.query("DELETE FROM empleado_x_departamento WHERE idEmpleado_x_departamento = ?", [id]);
        console.log(empleado_x_departamentoDB[0].idEmpleado)
        res.redirect(`/empleados/informacion-empleado/ver-empleado-x-departamento/${empleado_x_departamentoDB[0].idEmpleado}`);


    } catch (error) {
        console.log(error)
    }

});



// RENDERIZANDO Y MOSTRANDO EMPLEADO EN VISTA CREAR EMPLEADO X DEPARTAMENTO +++++
router.get("/empleados/informacion-empleado/crear-empleado-x-departamento/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(id);

        try {
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
            const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos WHERE estadoDepartamento = "Activo"');
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


// RENDERIZANDO Y MOSTRANDO DATOS DE EMPLEADO POR ID EN LA VISTA INFORMACION-EMPLEADO
// router.get("/empleados/informacion-empleado/:id", async(req, res) => {
//     const id = req.params.id


//     try {

//         const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
//         console.log(empleadoDB[0]);
//         res.render("informacion-empleado", {
//             empleado: empleadoDB[0]
//         });

//     } catch (error) {
//         console.log(error)
//         res.render("informacion-empleado", {
//             error: true,
//             mensaje: "no se encuentra el id seleccionado"
//         });
//     }
// });



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


// RENDERIZANDO Y MOSTRANDO EMPLEADO EN VISTA EDITAR EMPLEADO X DEPARTAMENTO +++++
router.get("/empleados/informacion-empleado/editar-empleado-x-departamento/:id", async(req, res) => {
    const id = req.params.id
    console.log(id);

    try {
        const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos WHERE estadoDepartamento = "Activo"');
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

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ DESCUENTOS

// RENDERIZANDO Y MOSTRANDO VISTA CREAR DESCUENTO X EMPLEADO
router.get("/empleados/informacion-empleado/crear-descuento-x-empleado/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(id);

        try {
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);

            res.render("crear-descuento-x-empleado", {
                empleado: empleadoDB[0],

                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("crear-descuento-x-empleado", {
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

// RENDERIZANDO Y MOSTRANDO VISTA CREAR DESCUENTO X EMPLEADO
router.post("/empleados/informacion-empleado/crear-descuento-x-empleado/:id", async(req, res) => {
    const { idEmpleado, tipoDescuento, nombreDescuento, montoDescuento, estadoDescuento, fechaInicial, fechaFinal, observacionDescuento } = req.body;
    const id = req.params.id
    const nuevoDescuento_x_empleado = {
        idEmpleado,
        tipoDescuento,
        nombreDescuento,
        montoDescuento,
        estadoDescuento,
        fechaInicial,
        fechaFinal,
        observacionDescuento

    };


    await pool.query('INSERT INTO descuentos_x_empleados set ?', [nuevoDescuento_x_empleado]);


    // req.flash('success', 'Link guardado correctamente');
    res.redirect(`/empleados/informacion-empleado/ver-descuento-x-empleado/${id}`);

});

// RENDERIZANDO Y MOSTRANDO VISTA VER DESCUENTO X EMPLEADO
router.get("/empleados/informacion-empleado/ver-descuento-x-empleado/:id", async(req, res) => {
    const id = req.params.id
    console.log(id);


    try {
        const arrayDescuento_x_empleadoDB = await pool.query(`SELECT * FROM descuentos_x_empleados, empleados
                                                            WHERE descuentos_x_empleados.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = descuentos_x_empleados.idEmpleado;`);
        const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
        console.log(arrayDescuento_x_empleadoDB);
        res.render("ver-descuento-x-empleado", {
            empleado: empleadoDB[0],
            arrayDescuento_x_empleado: arrayDescuento_x_empleadoDB,
            login: true,
            name: req.session.name
        });

    } catch (error) {
        console.log(error)
        res.render("pagos", {
            error: true,
            mensaje: "no se encuentra el id seleccionado",
            login: true,
            name: req.session.name
        });
    }
});


// ELIMINANDO DESCUENTO POR EMPLEADO
router.get("/empleados/informacion-empleado/eliminar-descuento-x-empleado/:id", async(req, res) => {
    const { id } = req.params;
    console.log(id)

    try {


        const arrayDescuento_x_empleadoDB = await pool.query(`SELECT * FROM descuentos_x_empleados, empleados
                                                            WHERE descuentos_x_empleados.idDescuento_x_empleado  = ${id}
                                                            AND empleados.idEmpleado = descuentos_x_empleados.idEmpleado;`);
        await pool.query("DELETE FROM descuentos_x_empleados WHERE idDescuento_x_empleado = ?", [id]);
        console.log(arrayDescuento_x_empleadoDB[0].idEmpleado)
        res.redirect(`/empleados/informacion-empleado/ver-descuento-x-empleado/${arrayDescuento_x_empleadoDB[0].idEmpleado}`);


    } catch (error) {
        console.log(error)
    }

});

// RENDERIZANDO Y MOSTRANDO VISTA EDITAR DESCUENTO X EMPLEADO
router.get("/empleados/informacion-empleado/editar-descuento-x-empleado/:id", async(req, res) => {
    const id = req.params.id
    console.log(id);


    try {

        const arrayDescuento_x_empleadoDB = await pool.query(`SELECT * FROM descuentos_x_empleados, empleados
                                                            WHERE descuentos_x_empleados.idDescuento_x_empleado  = ${id}
                                                            AND empleados.idEmpleado = descuentos_x_empleados.idEmpleado;`);

        console.log(arrayDescuento_x_empleadoDB[0]);
        // const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
        res.render("editar-descuento-x-empleado", {
            // empleado: empleadoDB[0],
            arrayDescuento_x_empleado: arrayDescuento_x_empleadoDB[0],
            login: true,
            name: req.session.name
        });

    } catch (error) {
        console.log(error)
        res.render("pagos", {
            error: true,
            mensaje: "no se encuentra el id seleccionado",
            login: true,
            name: req.session.name
        });
    }
});

// INSERTANDO MODIFICACION DESCUENTO X EMPLEADO 
router.post('/empleados/informacion-empleado/editar-descuento-x-empleado/:id', async(req, res) => {
    const id = req.params.id
    console.log(id)
    const { idEmpleado, tipoDescuento, nombreDescuento, montoDescuento, estadoDescuento, observacionDescuento } = req.body;
    const nuevoDescuento_x_empleado = {
        idEmpleado,
        tipoDescuento,
        nombreDescuento,
        montoDescuento,
        estadoDescuento,

        observacionDescuento

    };

    await pool.query("UPDATE descuentos_x_empleados set ? WHERE idDescuento_x_empleado = ?", [nuevoDescuento_x_empleado, id]);
    // req.flash('success', 'Link actualizado correctamente');
    res.redirect(`/empleados/informacion-empleado/ver-descuento-x-empleado/${idEmpleado}`);
});



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ PAGOS


// RENDERIZANDO Y MOSTRANDO VISTA CREAR PAGO X EMPLEADO
router.get("/empleados/informacion-empleado/crear-pago-x-empleado/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(id);

        try {
            const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
            const empleado_x_departamentoDB = await pool.query(`SELECT * FROM empleado_x_departamento, empleados, departamentos
                                                            WHERE empleado_x_departamento.idEmpleado  = ${id}
                                                            AND empleados.idEmpleado = empleado_x_departamento.idEmpleado
                                                            AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento
                                                            AND empleado_x_departamento.estadoDepartamentoB = "Activo"`);
            const descuentoAcumuladoDB = await pool.query(`SELECT SUM(montoDescuento) montoDescuentoAcumulado from descuentos_x_empleados
                                                                WHERE descuentos_x_empleados.idEmpleado = ${id}
                                                                AND descuentos_x_empleados.estadoDescuento = "Activo"
                                                                AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                                AND descuentos_x_empleados.fechaFinal >= CURDATE()`);
            const sueldoNetoDB = await pool.query(`SELECT empleados.sueldoBruto  - SUM(descuentos_x_empleados.montoDescuento) montoSueldoNeto
                                                            FROM descuentos_x_empleados, empleados
                                                            WHERE descuentos_x_empleados.idEmpleado = ${id}
                                                            AND empleados.idEmpleado = descuentos_x_empleados.idEmpleado
                                                            AND descuentos_x_empleados.estadoDescuento = 'Activo' 
                                                            AND descuentos_x_empleados.fechaInicial <= CURDATE()
                                                            AND descuentos_x_empleados.fechaFinal >= CURDATE() `);

            console.log(descuentoAcumuladoDB[0])
            res.render("crear-pago-x-empleado", {
                empleado: empleadoDB[0],
                empleado_x_departamento: empleado_x_departamentoDB,
                descuentoAcumulado: descuentoAcumuladoDB[0],
                sueldoNeto: sueldoNetoDB[0],
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("crear-pago-x-empleado", {
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


// INSERTANDO NUEVO PAGO X EMPLEADO 
router.post("/empleados/informacion-empleado/crear-pago-x-empleado/:id", async(req, res) => {
    const { idEmpleado, departamento, frecuenciaPago, periodo, descuento, sueldoNeto, fechaPago, estadoPago, observacionPago, comisionP } = req.body;
    const id = req.params.id
    const nuevoPago_x_empleado = {
        idEmpleado,
        departamento,
        frecuenciaPago,
        periodo,
        descuento,
        sueldoNeto,
        fechaPago,
        estadoPago,
        observacionPago,
        comisionP

    };


    await pool.query('INSERT INTO pagos_x_empleados set ?', [nuevoPago_x_empleado]);


    // req.flash('success', 'Link guardado correctamente');
    res.redirect(`/empleados/informacion-empleado/${id}`);

});


// RENDERIZANDO Y MOSTRANDO VISTA VER PAGO X EMPLEADO
router.get("/empleados/informacion-empleado/ver-pago-x-empleado/:id", async(req, res) => {
    const id = req.params.id
        // console.log(id);


    try {

        const validacionPagos_x_empleadoDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} `);
        const arrayPagos_x_empleadoEneroDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Enero"`);
        const arrayPagos_x_empleadoFebreroDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Febrero"`);
        const arrayPagos_x_empleadoMarzoDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Marzo"`);
        const arrayPagos_x_empleadoAbrilDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Abril"`);
        const arrayPagos_x_empleadoMayoDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Mayo"`);
        const arrayPagos_x_empleadoJunioDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Junio"`);
        const arrayPagos_x_empleadoJulioDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Julio"`);
        const arrayPagos_x_empleadoAgostoDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Agosto"`);
        const arrayPagos_x_empleadoSeptiembreDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Septiembre"`);
        const arrayPagos_x_empleadoOctubreDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Octubre"`);
        const arrayPagos_x_empleadoNoviembreDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Noviembre"`);
        const arrayPagos_x_empleadoDiciembreDB = await pool.query(`SELECT * FROM pagos_x_empleados WHERE pagos_x_empleados.idEmpleado  = ${id} and pagos_x_empleados.periodo = "Diciembre"`);
        const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);


        // console.log(empleadoDB[0])
        res.render("ver-pago-x-empleado", {
            empleado: empleadoDB[0],
            validacionPagos_x_empleado: validacionPagos_x_empleadoDB,
            arrayPagos_x_empleadoEnero: arrayPagos_x_empleadoEneroDB,
            arrayPagos_x_empleadoFebrero: arrayPagos_x_empleadoFebreroDB,
            arrayPagos_x_empleadoMarzo: arrayPagos_x_empleadoMarzoDB,
            arrayPagos_x_empleadoAbril: arrayPagos_x_empleadoAbrilDB,
            arrayPagos_x_empleadoMayo: arrayPagos_x_empleadoMayoDB,
            arrayPagos_x_empleadoJunio: arrayPagos_x_empleadoJunioDB,
            arrayPagos_x_empleadoJulio: arrayPagos_x_empleadoJulioDB,
            arrayPagos_x_empleadoAgosto: arrayPagos_x_empleadoAgostoDB,
            arrayPagos_x_empleadoSeptiembre: arrayPagos_x_empleadoSeptiembreDB,
            arrayPagos_x_empleadoOctubre: arrayPagos_x_empleadoOctubreDB,
            arrayPagos_x_empleadoNoviembre: arrayPagos_x_empleadoNoviembreDB,
            arrayPagos_x_empleadoDiciembre: arrayPagos_x_empleadoDiciembreDB,
            login: true,
            name: req.session.name
        });

    } catch (error) {
        console.log(error)
        res.render("ver-pago-x-empleado", {
            error: true,
            mensaje: "no se encuentra el id seleccionado",
            login: true,
            name: req.session.name
        });
    }
});


// RENDERIZANDO Y MOSTRANDO VISTA EDITAR PAGO X EMPLEADO
router.get("/empleados/informacion-empleado/editar-pago-x-empleado/:id", async(req, res) => {
    const id = req.params.id
    console.log(id);


    try {

        const arrayPagos_x_empleadoDB = await pool.query(`SELECT * FROM pagos_x_empleados, empleados
                                                        WHERE pagos_x_empleados.idPago_x_empleado  = ${id}
                                                        AND empleados.idEmpleado = pagos_x_empleados.idEmpleado`);


        console.log(arrayPagos_x_empleadoDB[0]);
        // const empleadoDB = await pool.query("SELECT * FROM empleados WHERE idEmpleado = ?", [id]);
        res.render("editar-pago-x-empleado", {
            // empleado: empleadoDB[0],
            arrayPagos_x_empleado: arrayPagos_x_empleadoDB[0],
            login: true,
            name: req.session.name
        });

    } catch (error) {
        console.log(error)
        res.render("editar-pago-x-empleado", {
            error: true,
            mensaje: "no se encuentra el id seleccionado",
            login: true,
            name: req.session.name
        });
    }
});

// INSERTANDO MODIFICACION PAGO X 
router.post('/empleados/informacion-empleado/editar-pago-x-empleado/:id', async(req, res) => {
    const { idEmpleado, frecuenciaPago, periodo, estadoPago, observacionPago } = req.body;
    const id = req.params.id
    const nuevoPago_x_empleado = {
        idEmpleado,
        // departamento,
        frecuenciaPago,
        periodo,
        // descuento,
        // sueldoNeto,
        // fechaPago,
        estadoPago,
        observacionPago

    };

    await pool.query("UPDATE pagos_x_empleados set ? WHERE idPago_x_empleado = ?", [nuevoPago_x_empleado, id]);
    // req.flash('success', 'Link actualizado correctamente');
    res.redirect(`/empleados/informacion-empleado/ver-pago-x-empleado/${idEmpleado}`);
});


// ELIMINANDO PAGO POR EMPLEADO
router.get("/empleados/informacion-empleado/eliminar-pago-x-empleado/:id", async(req, res) => {
    const { id } = req.params;
    console.log(id)

    try {


        const arrayPagos_x_empleadoDB = await pool.query(`SELECT * FROM pagos_x_empleados, empleados
                                                            WHERE pagos_x_empleados.idPago_x_empleado  = ${id}
                                                            AND empleados.idEmpleado = pagos_x_empleados.idEmpleado;`);
        await pool.query("DELETE FROM pagos_x_empleados WHERE idPago_x_empleado = ?", [id]);
        // console.log(arrayDescuento_x_empleadoDB[0].idEmpleado)
        res.redirect(`/empleados/informacion-empleado/ver-pago-x-empleado/${arrayPagos_x_empleadoDB[0].idEmpleado}`);


    } catch (error) {
        console.log(error)
    }

});


module.exports = router;