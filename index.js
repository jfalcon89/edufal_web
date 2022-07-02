const express = require("express");
const app = express(); //asignacion de express en app
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

//rutas
const nominaRoutes = require("./routes/nomina");
const inicioRoutes = require("./routes/inicio");
const empleadosRoutes = require("./routes/empleados");
const contactosRoutes = require("./routes/contactos");
const pagosRoutes = require("./routes/pagos");
const reportesRoutes = require("./routes/reportes");
const configuracionRoutes = require("./routes/configuracion");

//--------------CONEXION AL SERVIDOR-----------------//
app.set("port", process.env.PORT || 3001);

app.listen(app.get("port"), () => {
    console.log("servidor funcionando en el puerto", app.get("port"))
});

////---------CONEXION A LA BASE DE DATOS MONGODB----------////

// const uri = `mongodb+srv://${process.env.USUARIO}:${process.env.PASSWORD}@cluster0.cnkdh.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

// mongoose.connect(uri, (err) => {
//     if (err) throw err
//     console.log("la conexion a base de datos funciona");
// });


//CONFIGURACION PARA LEER EL BODY
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//----------CONFIGURACION RUTAS ESTATICA-------------//
app.use(express.static(path.join(__dirname, "public")));


//----------RUTAS WEB DE LOS HANDLERS----------------//

app.use("/", inicioRoutes);
app.use("/", nominaRoutes);
app.use("/", empleadosRoutes);
app.use("/", contactosRoutes);
app.use("/", pagosRoutes);
app.use("/", reportesRoutes);
app.use("/", configuracionRoutes);



// estatica 404
app.use((req, res, next) => {
    res.status(404).render("404");
});





//motor de plantilla 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));