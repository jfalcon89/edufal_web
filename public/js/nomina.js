const codigo = document.getElementById("codigo");
const estatus = document.getElementById("estatus");
const nombre = document.getElementById("nombre");
const cedula = document.getElementById("cedula");
let fechaActualReporte = document.getElementById("fechaActual");
const btnGuardarDatos = document.getElementById("btnGuardarDatos");
const estatusInfEmp = document.querySelector(".estatusInfEmp")
    // const eventoAct_Inact = document.getElementById("eventoAct-Inact");




// if (estatusInfEmp.textContent == "Activo") {
//     estatusInfEmp.classList.add("activo");
// }
// if (estatusInfEmp.textContent == "Inactivo") {
//     estatusInfEmp.classList.add("inactivo");
// };


let sueldoBruto = document.getElementById("sueldoBruto");
console.log(sueldoBruto.value)

// funtion para ejecutar las operaciones y capturar cambios en el campo salario bruto
sueldoBruto.addEventListener("change", () => {
    console.log("hiciste un cambio al sueldo");

    let afp = document.getElementById("afp");
    let ars = document.getElementById("ars");
    let cooperativa = document.getElementById("cooperativa");
    let club = document.getElementById("club");
    let prestamos = document.getElementById("prestamos");
    let totalDescuentos = document.getElementById("totalDescuentos");
    let sueldoNeto = document.getElementById("sueldoNeto");

    (function() {

        let sueldoBrutoParametro = document.getElementById("sueldoBrutoParametro").value;
        let afpParametro = document.getElementById("afpParametro").value;
        let arsParametro = document.getElementById("arsParametro").value;
        let cooperativaParametro = document.getElementById("cooperativaParametro").value;
        let clubParametro = document.getElementById("clubParametro").value;
        let prestamosParametro = document.getElementById("prestamosParametro").value;

        sueldoBrutoParametro.value = sueldoBruto.value
        afp.value = afpParametro * sueldoBruto.value;
        ars.value = arsParametro * sueldoBruto.value;;
        cooperativa.value = cooperativaParametro * sueldoBruto.value;
        club.value = clubParametro * sueldoBruto.value;
        prestamos.value = prestamosParametro * sueldoBruto.value;

        totalDescuentos.value = parseInt(afp.value) + parseInt(ars.value) + parseInt(cooperativa.value) + parseInt(club.value) + parseInt(prestamos.value);
        sueldoNeto.value = sueldoBruto.value - totalDescuentos.value;


        function formatear() {

            totalDescuentos.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(totalDescuentos.value);
            sueldoNeto.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(sueldoNeto.value);
            afp.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(afp.value);
            ars.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(ars.value);
            cooperativa.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(cooperativa.value);
            club.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(club.value);
            prestamos.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(prestamos.value);
        };
        formatear();

    })();
});





// modal reporte
const close = document.querySelector(".close");
const btnImprimir = document.querySelector(".btnImprimir");

// funtion para abrir modal de reporte
btnImprimir.addEventListener("click", () => {
    console.log("le diste abrir reporte")

    const modal_container = document.querySelector(".modal_container");
    modal_container.style.visibility = "visible"
    const modal_reporte = document.querySelector(".modal_reporte");
    modal_reporte.classList.add("efecto");

    //function para actualizar la fecha actual del reporte
    function fecha_Actual() {

        let date = new Date();
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();

        fechaActualReporte.innerHTML = `: ${day}/${month}/${year} ${hours}:${minutes} `;

    };
    fecha_Actual();

    // funtion para llenado de datos del reporte
    (function() {
        console.log("entraste a llenar campos reporte")

        const nombreR = document.getElementById("nombreR").value = nombre.value;
        const cedulaR = document.getElementById("cedulaR").value = cedula.value;
        const codigoR = document.getElementById("codigoR").value = codigo.value;
        let sueldoBrutoR = document.getElementById("sueldoBrutoR").textContent = sueldoBruto.value;
        let afpR = document.getElementById("afpR").textContent = afp.value;
        let arsR = document.getElementById("arsR").textContent = ars.value;
        let cooperativaR = document.getElementById("cooperativaR").textContent = cooperativa.value;
        let clubR = document.getElementById("clubR").textContent = club.value;
        let prestamosR = document.getElementById("prestamosR").textContent = prestamos.value;
        let totalDescuentosR = document.getElementById("totalDescuentosR").value = totalDescuentos.value;
        let sueldoNetoR = document.getElementById("sueldoNetoR").value = sueldoNeto.value;

        // formato de valores a divisa en modal de reporte para sueldo bruto
        sueldoBrutoR = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(sueldoBrutoR);
        sueldoBrutoR = document.getElementById("sueldoBrutoR").textContent = sueldoBrutoR;


    })();
});

