const { json } = require("body-parser");
const { render } = require("ejs");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado"); 
const moment = require("moment");
const pool = require("../database");


// RENDERIZANDO Y MOSTRANDO TODOS LOS CURSOS ADM*********************
router.get('/admin/cursos-adm', async(req, res) => {
    if (req.session.loggedin) {
        const arrayCursosDB = await pool.query('SELECT cursos.*, IFNULL(contador.cantidad_inscripciones, 0) AS total_inscripciones FROM cursos LEFT JOIN(SELECT id_curso, COUNT(id_inscripcion) AS cantidad_inscripciones FROM inscripciones GROUP BY id_curso ) AS contador ON cursos.id_curso = contador.id_curso; ');

        const totalInscripcionesDB = await pool.query(`SELECT  COUNT(inscripciones.id_inscripcion) AS cantidad_inscripciones FROM inscripciones where inscripciones.estado_inscripcion in ('Nuevo', 'Iniciado', 'Finalizado');`);
        console.log(totalInscripcionesDB)

        res.render("cursos-adm", {
            arrayCursos: arrayCursosDB,
            totalInscripciones: totalInscripcionesDB[0],
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



// CREAR NUEVO CURSO ADM
router.get('/admin/cursos-adm/crear-curso-adm', async(req, res) => {
    if (req.session.loggedin) {


        res.render("crear-curso-adm", {

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
// CREAR NUEVO CURSO
router.post('/admin/cursos-adm/crear-curso-adm', async(req, res) => {


    const { titulo_curso, descripcion, id_maestro, estado_curso, fecha_inicio, horasClases, duracion, modalidad, costo, tipo_curso, url_imagen, url_imagen_full_size, promocion, inf_curso, url_plan_estudio, oferta_inscripcion, precio_oferta, cantidad_cuota, porcentaje_descuento, dias_semana_clases } = req.body;
    const nuevoCurso = {
        titulo_curso,
        descripcion,
        id_maestro,
        estado_curso,
        fecha_inicio,
        horasClases,
        duracion,
        modalidad,
        costo,
        tipo_curso,
        url_imagen,
        url_imagen_full_size,
        promocion,
        inf_curso,
        url_plan_estudio,
        oferta_inscripcion,
        precio_oferta,
        cantidad_cuota,
        porcentaje_descuento,
        dias_semana_clases

    };

    await pool.query('INSERT INTO cursos set ?', [nuevoCurso]);

    res.redirect("/admin/cursos-adm");

});



// ELIMINAR CURSO
router.get("/admin/cursos-adm/eliminar-curso-adm/:id", async(req, res) => {

    const { id } = req.params;
    console.log(id)


    try {

        await pool.query("DELETE FROM cursos WHERE id_curso = ?", [id]);

        res.redirect("/admin/cursos-adm");

    } catch (error) {
        console.log(error)
    }

});




//EDITAR CURSO POR NUMERO ID 
router.get("/admin/cursos-adm/editar-curso-adm/:id", async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id
        let i = 0


        try {

            const cursoDB = await pool.query("SELECT * FROM cursos WHERE id_curso = ?", [id]);
            const contenidoCursoDB = await pool.query("SELECT * FROM modulos WHERE modulos.id_curso = ?", [id]);
            const maestroDB = await pool.query(`SELECT * FROM maestros WHERE maestros.id_maestro = ${cursoDB[0].id_maestro}`);
            const arrayMaestrosDB = await pool.query(`SELECT * FROM maestros WHERE maestros.estado = 'Activo'`);

            console.log('maestro ' + cursoDB[0].id_maestro)

            const fecha_inicio = cursoDB[0].fecha_inicio.toLocaleString('es-ES', {
                timeZone: "America/Santo_Domingo"
            }).slice(0, 10)

            res.render("editar-curso-adm", {
                curso: cursoDB[0],
                fecha_inicio,
                contenidoCurso: contenidoCursoDB,
                maestro: maestroDB[0],
                arrayMaestros: arrayMaestrosDB,
                login: true,
                name: req.session.name,
                i
            });

        } catch (error) {
            console.log(error)
            res.render("editar-curso-adm", {
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
router.post('/admin/cursos-adm/editar-curso-adm/:id', async(req, res) => {
    const id = req.params.id;
    console.log(req.params.id)

    const { titulo_curso, descripcion, id_maestro, estado_curso, fecha_inicio, horasClases, duracion, modalidad, costo, tipo_curso, url_imagen, url_imagen_full_size, promocion, inf_curso, url_plan_estudio, oferta_inscripcion, precio_oferta, cantidad_cuota, porcentaje_descuento, dias_semana_clases } = req.body;
    const updateCurso = {
        titulo_curso,
        descripcion,

        id_maestro,
        estado_curso,
        fecha_inicio,
        horasClases,
        duracion,
        modalidad,
        costo,
        tipo_curso,
        url_imagen,
        url_imagen_full_size,
        promocion,
        inf_curso,
        url_plan_estudio,
        oferta_inscripcion,
        precio_oferta,
        cantidad_cuota,
        porcentaje_descuento,
        dias_semana_clases
    };




    await pool.query("UPDATE cursos set ? WHERE id_curso = ?", [updateCurso, id]);



    const { titulo, contenido, id_curso } = req.body;
    const updateContenido = {
        id_curso,
        titulo,
        contenido

    }
    console.log(updateContenido)

    if (updateContenido.contenido && updateContenido.titulo) {

        await pool.query("INSERT INTO modulos set ? ", [updateContenido]);


    }


    // Obtener la lista de módulos del curso
    // const modulos = req.body.modulos; // Asumo que en req.body.modulos tienes un array con la información de cada módulo

    // console.log(updateContenido)
    // Actualizar cada módulo
    // if (modulos && modulos.length > 0) {
    //     for (const modulo of modulos) {
    //         const { id_modulo, titulo, contenido } = modulo;

    //         const updateContenido = {
    //             titulo,
    //             contenido
    //         };

    //         await pool.query("UPDATE modulos SET ? WHERE id_curso = ? AND id_modulo = ?", [updateContenido, id, id_modulo]);
    //     }
    // }

    res.redirect(`/admin/cursos-adm/editar-curso-adm/${id}`);

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


//ELIMINAR CONTENIDO
router.get("/admin/cursos-adm/eliminar-contenido-curso-adm/:id", async(req, res) => {
    const { id } = req.params;

    console.log(id)

    const id_cursoBuscar = await pool.query(`SELECT id_curso FROM modulos WHERE modulos.id_modulo = ${id} `)

    console.log(id_cursoBuscar[0].id_curso)
    try {

        await pool.query("DELETE FROM modulos WHERE id_modulo = ?", [id]);
        // req.flash('success', 'Link eliminado correctamente');
        res.redirect(`/admin/cursos-adm/editar-curso-adm/${id_cursoBuscar[0].id_curso}`);



    } catch (error) {
        console.log(error)
    }

});





module.exports = router;