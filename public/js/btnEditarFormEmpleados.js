//btn eliminar empleado 
const btnEliminarEmpleado = document.querySelector("#btnEliminarEmpleado");

btnEliminarEmpleado.addEventListener("click", async() => {

    console.log("me diste click")
    const id = btnEliminarEmpleado.dataset.id
    console.log("id", id)
    try {
        const data = await fetch(`/empleados/detalle-empleado/${id}`, {
            method: "delete"
        })
        const res = await data.json()
        if (res.estado) {
            window.location.href = "/empleados"
        } else {
            console.log(res)
        }

    } catch (error) {
        console.log(error)
    }
    const mensaje = document.getElementById("mensaje").textContent = "Empleado eliminado correctamente"
    console.log(mensaje)
});

//btn editar empleado
const formEditar = document.querySelector('#editar');

formEditar.addEventListener('submit', async(e) => {
    e.preventDefault()
        // Alternativa #1 (capturar input)
    const nombre = formEditar.elements['nombre'].value
    const apellido = formEditar.elements['apellido'].value
        // Alternativa #2 (capturar input)
    const cedula = document.querySelector('#cedula').value
    const codigo = document.querySelector('#codigo').value
    const sexo = formEditar.elements['sexo'].value
    const estatus = formEditar.elements['estatus'].value
    const departamento = formEditar.elements['departamento'].value
    const nacimiento = formEditar.elements['nacimiento'].value
    const lugarNacimiento = formEditar.elements['lugarNacimiento'].value
    const nacionalidad = formEditar.elements['nacionalidad'].value
    const sueldoBruto = formEditar.elements['sueldoBruto'].value
    const afp = formEditar.elements['afp'].value
    const ars = formEditar.elements['ars'].value
    const cooperativa = formEditar.elements['cooperativa'].value
    const club = formEditar.elements['club'].value
    const prestamos = formEditar.elements['prestamos'].value
    const totalDescuentos = formEditar.elements['totalDescuentos'].value
    const sueldoNeto = formEditar.elements['sueldoNeto'].value
    const id = formEditar.dataset.id

    const data = await fetch(`/empleados/detalle-empleado/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // body: JSON.stringify({ nombre, cedula, codigo, departamento })
        body: JSON.stringify({ nombre, apellido, cedula, codigo, sexo, estatus, departamento, nacimiento, lugarNacimiento, nacionalidad, sueldoBruto, afp, ars, cooperativa, club, prestamos, totalDescuentos, sueldoNeto })
    })

    const res = await data.json()

    if (res.estado) {
        window.location.href = '/empleados'
    } else {
        console.log(res)
    }

})