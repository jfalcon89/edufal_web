const btn_pagos_servicios = document.getElementById("btn_pagos_servicios");
const btn_mant_meses = document.getElementById("btn_mant_meses");
const pagoServicio = document.getElementById("pagoServicio");
const mantMeses = document.getElementById("mantMeses");
const btn_servicios = document.getElementById("btn_servicios");
const grup_btn_servicios = document.getElementById("grup_btn_servicios");


btn_servicios.addEventListener("click", () => {
    console.log("click")
    grup_btn_servicios.style.display = "block"


});


btn_pagos_servicios.addEventListener("click", () => {
    console.log("click en pagos servicios")

    pagoServicio.style.display = "block"
    mantMeses.style.display = "none"

});


btn_mant_meses.addEventListener("click", () => {
    console.log("click en mant meses")

    mantMeses.style.display = "block"
    pagoServicio.style.display = "none"


});