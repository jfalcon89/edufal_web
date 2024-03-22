const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");


// RENDERIZANDO Y MOSTRANDO TODOS LOS ESTUDIANTES >>>>>>>>>>>>
router.get('/admin/estudiantes-adm', async(req, res) => {
    if (req.session.loggedin) {


        const arrayEstudiantesDB = await pool.query('SELECT * FROM estudiantes WHERE estatus="Activo"');

        const pendienteDB = await pool.query(`SELECT
    e.cedula,
    e.nombre,
    SUM(CAST(REPLACE(REPLACE(i.precioOferta_inscripcion, '$', ''), ',', '') AS DECIMAL(10,2))) - COALESCE(p.total_monto_pagado, 0) AS monto_pendiente
FROM
    estudiantes e
JOIN
    inscripciones i ON e.cedula = i.cedula
LEFT JOIN (
    SELECT cedula_pago, SUM(monto_pago) AS total_monto_pagado
    FROM pagos_estudiantes
    GROUP BY cedula_pago
) p ON e.cedula = p.cedula_pago
WHERE
    i.estado_inscripcion IN ('Nuevo', 'Iniciado', 'Finalizado')
GROUP BY
    e.cedula, e.nombre;`);


        console.log(pendienteDB)

        res.render("estudiantes-adm", {
            arrayEstudiantes: arrayEstudiantesDB,
            pendiente: pendienteDB,
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

// RENDERIZANDO Y MOSTRANDO TODOS LOS ESTUDIANTES >>>>>>>>>>>>
router.get('/admin/estudiantes-inactivos-adm', async(req, res) => {
    if (req.session.loggedin) {


        const arrayEstudiantesDB = await pool.query('SELECT * FROM estudiantes WHERE estatus="Inactivo"');
        const pendienteDB = await pool.query(`SELECT
    e.cedula,
    e.nombre,
    SUM(CAST(REPLACE(REPLACE(i.precioOferta_inscripcion, '$', ''), ',', '') AS DECIMAL(10,2))) - COALESCE(p.total_monto_pagado, 0) AS monto_pendiente
FROM
    estudiantes e
JOIN
    inscripciones i ON e.cedula = i.cedula
LEFT JOIN (
    SELECT cedula_pago, SUM(monto_pago) AS total_monto_pagado
    FROM pagos_estudiantes
    GROUP BY cedula_pago
) p ON e.cedula = p.cedula_pago
WHERE
    i.estado_inscripcion IN ('Nuevo', 'Iniciado', 'Finalizado')
GROUP BY
    e.cedula, e.nombre;`);


        console.log(pendienteDB)

        res.render("estudiantes-inactivos-adm", {
            arrayEstudiantes: arrayEstudiantesDB,
            pendiente: pendienteDB,
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



//EDITAR ESTUDIANTE >>>>>>>>>>>>
router.get("/admin/estudiantes-adm/editar-estudiante-adm/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id

        console.log(req.params)

        try {
            const estudianteDB = await pool.query("SELECT * FROM estudiantes WHERE id_estudiante = ?", [id]);
            const curso_x_estudianteDB = await pool.query(`SELECT * FROM inscripciones, cursos where inscripciones.cedula  = '${estudianteDB[0].cedula}' and inscripciones.id_curso = cursos.id_curso`);
            const monto_pendienteDB = await pool.query(`SELECT SUM(CAST(REPLACE(REPLACE(precioOferta_inscripcion, '$', ''), ',', '') AS DECIMAL(10,2))) AS monto_pendiente
                                                            FROM inscripciones 
                                                            WHERE inscripciones.cedula = '${estudianteDB[0].cedula}' and inscripciones.estado_inscripcion in ('Nuevo', 'Iniciado', 'Finalizado')`);
            const monto_pagoDB = await pool.query(`SELECT SUM(monto_pago) AS monto_pago
                                                            FROM pagos_estudiantes
                                                            WHERE pagos_estudiantes.cedula_pago = '${estudianteDB[0].cedula}'`);

            const balance_pendiente = monto_pendienteDB[0].monto_pendiente - monto_pagoDB[0].monto_pago

            console.log('cedulaDB ' + estudianteDB[0].cedula)
            console.log('monto pendiente ' + monto_pendienteDB[0].monto_pendiente)
            console.log('monto pago ' + monto_pagoDB[0].monto_pago)
            console.log('balance total ' + balance_pendiente)

            res.render("editar-estudiante-adm", {
                curso_x_estudiante: curso_x_estudianteDB,
                estudiante: estudianteDB[0],
                monto_pendiente: monto_pendienteDB[0].monto_pendiente,
                monto_pago: monto_pagoDB[0].monto_pago,
                balance_pendiente,
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("editar-estudiantes-adm", {
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

//GUARDAR ACTUALIZACION DE ESTUDIANTE >>>>>>>>>>>>
router.post('/admin/estudiantes-adm/editar-estudiante-adm/:id', async(req, res) => {
    const id = req.params.id;
    console.log(req.params.id)
    const { nombre, apellido, cedula, fecha_nacimiento, direccion, sexo, estatus, pais, forma_pago, telefono, correo_electronico } = req.body;
    const updateEstudiante = {
        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        sexo,
        estatus,
        pais,
        forma_pago,
        telefono,
        correo_electronico
    };

    await pool.query("UPDATE estudiantes set ? WHERE id_estudiante = ?", [updateEstudiante, id]);
    // req.flash('success', 'Link actualizado correctamente');
    res.redirect(`/admin/estudiantes-adm/editar-estudiante-adm/${id}`);
});


//ELIMINAR ESTUDIANTE >>>>>>>>>>>>
router.get("/admin/estudiantes-adm/eliminar-estudiante-adm/:id", async(req, res) => {
    const { id } = req.params;
    console.log(id)

    try {
        await pool.query("DELETE FROM estudiantes WHERE Id_estudiante = ?", [id]);
        res.redirect("/admin/estudiantes-adm");

    } catch (error) {
        console.log(error)
    }
});

// NO USADO
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


//CREAR ESTUDIANTE >>>>>>>>>>>>
router.get('/admin/crear-estudiante-adm', async(req, res) => {
    if (req.session.loggedin) {

        let now = moment();
        now = now.format("ll")
        console.log(now);

        const arrayCursosDB = await pool.query('SELECT * FROM cursos');
        res.render("crear-estudiante-adm", {
            arrayCursos: arrayCursosDB,
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

//INSERTAR NUEVO ESTUDIANTE DESDE ADMIN >>>>>>>>>>>>
router.post("/admin/crear-estudiante-adm", async(req, res) => {
    const { nombre, apellido, cedula, fecha_nacimiento, direccion, sexo, estatus, pais, forma_pago, telefono, correo_electronico } = req.body;
    const nuevoEstudiante = {
        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        sexo,
        estatus,
        pais,
        forma_pago,
        telefono,
        correo_electronico
    };

    await pool.query('INSERT INTO estudiantes set ?', [nuevoEstudiante]);
    res.redirect('/admin/estudiantes-adm');

});

// NO USADO
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

// NO USADO
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

// NO USADO
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


// VISTA INFORMACION DE ESTUDIANTE >>>>>>>>>>>
router.get("/admin/estudiantes-adm/informacion-estudiante-adm/:id", async(req, res) => {
    if (req.session.loggedin) {
        const id = req.params.id

        try {
            const estudianteDB = await pool.query("SELECT * FROM estudiantes WHERE id_estudiante = ?", [id]);
            const pagos_estudianteDB = await pool.query("SELECT * FROM pagos_estudiantes WHERE id_estudiante = ?", [id]);

            const cant_pagos_estudianteDB = await pool.query(`SELECT count(id_pago_estudiante) AS cant_pagos_estudiante 
                                                    FROM pagos_estudiantes
                                                    WHERE pagos_estudiantes.id_estudiante = '${id}'`);
            console.log(estudianteDB[0]);
            res.render("informacion-estudiante-adm", {
                estudiante: estudianteDB[0],
                pagos_estudiante: pagos_estudianteDB[0],
                cant_pagos_estudiante: cant_pagos_estudianteDB[0].cant_pagos_estudiante,
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("informacion-estudiante-adm", {
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


// NO USADO
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

// NO USADO
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

// NO USADO
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

// NO USADO
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

// NO USADO
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

    res.redirect(`/empleados/informacion-empleado/ver-descuento-x-empleado/${id}`);

});

// NO USADO
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

// NO USADO
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

// NO USADO
// RENDERIZANDO Y MOSTRANDO VISTA EDITAR DESCUENTO X EMPLEADO
router.get("/empleados/informacion-empleado/editar-descuento-x-empleado/:id", async(req, res) => {
    const id = req.params.id
    console.log(id);

    try {
        const arrayDescuento_x_empleadoDB = await pool.query(`SELECT * FROM descuentos_x_empleados, empleados
                                                            WHERE descuentos_x_empleados.idDescuento_x_empleado  = ${id}
                                                            AND empleados.idEmpleado = descuentos_x_empleados.idEmpleado;`);

        console.log(arrayDescuento_x_empleadoDB[0]);

        res.render("editar-descuento-x-empleado", {
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

// NO USADO
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



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ PAGOS @@@@@@@@@@@@@@@@@@@@@@@@@@@@
// VISTA CREAR PAGO X ESTUDIANTE >>>>>>>>>>>
router.get("/admin/estudiantes-adm/informacion-estudiante-adm/crear-pago-x-estudiante/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(id);

        try {
            const estudianteDB = await pool.query("SELECT * FROM estudiantes WHERE id_estudiante = ?", [id]);
            const inscripcionesDB = await pool.query("SELECT * FROM inscripciones WHERE inscripciones.cedula = ?", [estudianteDB[0].cedula]);
            const monto_pendienteDB = await pool.query(`SELECT SUM(CAST(REPLACE(REPLACE(precioOferta_inscripcion, '$', ''), ',', '') AS DECIMAL(10,2))) AS monto_pendiente
                                                            FROM inscripciones 
                                                            WHERE inscripciones.cedula = '${estudianteDB[0].cedula}' and inscripciones.estado_inscripcion in ('Nuevo', 'Iniciado', 'Finalizado')`);
            const monto_pagoDB = await pool.query(`SELECT SUM(monto_pago) AS monto_pago
                                                            FROM pagos_estudiantes
                                                            WHERE pagos_estudiantes.cedula_pago = '${estudianteDB[0].cedula}'`);

            const balance_pendiente = monto_pendienteDB[0].monto_pendiente - monto_pagoDB[0].monto_pago

            console.log(balance_pendiente)

            res.render("crear-pago-x-estudiante", {
                estudiante: estudianteDB[0],
                inscripciones: inscripcionesDB,
                balance_pendiente,
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("crear-pago-x-estudiante", {
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


// INSERTANDO NUEVO PAGO X ESTUDIANTE >>>>>>>>>>>>>>>
router.post("/admin/estudiantes-adm/informacion-estudiante-adm/crear-pago-x-estudiante/:id", async(req, res) => {
    const { cedula_pago, id_estudiante, nombre, apellido, periodo, monto_pago, fecha_pago, observacion_pago, curso_pago } = req.body;
    const id = req.params.id
    const nuevo_Pago_x_estudiante = {
        cedula_pago,
        id_estudiante,
        nombre,
        apellido,
        periodo,
        monto_pago,
        fecha_pago,
        observacion_pago,
        curso_pago
    };


    await pool.query('INSERT INTO pagos_estudiantes set ?', [nuevo_Pago_x_estudiante]);

    res.redirect(`/admin/estudiantes-adm/informacion-estudiante-adm/${id}`);

});


// VISTA VER PAGO X ESTUDIANTE
router.get("/admin/estudiantes-adm/informacion-estudiante-adm/ver-pago-x-estudiante/:id", async(req, res) => {
    const id = req.params.id

    try {
        const estudianteDB = await pool.query("SELECT * FROM estudiantes WHERE id_estudiante = ?", [id]);

        const arrayPagos_estudianteEneroDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Enero"`);
        const arrayPagos_estudianteFebreroDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Febrero"`);
        const arrayPagos_estudianteMarzoDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Marzo"`);
        const arrayPagos_estudianteAbrilDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Abril"`);
        const arrayPagos_estudianteMayoDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Mayo"`);
        const arrayPagos_estudianteJunioDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Junio"`);
        const arrayPagos_estudianteJulioDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Julio"`);
        const arrayPagos_estudianteAgostoDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Agosto"`);
        const arrayPagos_estudianteSeptiembreDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Septiembre"`);
        const arrayPagos_estudianteOctubreDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Octubre"`);
        const arrayPagos_estudianteNoviembreDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Noviembre"`);
        const arrayPagos_estudianteDiciembreDB = await pool.query(`SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_estudiante  = ${id} and pagos_estudiantes.periodo = "Diciembre"`);


        res.render("ver-pago-x-estudiante", {
            estudiante: estudianteDB[0],
            arrayPagos_estudianteEnero: arrayPagos_estudianteEneroDB,
            arrayPagos_estudianteFebrero: arrayPagos_estudianteFebreroDB,
            arrayPagos_estudianteMarzo: arrayPagos_estudianteMarzoDB,
            arrayPagos_estudianteAbril: arrayPagos_estudianteAbrilDB,
            arrayPagos_estudianteMayo: arrayPagos_estudianteMayoDB,
            arrayPagos_estudianteJunio: arrayPagos_estudianteJunioDB,
            arrayPagos_estudianteJulio: arrayPagos_estudianteJulioDB,
            arrayPagos_estudianteAgosto: arrayPagos_estudianteAgostoDB,
            arrayPagos_estudianteSeptiembre: arrayPagos_estudianteSeptiembreDB,
            arrayPagos_estudianteOctubre: arrayPagos_estudianteOctubreDB,
            arrayPagos_estudianteNoviembre: arrayPagos_estudianteNoviembreDB,
            arrayPagos_estudianteDiciembre: arrayPagos_estudianteDiciembreDB,
            login: true,
            name: req.session.name
        });

    } catch (error) {
        console.log(error)
        res.render("ver-pago-x-estudiante", {
            error: true,
            mensaje: "no se encuentra el id seleccionado",
            login: true,
            name: req.session.name
        });
    }
});


// VISTA EDITAR PAGO X ESTUDIANTE >>>>>>>>>>>>>>>
router.get("/admin/estudiantes-adm/informacion-estudiante-adm/editar-pago-x-estudiante/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        console.log(id);

        try {
            const estudianteDB = await pool.query(`SELECT * FROM estudiantes, pagos_estudiantes WHERE pagos_estudiantes.id_pago_estudiante = ${id} and pagos_estudiantes.id_estudiante = estudiantes.id_estudiante `);
            const pago_estudianteDB = await pool.query("SELECT * FROM pagos_estudiantes WHERE pagos_estudiantes.id_pago_estudiante = ?", [id]);
            const inscripcionesDB = await pool.query("SELECT * FROM inscripciones WHERE inscripciones.cedula = ?", [estudianteDB[0].cedula]);



            res.render("editar-pago-x-estudiante", {
                estudiante: estudianteDB[0],
                pago_estudiante: pago_estudianteDB[0],
                inscripciones: inscripcionesDB,
                login: true,
                name: req.session.name
            });

        } catch (error) {
            console.log(error)
            res.render("editar-pago-x-estudiante", {
                error: true,
                mensaje: "no se encuentra el id seleccionado",
                login: true,
                name: req.session.name
            });
        }

    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
});


// INSERTANDO MODIFICACION PAGO X ESTUDIANTE >>>>>>>>>>>>>>>
router.post('/admin/estudiantes-adm/informacion-estudiante-adm/editar-pago-x-estudiante/:id', async(req, res) => {

    const { id_estudiante, cedula_pago, nombre, apellido, monto_pago, fecha_pago, observacion_pago, periodo, curso_pago } = req.body;
    const id = req.params.id
    const updatePago_x_estudiante = {
        id_estudiante,
        cedula_pago,
        nombre,
        apellido,
        monto_pago,
        fecha_pago,
        observacion_pago,
        periodo,
        curso_pago

    };

    await pool.query("UPDATE pagos_estudiantes set ? WHERE id_pago_estudiante = ?", [updatePago_x_estudiante, id]);

    res.redirect(`/admin/estudiantes-adm/informacion-estudiante-adm/ver-pago-x-estudiante/${updatePago_x_estudiante.id_estudiante}`);
});


// ELIMINANDO PAGO POR ESTUDIANTE
router.get("/admin/estudiantes-adm/informacion-estudiante-adm/eliminar-pago-x-estudiante/:id", async(req, res) => {
    const { id } = req.params;
    console.log(id)

    try {
        const pago_estudianteDB = await pool.query(`SELECT * FROM pagos_estudiantes
                                                            WHERE pagos_estudiantes.id_pago_estudiante  = ${id}`);

        // const redirect_pago_estudianteDB = await pool.query(`SELECT * FROM estudiantes
        //                                                     WHERE estudiantes.id_estudiante  = ${pago_estudianteDB[0].id_estudiante}`);

        console.log(pago_estudianteDB[0].id_estudiante)


        await pool.query("DELETE FROM pagos_estudiantes WHERE id_pago_estudiante = ?", [id]);

        res.redirect(`/admin/estudiantes-adm/informacion-estudiante-adm/${pago_estudianteDB[0].id_estudiante}`);


    } catch (error) {
        console.log(error)
    }

});


module.exports = router;