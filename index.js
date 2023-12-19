const express = require("express");
const app = express(); //asignacion de express en app
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require('dotenv').config()
const moment = require("moment");
//6 -Invocamos a bcrypt
const bcrypt = require('bcryptjs');

// conexcion a la base de datos MySql
const pool = require("./database");
const { database } = require('./keys');

//rutas requiere
const inicioRoutes = require("./routes/inicio");
const quienesSomosRoutes = require("./routes/quienes-somos");
const cursosRoutes = require("./routes/cursos");
const vacantesRoutes = require("./routes/vacantes");
const talleresRoutes = require("./routes/talleres");
const ofertasInscripcionesRoutes = require("./routes/ofertas-inscripciones");
const cursosAdmRoutes = require("./routes/cursos-adm");
const inscripcionesAdmRoutes = require("./routes/inscripciones-adm");
const dashboardRoutes = require("./routes/dashboard");
const estudiantesRoutes = require("./routes/estudiantes");
// const maestrosRoutes = require("./routes/maestros-adm");
const contactosRoutes = require("./routes/contactos");
const preguntasFrecuentesRoutes = require("./routes/preguntas-frecuentes");
const pagosRoutes = require("./routes/pagos");
const pagosServiciosRoutes = require("./routes/pagos-servicios");
const reportesRoutes = require("./routes/reportes");
const maestrosAdmRoutes = require("./routes/maestros-adm");
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");





//--------------CONEXION AL SERVIDOR-----------------//
app.set("port", process.env.PORT || 3001);

app.listen(app.get("port"), () => {
    console.log("servidor funcionando en el puerto", app.get("port"))
});



//7- variables de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

//Logout
//Destruye la sesión.
app.get('/logout', function(req, res) {
    req.session.destroy(() => {
        res.redirect('/login') // siempre se ejecutará después de que se destruya la sesión
    })
});



//CONFIGURACION PARA LEER EL BODY
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//----------CONFIGURACION RUTAS ESTATICA-------------//
app.use(express.static(path.join(__dirname, "public")));


// estatica 404
// app.use((req, res, next) => {
//     res.status(404).render("404");
// });

//----------RUTAS WEB DE LOS HANDLERS----------------//

app.use("/", inicioRoutes);
app.use("/", quienesSomosRoutes);
app.use("/", cursosRoutes);
app.use("/", talleresRoutes);
app.use("/", vacantesRoutes);
app.use("/", ofertasInscripcionesRoutes);
app.use("/", inscripcionesAdmRoutes);
app.use("/", preguntasFrecuentesRoutes);
app.use("/", dashboardRoutes);
app.use("/", cursosAdmRoutes);
app.use("/", estudiantesRoutes);
app.use("/", contactosRoutes);
app.use("/", pagosRoutes);
app.use("/", pagosServiciosRoutes);
app.use("/", reportesRoutes);
app.use("/", maestrosAdmRoutes);
app.use("/", registerRoutes);
app.use("/", loginRoutes);


//motor de plantilla 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));