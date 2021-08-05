const { response } = require("express");
const { Cliente, Region, Servicio, Team } = require("../models");




//obtenerServicios - páginado- total- populate
const obtenerServicios = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, servicios] = await Promise.all([ //envío arreglo, demora menos 
        Servicio.countDocuments(),
        Servicio.find()
            .populate('turno', 'nombre')
            .populate('usuarioIn', 'nombre')
            .populate('usuarioOut', 'nombre')
            .populate('team', 'nombre')
            .populate('cliente', 'nombre')
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
    const servicio = await Servicio.findById(id)
        .populate('turno', 'nombre')
        .populate('usuarioIn', 'nombre')
        .populate('usuarioOut', 'nombre')
        .populate('team', 'nombre')
        .populate('cliente', 'nombre');

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
    //RESCATO CLIENTE DESDE TEAM
    const team = await Team.findById(req.usuario.team);
    const cliente = team.cliente;

    //generar data para guardar
    const data = {
        titulo,
        descripcion,
        turno,
        usuarioIn: req.usuario._id,
        team: req.usuario.team,
        cliente: cliente
    }
    const servicio = new Servicio(data);

    //guardar BD
    await servicio.save();

    res.status(201).json(servicio);
}


//finalizar servicio
const finServicio = async (req, res = response) => {

    const { id } = req.params;
    const servicioBD = await Servicio.findById(id);
    const termino = Date();
    console.log(servicioBD);

    if (!servicioBD) {
        return res.status(400).json({
            msg: `El servicio ${servicioBD.nombre}, NO existe!`
        });
    }

    //generar data para guardar
    const data = {
        termino: termino,
        estado: false,
        usuarioOut: req.usuario._id
    }
    const servicio = await Servicio.findByIdAndUpdate(id, data);

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
    eliminarServicio,
    finServicio
}