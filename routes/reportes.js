const express = require("express");
const router = express.Router();
const pool = require("../database");

router.get('/reportes', async(req, res) => {
    if (req.session.loggedin) {



        const arrayEmpleadosActivosDB = await pool.query('SELECT * FROM empleados WHERE estatus="Activo"');
        const arrayEmpleadosInactivosDB = await pool.query('SELECT * FROM empleados WHERE estatus="Inactivo"');
        const arrayPagosDB = await pool.query('SELECT idPago_x_empleado, pagos_x_empleados.idEmpleado, nombre, apellido, empleados.departamento, frecuenciaPago, periodo, descuento, comisionP, pagos_x_empleados.sueldoNeto, fechaPago, estadoPago FROM pagos_x_empleados, empleados where pagos_x_empleados.idEmpleado = empleados.idEmpleado ');
        const arrayDepartamentosDB = await pool.query('SELECT * FROM departamentos');
        const arrayAsignamientosDB = await pool.query('SELECT idEmpleado_x_departamento, empleado_x_departamento.idEmpleado, empleados.nombre, empleados.apellido, empleados.cedula, empleado_x_departamento.idDepartamento, departamentos.nombre_dpto, empleado_x_departamento.fechaRegistroB, empleado_x_departamento.estadoDepartamentoB, empleados.condicionContrato, empleados.formaPago, empleados.totalDescuentos, empleados.comision, empleados.sueldoBruto FROM empleado_x_departamento, empleados, departamentos WHERE empleados.idEmpleado = empleado_x_departamento.idEmpleado AND departamentos.idDepartamento = empleado_x_departamento.idDepartamento ');


        res.render("reportes", {
            arrayEmpleadosActivos: arrayEmpleadosActivosDB,
            arrayEmpleadosInactivos: arrayEmpleadosInactivosDB,
            arrayPagos: arrayPagosDB,
            arrayDepartamentos: arrayDepartamentosDB,
            arrayAsignamientos: arrayAsignamientosDB,
            login: true,
            name: req.session.name
        });


    } else {
        res.render('login', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
})






module.exports = router;