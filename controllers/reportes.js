const path = require('path');
const PDF = require('pdfkit-construct');
const fs = require('fs');

const { response } = require("express");
const { Turno, Usuario, Team } = require("../models");
const { listeners, events, discriminator } = require('../models/usuario');
const { set } = require('mongoose');



//obtenerReportes - páginado- total- populate
const obtenerReportes = async (req = request, res = response) => {

   const usuarios= await Usuario.find({estado: true});
   const turnos= await Turno.find({estado: true});
   let count = 1;
   const registros = usuarios.map( (Usuario) => {
       const registro = {
           nro: count,
           nombre: Usuario.nombre,
           apellido: Usuario.apellido,
           correo: Usuario.correo,
           ingreso: Usuario.ingreso,

       }
       count++;
       return registro;

   });
   
   console.log(turnos);
   const totalUsuarios = await Usuario.countDocuments({estado: true});

   const teams= await Team.find({estado: true}).populate('cliente', 'nombre');
   const totalTeams = await Team.countDocuments({estado: true});

    const doc = new PDF( { bufferPage: true } );
   const filename= `rpt${Date.now()}.pdf`;

    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment`+`filename=${filename}`
    });

    doc.on('data', (data) => {stream.write(data)});
    doc.on('end', () => {stream.end()});


    // const resultados = [
    //     {
    //     nombre: usuarios.nombre,
    //     apellido: usuarios.apellido,
    //     rol: usuarios.rol,
    //     }
    // ];

    
    doc.image('./assets/logo.png', {
        fit: [70, 70],
        align: 'center',
        valign: 'center'
      });

    doc.setDocumentHeader({
        
        height: '26'
    }, () => {
        doc.fontSize(15).text('Reportes de Usuarios', {
            width: 420,
            align: 'center'
        });

        doc.fontSize(12);

        doc.text(`Total de Usuarios: ${totalUsuarios}`, {
            width: 420,
            align: 'right'
        });
        doc.text(`Total de Teams: ${totalTeams}`, {
            width: 420,
            align: 'right'
        });

        
    });

    doc.addTable([
        {key: 'nro', label: 'nro', align: 'left'},
        {key: 'nombre', label: 'nombre', align: 'left'},
        {key: 'apellido', label: 'apellido', align: 'left'},
        {key: 'correo', label: 'Email', align: 'left'},
        {key: 'ingreso', label: 'fecha_ingreso', align: 'left'},
    ], registros,  {
        border: null,
        width: "fill_body",
        striped: true,
        stripedColors: ["#f6f6f6", "#d6c4dd"],
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: 'center',

    })

    doc.render();
   
    doc.end();

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