// funtion para cerrar modal de reporte
close.addEventListener("click", () => {
    console.log("le diste a cerrar reporte")

    const modal_container = document.querySelector(".modal_container");
    modal_container.style.visibility = "hidden"
    const modal_reporte = document.querySelector(".modal_reporte");
    modal_reporte.classList.remove("efecto");

});

const btnImprimirR = document.querySelector(".btnImprimirR");

// funtion para generar reporte pdf 
btnImprimirR.addEventListener("click", () => {
    console.log("click en generar reporte")

    var element = document.querySelector('.modal_reporte');
    var opt = {
        margin: 0,
        filename: 'myfile.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, height: "590" },
        jsPDF: { unit: 'in', format: 'b2', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();

    // Old monolithic-style usage:
    // html2pdf(element, opt);
});

// modal de parametros
const closeParametros = document.querySelector(".closeParametros");
const btnParametros = document.querySelector(".btnParametros");
const btnGuardarParametros = document.querySelector(".btnGuardarParametros");

// funtion para abrir modal de parametros 
btnParametros.addEventListener("click", () => {
    console.log("le diste abrir parametros")

    const modal_container_parametros = document.querySelector(".modal_container_parametros");
    modal_container_parametros.style.visibility = "visible"
    const modal_parametros = document.querySelector(".modal_parametros");
    modal_parametros.classList.add("efectoParametros");

    let sueldoBrutoParametro = document.getElementById("sueldoBrutoParametro");
    sueldoBrutoParametro.value = sueldoBruto.value;

});

btnGuardarParametros.addEventListener("click", () => {
    console.log("le diste guardar parametros");

    let afpParametro = document.getElementById("afpParametro").value;
    let arsParametro = document.getElementById("arsParametro").value;
    let cooperativaParametro = document.getElementById("cooperativaParametro").value;
    let clubParametro = document.getElementById("clubParametro").value;
    let prestamosParametro = document.getElementById("prestamosParametro").value;

    sueldoBruto.value = sueldoBrutoParametro.value;
    console.log(sueldoBruto.value)
    console.log(sueldoBrutoParametro.value)

    afp.value = afpParametro * sueldoBruto.value;
    ars.value = arsParametro * sueldoBruto.value;;
    cooperativa.value = cooperativaParametro * sueldoBruto.value;
    club.value = clubParametro * sueldoBruto.value;
    prestamos.value = prestamosParametro * sueldoBruto.value;

    totalDescuentos.value = parseInt(afp.value) + parseInt(ars.value) + parseInt(cooperativa.value) + parseInt(club.value) + parseInt(prestamos.value);
    sueldoNeto.value = sueldoBruto.value - totalDescuentos.value;

    function formatear() {

        totalDescuentos.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(totalDescuentos.value);
        sueldoNeto.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(sueldoNeto.value);
        afp.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(afp.value);
        ars.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(ars.value);
        cooperativa.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(cooperativa.value);
        club.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(club.value);
        prestamos.value = Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(prestamos.value);

    };
    formatear();

});

// funtion para cerrar modal de parametros
closeParametros.addEventListener("click", () => {
    console.log("le diste a cerrar parametros")


    const modal_container_parametros = document.querySelector(".modal_container_parametros");
    modal_container_parametros.style.visibility = "hidden"
    const modal_parametros = document.querySelector(".modal_parametros");
    modal_parametros.classList.remove("efectoParametros");

});