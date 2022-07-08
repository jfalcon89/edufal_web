const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const informeSchema = new Schema({
    documento: String,
    pagos: String,
    prestamos: String,
    coperativa: String,
    club: String,
    ausencia: String,
    ponchesEntra: String,
    ponchesSalida: String

})

// crear modelo
const informe = mongoose.model("informe", informeSchema);





module.exports = informe;