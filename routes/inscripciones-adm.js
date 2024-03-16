const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado");
const moment = require("moment");
const pool = require("../database");
const bcrypt = require('bcryptjs');


// MOSTRAR LAS TODAS LA INSCRIPCIONES
router.get('/admin/inscripciones-adm', async(req, res) => {
    if (req.session.loggedin) {

        const cedula = req.params.id

        const arrayInscripcionesDB = await pool.query(`SELECT * FROM inscripciones, cursos, estudiantes where inscripciones.id_curso = cursos.id_curso and estudiantes.cedula = inscripciones.cedula`);
        // const estudianteDB = await pool.query("SELECT * FROM estudiantes WHERE estudiantes.cedula = ?", [cedula]);

        // const estudianteInscripcionDB = await pool.query(`SELECT * FROM estudiantes where estudiantes.cedula = ${req.params} `);

        // console.log('id estudiante' + '' + estudianteDB[0])

        res.render('inscripciones-adm', {
            arrayInscripciones: arrayInscripcionesDB,
            // estudiante: estudianteDB[0],
            // estudianteInscripcion: estudianteInscripcionDB[0].cedula,
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

//EDITAR INSCRIPCION
router.get("/admin/inscripciones-adm/editar-inscripcion-adm/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
            // let i = 0


        try {

            const inscripcionDB = await pool.query("SELECT * FROM inscripciones WHERE inscripciones.id_inscripcion = ?", [id]);
            const cursoDB = await pool.query(`SELECT * FROM cursos WHERE cursos.estado_curso = 'Activo' and cursos.id_curso = ${inscripcionDB[0].id_curso} `);
            const arrayCursosDB = await pool.query("SELECT * FROM cursos WHERE cursos.estado_curso = 'Activo'")

            console.log(cursoDB[0])

            res.render("editar-inscripcion-adm", {
                curso: cursoDB[0],
                inscripcion: inscripcionDB[0],
                arrayCursos: arrayCursosDB,
                login: true,
                name: req.session.name

            });

        } catch (error) {
            console.log(error)
            res.render("editar-inscripcion-adm", {
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


//GUARDAR ACTUALIZACION DE INSCRIPCION
router.post('/admin/inscripciones-adm/editar-inscripcion-adm/:id', async(req, res) => {
    const id = req.params.id;
    console.log(req.params.id)

    const { id_curso, nombre, apellido, cedula, fecha_nacimiento, direccion, telefono, correo_electronico, pais, precioOferta_inscripcion, fecha_inicio_inscripcion, promocion_inscripcion, oferta_inscripcion_inscripcion, estado_inscripcion } = req.body;
    const updateInscripcion = {
        id_curso,
        nombre,
        apellido,
        cedula,
        fecha_nacimiento,
        direccion,
        telefono,
        correo_electronico,
        pais,

        precioOferta_inscripcion,
        fecha_inicio_inscripcion,
        promocion_inscripcion,
        oferta_inscripcion_inscripcion,
        estado_inscripcion
    };

    await pool.query("UPDATE inscripciones set ? WHERE id_inscripcion = ?", [updateInscripcion, id]);

    res.redirect(`/admin/inscripciones-adm/editar-inscripcion-adm/${id}`);
});


// ELIMINAR INSCRIPCION
router.get("/admin/inscripciones-adm/eliminar-inscripcion-adm/:id", async(req, res) => {

    const { id } = req.params;
    console.log(id)

    await pool.query("DELETE FROM inscripciones WHERE id_inscripcion = ?", [id]);

    res.redirect("/admin/inscripciones-adm");

});


//EDITAR INSCRIPCION Y VER ESTUDIANTE INSCRITO
// router.get("/admin/estudiantes-adm/editar-estudiante-adm/:id", async(req, res) => {
//     if (req.session.loggedin) {

//         const cedula = req.params.id
//             // let i = 0


//         try {

//             const estudianteDB = await pool.query("SELECT * FROM estudiantes WHERE estudiantes.cedula = ?", [cedula]);
//             // const cursoDB = await pool.query(`SELECT * FROM cursos WHERE cursos.estado_curso = 'Activo' and cursos.id_curso = ${inscripcionDB[0].id_curso} `);
//             // const arrayCursosDB = await pool.query("SELECT * FROM cursos WHERE cursos.estado_curso = 'Activo'")

//             // console.log(cursoDB[0])

//             res.render("editar-estudiante-adm", {
//                 estudiante: estudianteDB[0],
//                 // inscripcion: inscripcionDB[0],
//                 // arrayCursos: arrayCursosDB,
//                 login: true,
//                 name: req.session.name

//             });

//         } catch (error) {
//             console.log(error)
//             res.render("editar-estudiante-adm", {
//                 error: true,
//                 mensaje: "no se encuentra el id seleccionado"
//             });
//         }

//     } else {
//         res.render('login', {
//             login: false,
//             name: 'Debe iniciar sesión',
//         });
//     }

// });


module.exports = router;