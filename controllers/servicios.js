const { response } = require("express");
const { Cliente, Region, Servicio } = require("../models");




//obtenerServicios - páginado- total- populate
const obtenerServicios = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, servicios] = await Promise.all([ //envío arreglo, demora menos 
        Servicio.countDocuments(query),
        Servicio.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        servicios
    });
}


//obtenerServicio - populate
const obtenerServicio = async (req, res = response) => {
    const { id } = req.params;
    const servicio = await Servicio.findById(id).populate('usuario', 'nombre');

    res.json(servicio);
}


//crear servicio
const crearServicio = async (req, res = response) => {

    const { titulo, descripcion, turno } = req.body;
    const servicioBD = await Servicio.findOne({ titulo });

    if (servicioBD) {
        return res.status(400).json({
            msg: `El servicio ${servicioBD.nombre}, ya existe!`
        });
    }

    //generar data para guardar
    const data = {
       titulo,
       descripcion,
       turno,
        usuario: req.usuario._id
    }
    const servicio = new Servicio(data);

    //guardar BD
    await servicio.save();

    res.status(201).json(servicio);
}




//actualizarServicio
const actualizarServicio = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.usuario = req.usuario._id;

    const servicio = await Servicio.findByIdAndUpdate(id, data, { new: true });
    res.json(servicio);
}


//borrarServicio - estado:false
const eliminarServicio = async (req, res = response) => {

    const { id } = req.params;
    const servicioBorrado = await Servicio.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(servicioBorrado);
}





module.exports = {
    crearServicio,
    obtenerServicios,
    obtenerServicio,
    actualizarServicio,
    eliminarServicio
}