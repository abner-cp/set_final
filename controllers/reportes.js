const path = require('path');
const PDF = require('pdfkit');
const fs = require('fs');

const { response } = require("express");
const { Turno, Usuario } = require("../models");



//obtenerReportes - páginado- total- populate
const obtenerReportes = async (req = request, res = response) => {

    var doc = new PDF();

    const pathRpt = path.join(__dirname, '../reportes');

    doc.pipe(fs.createWriteStream(pathRpt + '/example.pdf'));

    doc.text('Reportes de Usuario', {
        align: 'center'
    });

    const resultado = await Usuario.find({ estado: true},{"nombre":1,"_id":0});
    const totalGuardias = await Usuario.countDocuments({estado: true, rol: 'GUARDIA_ROLE'});

    doc.text('nombre',{
       columns: 1
    });
    doc.text(resultado,{
       columns: 1
    });
    doc.end();
    console.log('RPT generado');
    res.json(resultado);
}


//obtenerReporte - populate
const obtenerReporte = async (req, res = response) => {
    const { id } = req.params;
    const turno = await Turno.findById(id).populate('usuario', 'nombre');

    res.json(turno);
}


//crear reporte
const crearReporte = async (req, res = response) => {

    const { nombre, ingreso, salida, horas, colacion } = req.body;
    const nombre2 = nombre.toUpperCase();
    console.log(nombre2);
    const turnoBD = await Turno.findOne({ nombre });

    if (turnoBD) {
        return res.status(400).json({
            msg: `El turno ${turnoBD.nombre}, ya existe!`
        });
    }

    //generar data para guardar
    const data = {
        nombre, ingreso, salida, horas, colacion,
        usuario: req.usuario._id
    }
    const turno = new Turno(data);

    //guardar BD
    await turno.save();

    res.status(201).json(turno);
}


//actualizarReporte
const actualizarReporte = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const turno = await Turno.findByIdAndUpdate(id, data, { new: true });
    res.json(turno);
}


//borrarReporte - estado:false
const eliminarReporte = async (req, res = response) => {

    const { id } = req.params;
    const turnoBorrado = await Turno.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(turnoBorrado);
}





module.exports = {
    crearReporte,
    obtenerReporte,
    obtenerReportes,
}