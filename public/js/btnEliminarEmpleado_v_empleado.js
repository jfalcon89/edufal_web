// // funtion para abrir modal de eliminarEmpleado 

// const prueba = document.querySelector(".prueba");

// prueba.addEventListener("click", () => {
//     console.log("me diste");
// });
try {

    const btnEliminarEmpleado_v_empleado = document.querySelector(".btnEliminarEmpleado_v_empleado");
    btnEliminarEmpleado_v_empleado.addEventListener("click", () => {
        console.log("le diste abrir eliminar empleado")


        const modal_container_eliminarEmpleado = document.querySelector(".modal_container_eliminarEmpleado");
        modal_container_eliminarEmpleado.style.visibility = "visible"
        const modal_parametros_eliminarEmpleado = document.querySelector(".modal_parametros_eliminarEmpleado");
        modal_parametros_eliminarEmpleado.classList.add("efectoEliminarEmpleado");

        const closeEliminarEmpleado = document.querySelector(".closeEliminarEmpleado");

        // funtion para cerrar modal de parametros
        closeEliminarEmpleado.addEventListener("click", () => {
            console.log("le diste a cerrar eliminar empleado")

            const modal_container_eliminarEmpleado = document.querySelector(".modal_container_eliminarEmpleado");
            modal_container_eliminarEmpleado.style.visibility = "hidden"
            const modal_parametros_eliminarEmpleado = document.querySelector(".modal_parametros_eliminarEmpleado");
            modal_parametros_eliminarEmpleado.classList.remove("efectoEliminarEmpleado");

        });
    });


} catch (error) {
    console.log(error)
}


const inputBuscar = document.getElementById('buscar')
const celdas = document.getElementsByTagName('td')

//Búsqueda
inputBuscar.addEventListener('keyup', (e) => {
    let texto = e.target.value
    console.log(texto)


    // let er = new RegExp(texto, "i")
    // for (let i = 0; i < celdas.length; i++) {
    //     let valor = celdas[i]
    //     console.log(valor)
    //     if (er.test(valor.innerText)) {
    //         valor.classList.remove("ocultar")
    //     } else {
    //         console.log(valor)
    //         valor.classList.add("ocultar")
    //     }
    // }
})