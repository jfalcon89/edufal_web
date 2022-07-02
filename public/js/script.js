// const formulario = document.getElementById("formulario");
// console.log(formulario);

const btnCalcula = document.getElementById("btn");

btnCalcula.addEventListener("click", () => {
    event.preventDefault();

    const genero = document.getElementById("DataList");
    const edad = parseInt(document.getElementById("edad").value);
    const talla = parseInt(document.getElementById("talla").value);
    const peso = parseInt(document.getElementById("peso").value);


    if (genero.value == "masculino") {

        const actMasculino = 2.447 - (edad * 0.09156) + (talla * 0.1074) + (peso * 0.3362);
        const respuesta = document.getElementById("respuesta");
        const labelResul = document.getElementById("labelResul");
        labelResul.textContent = "Agua corporal total"
        respuesta.textContent = actMasculino;
    } else {

        const actFemenina = -2.097 + (talla * 0.1069) + (peso * 0.2466);
        const respuesta = document.getElementById("respuesta");
        const labelResul = document.getElementById("labelResul");
        labelResul.textContent = "Agua corporal total"
        respuesta.textContent = actFemenina;

    };

});