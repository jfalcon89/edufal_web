//logica convertidor de kilos a libras

const btnConvertir = document.getElementById("btn");

btnConvertir.addEventListener("click", () => {

    const inputKilos = parseInt(document.getElementById("inputKilos").value);
    const operacion = inputKilos * 2.20462;
    let resultados = document.getElementById("resultados");
    resultados.textContent = operacion;


})