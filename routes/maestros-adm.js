const express = require("express");
const router = express.Router();
const pool = require("../database");



// router.get('/configuracion', (req, res) => {

//     res.render("configuracion");
// });

router.get('/admin/maestros-adm', async(req, res) => {
    if (req.session.loggedin) {

        // const { id } = req.params;


        const maestrosDB = await pool.query("SELECT * FROM maestros where maestros.estado = 'Activo'")
        const cursosDB = await pool.query("SELECT * FROM cursos where cursos.estado_curso = 'Activo'")
            // const mant_mesesDB = await pool.query("SELECT * FROM mant_meses")


        // const servicioDB = await pool.query("SELECT * FROM mant_pagos_servicios WHERE idMantPagoServicio = ?", [id]);

        // console.log(mantPagosServiciosDB)

        res.render('maestros-adm', {
            maestros: maestrosDB,
            cursos: cursosDB,
            login: true,
            name: req.session.name
        });
    } else {
        res.render('maestros-adm', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    // res.end();
});

router.get('/admin/maestros-inactivos-adm', async(req, res) => {
    if (req.session.loggedin) {

        // const { id } = req.params;


        const maestrosDB = await pool.query("SELECT * FROM maestros where maestros.estado = 'Inactivo'")
        const cursosDB = await pool.query("SELECT * FROM cursos where cursos.estado_curso = 'Activo'")
            // const mant_mesesDB = await pool.query("SELECT * FROM mant_meses")


        // const servicioDB = await pool.query("SELECT * FROM mant_pagos_servicios WHERE idMantPagoServicio = ?", [id]);

        // console.log(mantPagosServiciosDB)

        res.render('maestros-inactivos-adm', {
            maestros: maestrosDB,
            cursos: cursosDB,
            login: true,
            name: req.session.name
        });
    } else {
        res.render('maestros-inactivos-adm', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    // res.end();
});


// INSERTANDO NUEVO MAESTRO
router.post("/admin/maestros-adm", async(req, res) => {

    const {

        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        telefono,
        correo_electronico,
        fecha_contratacion,
        url_curriculum,
        url_foto_cedula,
        url_foto_2x2,
        estado
    } = req.body;

    const nuevoMaestro = {

        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        telefono,
        correo_electronico,
        fecha_contratacion,
        url_curriculum,
        url_foto_cedula,
        url_foto_2x2,
        estado

    };

    await pool.query('INSERT INTO maestros SET ?', [nuevoMaestro]);




    res.redirect(`/admin/maestros-adm`);

});


//EDITAR MAESTRO
router.get("/admin/maestros-adm/editar-maestro-adm/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
            // let i = 0


        try {

            const cursosDB = await pool.query("SELECT * FROM cursos WHERE cursos.estado_curso = 'Activo' ");
            // const contenidoCursoDB = await pool.query("SELECT * FROM modulos WHERE modulos.id_curso = ?", [id]);
            const maestroDB = await pool.query("SELECT * FROM maestros WHERE maestros.id_maestro = ?", [id]);


            // const fecha_inicio = cursoDB[0].fecha_inicio.toLocaleString('es-ES', {
            //     timeZone: "America/Santo_Domingo"
            // }).slice(0, 10)

            res.render("editar-maestro-adm", {
                cursos: cursosDB,
                // fecha_inicio,
                // contenidoCurso: contenidoCursoDB,
                maestro: maestroDB[0],
                login: true,
                name: req.session.name

            });

        } catch (error) {
            console.log(error)
            res.render("editar-maestro-adm", {
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


// GUARDANDO ACTUALIZACION MAESTRO
router.post('/admin/maestros-adm/editar-maestro-adm/:id', async(req, res) => {
    const id = req.params.id;
    console.log(req.params.id)
    const { nombre, apellido, cedula, fecha_nacimiento, direccion, telefono, correo_electronico, fecha_contratacion, url_curriculum, url_foto_cedula, url_foto_2x2, estado } = req.body;

    updateMaestro = {
        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        telefono,
        correo_electronico,
        fecha_contratacion,
        url_curriculum,
        url_foto_cedula,
        url_foto_2x2,
        estado
    }


    await pool.query("UPDATE maestros set ? WHERE id_maestro = ?", [updateMaestro, id]);

    res.redirect(`/admin/maestros-adm/editar-maestro-adm/${id}`);
});

// ELIMINAR MAESTRO
router.get("/admin/maestros-adm/eliminar-maestro-adm/:id", async(req, res) => {

    const { id } = req.params;
    console.log(id)

    await pool.query("DELETE FROM maestros WHERE id_maestro = ?", [id]);

    res.redirect("/admin/maestros-adm");

});


// EDITAR SERVICIO
// router.get("/configuracion/:id", async(req, res) => {

//     const { id } = req.params;
//     console.log(id)

//     const servicioDB = await pool.query("SELECT * FROM mant_pagos_servicios WHERE idMantPagoServicio = ?", [id]);

//     res.render("/configuracion", {
//         servicio: servicioDB
//     });

// });

// router.put('/configuracion/:id', async(req, res) => {
//     const id = req.params.id;
//     console.log(req.params.id)
//         // const { servicio } = req.body;



//     await pool.query("UPDATE mant_pagos_servicios set ? WHERE idMantPagoServicio = ?", [req.body.servicio, id]);
//     // req.flash('success', 'Link actualizado correctamente');
//     res.redirect('/configuracion');
// });











module.exports = router;