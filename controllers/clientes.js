const { response } = require("express");
const { Cliente, Region } = require("../models");




//obtenerClientes - páginado- total- populate
const obtenerClientes = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };  //solo los clientes activos en bd

    const [total, clientes] = await Promise.all([ //envío arreglo, demora menos 
        Cliente.countDocuments(query),
        Cliente.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        clientes
    });
}


//obtenerCliente - populate
const obtenerCliente = async (req, res = response) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id).populate('usuario', 'nombre');

    res.json(cliente);
}


//crear cliente
const crearCliente = async (req, res = response) => {

    const { nombre, rut, celular, correo, direccion, region, ciudad } = req.body;
    const clienteBD = await Cliente.findOne({ nombre });

    if (clienteBD) {
        return res.status(400).json({
            msg: `El cliente ${clienteBD.nombre}, ya existe!`
        });
    }
    const existeEmail = await Cliente.findOne({ correo });
    if (existeEmail) {
         throw new Error(`El correo: ${correo}. ya está registrado...`);
    }

        const regionBD = await Region.findById(region);
        if (!regionBD) {
            return res.status(400).json({
                msg: `La region no corresponde!`
            });
        }
        const arrCiudad = regionBD.ciudades;
        if (!arrCiudad.includes(ciudad)) {
            return res.status(400).json({
                msg: `La ciudad ${ciudad}, no corresponde!`
            });
        }

    //generar data para guardar
    const data = {
        nombre,
        rut,
        celular,
        correo,
        direccion,
        region: regionBD,
        ciudad,
        usuario: req.usuario._id
    }
    const cliente = new Cliente(data);

    //guardar BD
    await cliente.save();

    res.status(201).json(cliente);
}




//actualizarCliente
const actualizarCliente = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;
    if (data.region) {
        const region = await Region.findById(data.region);
        if (!region) {
            return res.status(400).json({
                msg: `La region no corresponde!`
            });
        }
        const arrCiudad = region.ciudades;
        if (!arrCiudad.includes(data.ciudad)) {
            return res.status(400).json({
                msg: `La ciudad ${data.ciudad}, no corresponde!`
            });
        }
    }

    const cliente = await Cliente.findByIdAndUpdate(id, data, { new: true });
    res.json(cliente);
}


//borrarCliente - estado:false
const eliminarCliente = async (req, res = response) => {

    const { id } = req.params;
    const clienteBorrado = await Cliente.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(clienteBorrado);
}





module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente
}