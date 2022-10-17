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
const departamentosRoutes = require("./routes/departamentos");
const inicioRoutes = require("./routes/inicio");
const empleadosRoutes = require("./routes/empleados");
const contactosRoutes = require("./routes/contactos");
const pagosRoutes = require("./routes/pagos");
const reportesRoutes = require("./routes/reportes");
const configuracionRoutes = require("./routes/configuracion");
const registerRoutes = require("./routes/register");
const indexRoutes = require("./routes/index");
const loginRoutes = require("./routes/login");







//--------------CONEXION AL SERVIDOR-----------------//
app.set("port", process.env.PORT || 3001);

app.listen(app.get("port"), () => {
    console.log("servidor funcionando en el puerto", app.get("port"))
});

///nuevo codigo***************************************




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

///nuevo codigo*********************************************

////---------CONEXION A LA BASE DE DATOS MONGODB----------////
// const mongoose = require("mongoose");

// const uri = `mongodb+srv://${process.env.USUARIO}:${process.env.PASSWORD}@cluster0.cnkdh.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

// mongoose.connect(uri, (err) => {
//     if (err) throw err
//     console.log("la conexion a base de datos mongoDB funciona");
// });


//CONFIGURACION PARA LEER EL BODY
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//----------CONFIGURACION RUTAS ESTATICA-------------//
app.use(express.static(path.join(__dirname, "public")));


//----------RUTAS WEB DE LOS HANDLERS----------------//

app.use("/", inicioRoutes);
app.use("/", departamentosRoutes);
app.use("/", empleadosRoutes);
app.use("/", contactosRoutes);
app.use("/", pagosRoutes);
app.use("/", reportesRoutes);
app.use("/", configuracionRoutes);
app.use("/", registerRoutes);
app.use("/", indexRoutes);
app.use("/", loginRoutes);



// estatica 404
// app.use((req, res, next) => {
//     res.status(404).render("404");
// });

//motor de plantilla 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));