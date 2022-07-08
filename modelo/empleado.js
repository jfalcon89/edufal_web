const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const empleadoSchema = new Schema({
    nombre: String,
    apellido: String,
    cedula: String,
    sexo: String,
    estatus: String,
    tiempoEmpresa: String,
    codigo: String,
    departamento: String,
    nacimiento: String,
    lugarNacimiento: String,
    nacionalidad: String,
    sueldoBruto: String,
    afp: String,
    ars: String,
    cooperativa: String,
    club: String,
    prestamos: String,
    totalDescuentos: String,
    sueldoNeto: String
})

// crear modelo
const empleado = mongoose.model("empleado", empleadoSchema);





module.exports = empleado;