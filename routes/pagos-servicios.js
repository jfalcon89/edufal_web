const express = require("express");
const pool = require("../database");
const router = express.Router();




// INSERTANDO NUEVO PAGO SERVICIO 
router.post("/pagos-servicios", async(req, res) => {
    const { descripcionServicio, tipoPagoServicio, mesPagoServicio, montoPagoServicio, fechaPagoServicio, observacionPagoServicio } = req.body;

    const nuevoPagoServicio = {
        descripcionServicio,
        tipoPagoServicio,
        mesPagoServicio,
        montoPagoServicio,
        fechaPagoServicio,
        observacionPagoServicio

    };

    await pool.query('INSERT INTO pagos_servicios set ?', [nuevoPagoServicio]);

    res.redirect(`pagos-servicios`);

});


router.get('/pagos-servicios', async(req, res) => {
    if (req.session.loggedin) {

        const serviciosEneroDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosEnero FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Enero"`);
        const serviciosFebreroDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosFebrero FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Febrero"`);
        const serviciosMarzoDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosMarzo FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Marzo"`);
        const serviciosAbrilDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosAbril FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Abril"`);
        const serviciosMayoDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosMayo FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Mayo"`);
        const serviciosJunioDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosJunio FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Junio"`);
        const serviciosJulioDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosJulio FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Julio"`);
        const serviciosAgostoDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosAgosto FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Agosto"`);
        const serviciosSeptiembreDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosSeptiembre FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Septiembre"`);
        const serviciosOctubreDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosOctubre FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Octubre"`);
        const serviciosNoviembreDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosNoviembre FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Noviembre"`);
        const serviciosDiciembreDB = await pool.query(`SELECT SUM(montoPagoServicio) serviciosDiciembre FROM pagos_servicios WHERE pagos_servicios.mesPagoServicio = "Diciembre"`);

        const arrayServiciosEneroDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Enero'")
        const arrayServiciosFebreroDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Febrero'")
        const arrayServiciosMarzoDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Marzo'")
        const arrayServiciosAbrilDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Abril'")
        const arrayServiciosMayoDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Mayo'")
        const arrayServiciosJunioDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Junio'")
        const arrayServiciosJulioDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Julio'")
        const arrayServiciosAgostoDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Agosto'")
        const arrayServiciosSeptiembreDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Septiembre'")
        const arrayServiciosOctubreDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Octubre'")
        const arrayServiciosNoviembreDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Noviembre'")
        const arrayServiciosDiciembreDB = await pool.query("SELECT * FROM pagos_servicios where mesPagoServicio = 'Diciembre'")

        const serviciosTotalesDB = await pool.query("SELECT SUM(montoPagoServicio) serviciosTotales FROM pagos_servicios ")
        const cantPagosDB = await pool.query("SELECT COUNT(montoPagoServicio) cantPagos FROM pagos_servicios")



        res.render("pagos-servicios", {

            arrayServiciosEnero: arrayServiciosEneroDB,
            arrayServiciosFebrero: arrayServiciosFebreroDB,
            arrayServiciosMarzo: arrayServiciosMarzoDB,
            arrayServiciosAbril: arrayServiciosAbrilDB,
            arrayServiciosMayo: arrayServiciosMayoDB,
            arrayServiciosJunio: arrayServiciosJunioDB,
            arrayServiciosJulio: arrayServiciosJulioDB,
            arrayServiciosAgosto: arrayServiciosAgostoDB,
            arrayServiciosSeptiembre: arrayServiciosSeptiembreDB,
            arrayServiciosOctubre: arrayServiciosOctubreDB,
            arrayServiciosNoviembre: arrayServiciosNoviembreDB,
            arrayServiciosDiciembre: arrayServiciosDiciembreDB,

            serviciosEnero: serviciosEneroDB[0].serviciosEnero,
            serviciosFebrero: serviciosFebreroDB[0].serviciosFebrero,
            serviciosMarzo: serviciosMarzoDB[0].serviciosMarzo,
            serviciosAbril: serviciosAbrilDB[0].serviciosAbril,
            serviciosMayo: serviciosMayoDB[0].serviciosMayo,
            serviciosJunio: serviciosJunioDB[0].serviciosJunio,
            serviciosJulio: serviciosJulioDB[0].serviciosJulio,
            serviciosAgosto: serviciosAgostoDB[0].serviciosAgosto,
            serviciosSeptiembre: serviciosSeptiembreDB[0].serviciosSeptiembre,
            serviciosOctubre: serviciosOctubreDB[0].serviciosOctubre,
            serviciosNoviembre: serviciosNoviembreDB[0].serviciosNoviembre,
            serviciosDiciembre: serviciosDiciembreDB[0].serviciosDiciembre,

            serviciosTotales: serviciosTotalesDB[0].serviciosTotales,
            cantPagos: cantPagosDB[0].cantPagos,

            login: true,
            name: req.session.name
        });
    } else {
        res.render('pagos-servicios', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    // res.end();
});

router.get('/pagos-servicios/editar-pago-servicio/:id', async(req, res) => {
    if (req.session.loggedin) {

        const id = req.params.id;
        console.log(id)

        const servicioDB = await pool.query("SELECT * FROM pagos_servicios WHERE idPagoServicio = ?", [id]);


        res.render('editar-pago-servicio', {
            servicio: servicioDB[0],
            login: true,
            name: req.session.name

        });
    } else {
        res.render('editar-pago-servicio', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }

});

//GUARDAR ACTUALIZACION DE PAGO SERVICIO
router.post('/pagos-servicios/editar-pago-servicio/:id', async(req, res) => {
    const id = req.params.id;

    const { descripcionServicio, tipoPagoServicio, mesPagoServicio, montoPagoServicio, fechaPagoServicio, observacionPagoServicio } = req.body;
    const pagoServicio = {
        descripcionServicio,
        tipoPagoServicio,
        mesPagoServicio,
        montoPagoServicio,
        fechaPagoServicio,
        observacionPagoServicio
    };




    await pool.query("UPDATE pagos_servicios set ? WHERE idPagoServicio = ?", [pagoServicio, id]);
    // req.flash('success', 'Link actualizado correctamente');
    res.redirect('/pagos-servicios');
});


// ELIMINAR PAGO SERVICIO
router.get("/pagos-servicios/editar-pago-servicio/eliminar-pago-servicio/:id", async(req, res) => {

    const { id } = req.params;
    console.log(id)


    try {

        await pool.query("DELETE FROM pagos_servicios WHERE idPagoServicio = ?", [id]);

        res.redirect("/pagos-servicios");

    } catch (error) {
        console.log(error)
    }

});




module.exports = router;