const { json } = require("body-parser");
const { render } = require("ejs");
const express = require("express");
const router = express.Router();
// const empleado = require("../modelo/empleado"); 
const moment = require("moment");
const pool = require("../database");
const nodemailer = require("nodemailer");



// RENDERIZANDO Y MOSTRANDO TODOS LOS CURSOS ADM*********************
router.get('/admin/cursos-adm', async(req, res) => {
    if (req.session.loggedin) {

        var ahora = new Date().getTime();


        const arrayCursosDB = await pool.query('SELECT cursos.*, IFNULL(contador.cantidad_inscripciones, 0) AS total_inscripciones FROM cursos LEFT JOIN(SELECT id_curso, COUNT(id_inscripcion) AS cantidad_inscripciones FROM inscripciones GROUP BY id_curso ) AS contador ON cursos.id_curso = contador.id_curso; ');

        const totalInscripcionesDB = await pool.query(`SELECT  COUNT(inscripciones.id_inscripcion) AS cantidad_inscripciones FROM inscripciones where inscripciones.estado_inscripcion in ('Nuevo', 'Iniciado', 'Finalizado', 'Declinado/Retirado');`);
        const totalInscripcionesNuevoDB = await pool.query(`SELECT  COUNT(inscripciones.id_inscripcion) AS cantidad_inscripciones FROM inscripciones where inscripciones.estado_inscripcion in ('Nuevo');`);
        const totalInscripcionesInicidoDB = await pool.query(`SELECT  COUNT(inscripciones.id_inscripcion) AS cantidad_inscripciones FROM inscripciones where inscripciones.estado_inscripcion in ('Iniciado');`);
        const totalInscripcionesFinalizadoDB = await pool.query(`SELECT  COUNT(inscripciones.id_inscripcion) AS cantidad_inscripciones FROM inscripciones where inscripciones.estado_inscripcion in ('Finalizado');`);
        const totalInscripcionesDeclinadoRetiradoDB = await pool.query(`SELECT  COUNT(inscripciones.id_inscripcion) AS cantidad_inscripciones FROM inscripciones where inscripciones.estado_inscripcion in ('Declinado/Retirado');`);


        console.log(totalInscripcionesDB)

        res.render("cursos-adm", {
            arrayCursos: arrayCursosDB,
            totalInscripciones: totalInscripcionesDB[0],
            totalInscripcionesNuevo: totalInscripcionesNuevoDB[0],
            totalInscripcionesInicido: totalInscripcionesInicidoDB[0],
            totalInscripcionesFinalizado: totalInscripcionesFinalizadoDB[0],
            totalInscripcionesDeclinadoRetirado: totalInscripcionesDeclinadoRetiradoDB[0],
            ahora,
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


    const { titulo_curso, descripcion, id_maestro, estado_curso, fecha_inicio, horasClases, duracion, modalidad, costo, tipo_curso, url_imagen, url_imagen_full_size, promocion, inf_curso, url_plan_estudio, oferta_inscripcion, dirigido_a, cantidad_cuota, porcentaje_descuento, dias_semana_clases } = req.body;
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
        dirigido_a,
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
            const arrayCategoriasDB = await pool.query(`SELECT * FROM categorias WHERE categorias.estado = 'Activo'`);
            const categoriaDB = await pool.query(`SELECT * FROM categorias WHERE categorias.id_categoria = ${cursoDB[0].id_categoria}`);

            console.log('maestro ' + cursoDB[0].id_maestro)

            const fecha_inicio = cursoDB[0].fecha_inicio.toLocaleString('es-ES', {
                timeZone: "America/Santo_Domingo"
            }).slice(0, 10)

            res.render("editar-curso-adm", {
                curso: cursoDB[0],
                fecha_inicio,
                contenidoCurso: contenidoCursoDB,
                maestro: maestroDB[0],
                categoria: categoriaDB[0],
                arrayCategorias: arrayCategoriasDB,
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

    const { titulo_curso, descripcion, id_maestro, estado_curso, fecha_inicio, horasClases, duracion, modalidad, costo, tipo_curso, url_imagen, url_imagen_full_size, promocion, inf_curso, url_plan_estudio, oferta_inscripcion, dirigido_a, cantidad_cuota, porcentaje_descuento, dias_semana_clases, fecha_oferta, id_categoria } = req.body;
    const updateCurso = {
        titulo_curso,
        descripcion,
        fecha_oferta,
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
        dirigido_a,
        cantidad_cuota,
        porcentaje_descuento,
        dias_semana_clases,
        id_categoria
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




// RENDERIZANDO Y MOSTRANDO LAS PROGRAMACIONES DE CURSOS DEL MES EN CURSO ADM*********************
router.get('/admin/programacion-adm', async(req, res) => {
    if (req.session.loggedin) {

        var ahora = new Date().getTime();


        const arrayCursosDB = await pool.query('SELECT cursos.*, IFNULL(contador.cantidad_inscripciones, 0) AS total_inscripciones FROM cursos LEFT JOIN(SELECT id_curso, COUNT(id_inscripcion) AS cantidad_inscripciones FROM inscripciones GROUP BY id_curso ) AS contador ON cursos.id_curso = contador.id_curso; ');



        const arrayCursosCategoria1DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "1" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
        const arrayCursosCategoria2DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "2" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
        const arrayCursosCategoria3DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "3" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
        const arrayCursosCategoria4DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "4" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
        const arrayCursosCategoria5DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "5" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
        const arrayCursosCategoria6DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "6" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
        const arrayCursosCategoria7DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "7" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
        const arrayCursosCategoria8DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "8" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);

        const arrayEstudiantesDB = await pool.query(`SELECT nombre, correo_electronico FROM estudiantes where estudiantes.correo_electronico in ('jfalcon89@hotmail.com', 'josemiguelfalconzapata@gmail.com') limit 2`);

        const mesEnCursoDB = await pool.query(`SELECT CASE MONTH(NOW())
    WHEN 1 THEN 'Enero'
    WHEN 2 THEN 'Febrero'
    WHEN 3 THEN 'Marzo'
    WHEN 4 THEN 'Abril'
    WHEN 5 THEN 'Mayo'
    WHEN 6 THEN 'Junio'
    WHEN 7 THEN 'Julio'
    WHEN 8 THEN 'Agosto'
    WHEN 9 THEN 'Septiembre'
    WHEN 10 THEN 'Octubre'
    WHEN 11 THEN 'Noviembre'
    WHEN 12 THEN 'Diciembre'
END AS mes_actual_español;`);





        res.render("programacion-adm", {
            arrayCursos: arrayCursosDB,
            arrayCursosCategoria1: arrayCursosCategoria1DB,
            arrayCursosCategoria2: arrayCursosCategoria2DB,
            arrayCursosCategoria3: arrayCursosCategoria3DB,
            arrayCursosCategoria4: arrayCursosCategoria4DB,
            arrayCursosCategoria5: arrayCursosCategoria5DB,
            arrayCursosCategoria6: arrayCursosCategoria6DB,
            arrayCursosCategoria7: arrayCursosCategoria7DB,
            arrayCursosCategoria8: arrayCursosCategoria8DB,
            mesEnCurso: mesEnCursoDB[0].mes_actual_español,
            arrayEstudiantes: arrayEstudiantesDB,
            ahora,
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

// RENDERIZANDO Y MOSTRANDO LAS PROGRAMACIONES DE CURSOS 100% OFF DEL MES EN CURSO ADM*********************
router.get('/admin/ofertas100%OFF-adm', async(req, res) => {
    if (req.session.loggedin) {

        var ahora = new Date().getTime();


        const arrayCursosDB = await pool.query('SELECT cursos.*, IFNULL(contador.cantidad_inscripciones, 0) AS total_inscripciones FROM cursos LEFT JOIN(SELECT id_curso, COUNT(id_inscripcion) AS cantidad_inscripciones FROM inscripciones GROUP BY id_curso ) AS contador ON cursos.id_curso = contador.id_curso; ');



        const arrayCursosCategoria1DB = await pool.query(`SELECT titulo_curso, fecha_inicio, fecha_oferta, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "1" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()) AND fecha_oferta > fecha_inicio AND fecha_oferta > now();`);
        const arrayCursosCategoria2DB = await pool.query(`SELECT titulo_curso, fecha_inicio, fecha_oferta, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "2" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()) AND fecha_oferta > fecha_inicio AND fecha_oferta > now();`);
        const arrayCursosCategoria3DB = await pool.query(`SELECT titulo_curso, fecha_inicio, fecha_oferta, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "3" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()) AND fecha_oferta > fecha_inicio AND fecha_oferta > now();`);
        const arrayCursosCategoria4DB = await pool.query(`SELECT titulo_curso, fecha_inicio, fecha_oferta, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "4" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()) AND fecha_oferta > fecha_inicio AND fecha_oferta > now();`);
        const arrayCursosCategoria5DB = await pool.query(`SELECT titulo_curso, fecha_inicio, fecha_oferta, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "5" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()) AND fecha_oferta > fecha_inicio AND fecha_oferta > now();`);
        const arrayCursosCategoria6DB = await pool.query(`SELECT titulo_curso, fecha_inicio, fecha_oferta, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "6" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()) AND fecha_oferta > fecha_inicio AND fecha_oferta > now();`);
        const arrayCursosCategoria7DB = await pool.query(`SELECT titulo_curso, fecha_inicio, fecha_oferta, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "7" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()) AND fecha_oferta > fecha_inicio AND fecha_oferta > now();`);
        const arrayCursosCategoria8DB = await pool.query(`SELECT titulo_curso, fecha_inicio, fecha_oferta, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "8" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW()) AND fecha_oferta > fecha_inicio AND fecha_oferta > now();`);

        const arrayEstudiantesDB = await pool.query(`SELECT nombre, correo_electronico FROM estudiantes where estudiantes.correo_electronico in ('jfalcon89@hotmail.com', 'josemiguelfalconzapata@gmail.com') limit 2`);
        // const arrayEstudiantesDB = await pool.query(`SELECT nombre, correo_electronico FROM estudiantes `);

        const mesEnCursoDB = await pool.query(`SELECT CASE MONTH(NOW())
    WHEN 1 THEN 'Enero'
    WHEN 2 THEN 'Febrero'
    WHEN 3 THEN 'Marzo'
    WHEN 4 THEN 'Abril'
    WHEN 5 THEN 'Mayo'
    WHEN 6 THEN 'Junio'
    WHEN 7 THEN 'Julio'
    WHEN 8 THEN 'Agosto'
    WHEN 9 THEN 'Septiembre'
    WHEN 10 THEN 'Octubre'
    WHEN 11 THEN 'Noviembre'
    WHEN 12 THEN 'Diciembre'
END AS mes_actual_español;`);





        res.render("ofertas100%OFF-adm", {
            arrayCursos: arrayCursosDB,
            arrayCursosCategoria1: arrayCursosCategoria1DB,
            arrayCursosCategoria2: arrayCursosCategoria2DB,
            arrayCursosCategoria3: arrayCursosCategoria3DB,
            arrayCursosCategoria4: arrayCursosCategoria4DB,
            arrayCursosCategoria5: arrayCursosCategoria5DB,
            arrayCursosCategoria6: arrayCursosCategoria6DB,
            arrayCursosCategoria7: arrayCursosCategoria7DB,
            arrayCursosCategoria8: arrayCursosCategoria8DB,
            mesEnCurso: mesEnCursoDB[0].mes_actual_español,
            arrayEstudiantes: arrayEstudiantesDB,
            ahora,
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


// FUNCION PARA ENVIAR PROGRAMACION DE TEMPORADA********************
router.get('/envioProgramacionRuta', async(req, res) => {

    const arrayCursosCategoria1DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "1" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria2DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "2" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria3DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "3" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria4DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "4" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria5DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "5" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria6DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "6" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria7DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "7" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria8DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "8" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);

    const arrayEstudiantesDB = await pool.query(`SELECT nombre, correo_electronico FROM estudiantes where estudiantes.correo_electronico in ('jfalcon89@hotmail.com', 'josemiguelfalconzapata@gmail.com') limit 2`);

    // const arrayEstudiantes = arrayEstudiantesDB[0]

    console.log(arrayEstudiantesDB)

    const mesEnCursoDB = await pool.query(`SELECT CASE MONTH(NOW())
    WHEN 1 THEN 'Enero'
    WHEN 2 THEN 'Febrero'
    WHEN 3 THEN 'Marzo'
    WHEN 4 THEN 'Abril'
    WHEN 5 THEN 'Mayo'
    WHEN 6 THEN 'Junio'
    WHEN 7 THEN 'Julio'
    WHEN 8 THEN 'Agosto'
    WHEN 9 THEN 'Septiembre'
    WHEN 10 THEN 'Octubre'
    WHEN 11 THEN 'Noviembre'
    WHEN 12 THEN 'Diciembre'
    END AS mes_actual_español;`);


    async function notificacionCorreo() {
        try {
            const from = "contacto@edufalonline.com"
                // const toNotificacion = "jfalcon89@hotmail.com"
                // const estudiante = "Jose Miguel"

            // console.log(nombre + " en enviar correo");
            // console.log(apellido + " en enviar correo");

            // Configurar la conexión SMTP con el servidor de correo personalizado
            let transporter = nodemailer.createTransport({
                host: "edufalonline.com",
                port: 465, // El puerto puede variar según la configuración de su servidor
                secure: true, // Si utiliza SSL/TLS, establezca este valor en true
                tls: {
                    rejectUnauthorized: false
                },
                auth: {
                    user: process.env.USERCORREO,
                    pass: process.env.PASSCORREO,
                },
            });

            // iteracion de los resultados
            if (arrayEstudiantesDB.length > 0) {
                arrayEstudiantesDB.forEach(estudiante => {

                    // Configurar los detalles del correo electrónico  
                    let info = transporter.sendMail({
                        from: `${from} EDUFAL ONLINE`,
                        to: estudiante.correo_electronico,
                        subject: `¿Vas a dejar pasar otro mes sin capacitarte? 😳😱`,
                        html: `
                        <table align="center" cellpadding="0" cellspacing="0" width="720">
                         <tr>
                            <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                                <h1 style="color: #333333;">¡No dejes que el tiempo pase sin tomar acción! Inscríbete en nuestros cursos ahora mismo y da el primer paso hacia un futuro brillante. 🚀🌟
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #ffffff; padding: 30px;">
                        <div style="display: flex; justify-content: center;">
                        <div style="max-width: 720px;">
                        <p style="max-width: 720px; margin: 0 auto;">Hola, ${estudiante.nombre}<br><br>
                        ${mesEnCursoDB[0].mes_actual_español} es un mes dedicado a aquellos que están comprometidos con alcanzar sus metas antes de que termine el año. ¿Te encuentras entre ellos? En EDUFAL, encontrarás programas diseñados para proporcionarte conocimientos siempre de las manos de expertos en la industria. Tu éxito está a solo un diplomado de distancia.
                        </p><br>

                        <p style="max-width: 720px; margin: 0 auto;">
                        Escríbeme ahora mismo <a href="www.edufalonline.com">aquí</a> o solicita más información sobre tu diplomado, curso o taller ideal para verificar si aún hay cupo disponible. ¡Trabajaré para asegurarte el tuyo!
                        </p><br>
                        </div>
                         </div>
                        <div style="text-align: center;">
                            <img src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211716&authkey=%21AAYtZOsaKnSnOho&width=720&height=681"/>
                            <h4><a href="https://bit.ly/3xzs0RV" style="background-color: #005d6a; border-radius: 10px; padding: 10px; text-decoration: none; color: white; margin-top: 30px;">ESCRIBEMOS PARA MAS INFORMACION</a></h4><br>
                            <p style="margin: 0 auto; width: 50%;">Te esperamos en el AULA!</p><br>
                            <img src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211711&authkey=%21AJoA5g9yVo7CavY&width=396&height=122" width="396" height="122" />   
                        

                        <footer class="d-flex mt-0 mb-0">
                            <div class="container  d-lg-flex justify-content-lg-between">
                                <div class="container-dir mt-5 mb-5">
                                </div>
                                <div class="container-dir mt-5 mb-5">
                                    <h6 class="text-white mb-3"> Calle Primera #59 Sector Enriquillo de Herrera Santo Domingo R.D 829-856-0203 contacto@edufalonline.com</h6>
                                </div>
                                <div class="container-redes mt-5 mb-5">
                                    <h6 class="text-white mb-3"><strong>NUESTRAS REDES SOCIALES</strong></h6>
                                    <a href="https://www.facebook.com/rosfalrd/" target="_blank"> <img style="width: 40px;" src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211715&authkey=%21AKCgUx2Zi1sFJFk&width=256" alt="facebook"></a>
                                    <a href="https://www.instagram.com/rosfalrd/" target="_blank"> <img style="width: 40px;" src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211712&authkey=%21AET2kpZIjaoW6W0&width=40" alt="instagram"></a>
                                    <a href="https://bit.ly/3xzs0RV" target="_blank"> <img style="width: 40px;" src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211713&authkey=%21AJ-hUrQAndRfUv8&width=323&height=299" alt="ws"></a>
                                    <a href="#"> <img style="width: 40px;" src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211714&authkey=%21ABz2uGGcqo6A1gY&width=256" alt="twier"></a>
                                </div>
                            </div>
                        </footer>
                        <hr class="mt-0 mb-0">
                        <div class="mt-0 mb-0" ">
                            <p style="color: white;" class="text-white text-center pt-3 pb-3 m-0">© Copyright 2023 - Edufal Online</p>
                        </div>
                        </div>
                        </td>
                        </tr>
                    </table>
                    `,

                    });
                    console.log("Correo enviado a", estudiante.nombre + ' ' + estudiante.correo_electronico);
                    console.log("ID Correo enviado: %s", info.messageId);

                })
            }


        } catch (error) {
            console.log(error);
        }
    }

    notificacionCorreo()


});

// FUNCION PARA ENVIAR PROGRAMACION 100% OFF********************
router.get('/envioProgramacionCursosGratisRuta', async(req, res) => {

    const arrayCursosCategoria1DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "1" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria2DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "2" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria3DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "3" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria4DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "4" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria5DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "5" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria6DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "6" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria7DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "7" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);
    const arrayCursosCategoria8DB = await pool.query(`SELECT titulo_curso, fecha_inicio, horasClases, nombre_categoria FROM cursos, categorias where cursos.estado_curso = "Activo" and cursos.id_categoria = "8" and cursos.id_categoria = categorias.id_categoria AND STR_TO_DATE(fecha_inicio, '%d/%m/%Y') BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW());`);

    const arrayEstudiantesDB = await pool.query(`SELECT nombre, correo_electronico FROM estudiantes where estudiantes.correo_electronico in ('jfalcon89@hotmail.com', 'josemiguelfalconzapata@gmail.com') limit 2`);

    console.log(arrayEstudiantesDB)

    const mesEnCursoDB = await pool.query(`SELECT CASE MONTH(NOW())
    WHEN 1 THEN 'Enero'
    WHEN 2 THEN 'Febrero'
    WHEN 3 THEN 'Marzo'
    WHEN 4 THEN 'Abril'
    WHEN 5 THEN 'Mayo'
    WHEN 6 THEN 'Junio'
    WHEN 7 THEN 'Julio'
    WHEN 8 THEN 'Agosto'
    WHEN 9 THEN 'Septiembre'
    WHEN 10 THEN 'Octubre'
    WHEN 11 THEN 'Noviembre'
    WHEN 12 THEN 'Diciembre'
    END AS mes_actual_español;`);


    async function notificacionCorreo() {
        try {
            const from = "contacto@edufalonline.com"
                // const toNotificacion = "jfalcon89@hotmail.com"
                // const estudiante = "Jose Miguel"

            // console.log(nombre + " en enviar correo");
            // console.log(apellido + " en enviar correo");

            // Configurar la conexión SMTP con el servidor de correo personalizado
            let transporter = nodemailer.createTransport({
                host: "edufalonline.com",
                port: 465, // El puerto puede variar según la configuración de su servidor
                secure: true, // Si utiliza SSL/TLS, establezca este valor en true
                tls: {
                    rejectUnauthorized: false
                },
                auth: {
                    user: process.env.USERCORREO,
                    pass: process.env.PASSCORREO,
                },
            });

            // iteracion de los resultados
            if (arrayEstudiantesDB.length > 0) {
                arrayEstudiantesDB.forEach(estudiante => {

                    // Configurar los detalles del correo electrónico  
                    let info = transporter.sendMail({
                        from: `${from} EDUFAL ONLINE`,
                        to: estudiante.correo_electronico,
                        subject: `¡Aprovecha nuestras capacitaciones 100% gratis este mes de ${mesEnCursoDB[0].mes_actual_español}! 😳😱`,
                        html: `
                       <table align="center" cellpadding="0" cellspacing="0" width="720">
                        <tr>
                            <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                                <h1 style="color: #333333;">¡Aprovecha nuestras capacitaciones 100% gratis este mes de
                                    ${mesEnCursoDB[0].mes_actual_español}!
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #ffffff; padding: 30px;">
                                <p>Hola ${estudiante.nombre},</p>
                                <p>¡Espero que estés teniendo un excelente día! Quería informarte sobre una increíble oportunidad que tenemos este mes en EDUFAL ONLINE: ¡nuestras capacitaciones totalmente gratuitas!
                                </p>
                                <p>En EDUFAL ONLINE, creemos firmemente en brindar acceso a la educación de calidad para todos, y por eso estamos ofreciendo una selección especial de cursos online completamente gratis durante todo este mes. Esta es tu oportunidad
                                    de adquirir nuevos conocimientos, mejorar tus habilidades y avanzar en tu camino hacia el éxito, sin ningún costo.</p>
                                <p>Nuestras capacitaciones gratuitas cubren una amplia gama de áreas, incluyendo Desarrollo de Software, Negocios y Emprendimiento, Diseño Gráfico, Contenido Digital y Multimedia, Idiomas y Habilidades Lingüísticas, Marketing
                                    Digital, Ciencia de Datos y Análisis, Finanzas Personales y Contabilidad, entre otros.
                                </p>
                                <p>Al inscribirte en nuestros cursos gratuitos, tendrás acceso a:</p>
                                <ul>
                                    <li><strong>Contenido de Calidad:</strong> Cursos diseñados por expertos en cada campo para garantizar que obtengas conocimientos actualizados y relevantes.</li>
                                    <li><strong>Flexibilidad Horaria:</strong> Estudia a tu ritmo, adaptando los horarios según tus necesidades y disponibilidad.</li>
                                    <li><strong>Certificación de Participación:</strong> Al completar con éxito el curso, recibirás una certificación que respaldará tus nuevos conocimientos y habilidades.
                                    </li>
                                </ul>
                                <p>No dejes pasar esta oportunidad única de aprender y crecer sin costo alguno. Te animamos a explorar nuestra lista de cursos gratuitos y registrarte hoy mismo para asegurar tu lugar.
                                </p>
                                <p>Para más información y para inscribirte en nuestras capacitaciones gratuitas, te invitamos a visitar nuestra página web <a href="www.edufalonline.com">aquí</a> o contactarnos directamente a través de este correo electrónico
                                    contacto@edufalonline.com.
                                </p>
                                <p>¡Esperamos contar contigo en nuestra comunidad de aprendizaje este mes!</p>
                                <p>Saludos cordiales,</p><br>

                                <div style="text-align: center; margin-top: 30px;">

                                    <h4><a href="https://bit.ly/3xzs0RV" style="background-color: #005d6a; border-radius: 10px; padding: 10px; text-decoration: none; color: white;">ESCRIBEMOS
                                            PARA MAS INFORMACION</a></h4><br>
                                    <p style="margin: 0 auto; width: 50%;">Te esperamos en el AULA!</p><br>
                                    <img src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211711&authkey=%21AJoA5g9yVo7CavY&width=396&height=122" width="396" height="122" />


                                    <footer class=" mt-0 mb-0">
                                        <div class="container ">
                                            <div class="container-dir mt-5 mb-5">
                                            </div>
                                            <div class="container-dir mt-5 mb-5">
                                                <h6 class="text-black  mb-3"> Calle Primera #59 Sector Enriquillo de Herrera Santo Domingo R.D 829-856-0203 contacto@edufalonline.com
                                                </h6>
                                            </div>
                                            <div class="container-redes mt-5 mb-5">
                                                <h6 class="text-black  mb-3"><strong>NUESTRAS REDES SOCIALES</strong>
                                                </h6>
                                                <a href="https://www.facebook.com/rosfalrd/" target="_blank"> <img style="width: 40px;" src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211715&authkey=%21AKCgUx2Zi1sFJFk&width=256" alt="facebook"></a>
                                                <a href="https://www.instagram.com/rosfalrd/" target="_blank"> <img style="width: 40px;" src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211712&authkey=%21AET2kpZIjaoW6W0&width=40" alt="instagram"></a>
                                                <a href="https://bit.ly/3xzs0RV" target="_blank"> <img style="width: 40px;" src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211713&authkey=%21AJ-hUrQAndRfUv8&width=323&height=299" alt="ws"></a>
                                                <a href="#"> <img style="width: 40px;" src="https://onedrive.live.com/embed?resid=C31F9C66E8BCAAC9%211714&authkey=%21ABz2uGGcqo6A1gY&width=256" alt="twier"></a>
                                            </div>
                                        </div>
                                    </footer>
                                    <hr class="mt-0 mb-0">
                                    <div class="mt-0 mb-0" style="background-color:#000000 ;">
                                        <p class="text-white text-center pt-3 pb-3 m-0">© Copyright 2023 - Edufal Online
                                        </p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    `,

                    });
                    console.log("Correo enviado a", estudiante.nombre + ' ' + estudiante.correo_electronico);
                    console.log("ID Correo enviado: %s", info.messageId);

                })
            }


        } catch (error) {
            console.log(error);
        }
    }

    notificacionCorreo()


});


module.exports = router;