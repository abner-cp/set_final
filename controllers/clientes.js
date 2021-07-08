const { response } = require("express");
const { Cliente } = require("../models");




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
const obtenerCliente= async(req, res=response)=> {
    const { id }= req.params;
    const cliente = await Cliente.findById( id ).populate('usuario', 'nombre');

    res.json( cliente );
}


//crear cliente
const crearCliente = async(req, res= response) => {

    const {nombre, rut, celular, correo} = req.body;
    const clienteBD = await Cliente.findOne({ nombre });

    if( clienteBD ){
        return res.status(400).json({
            msg: `El cliente ${ clienteBD.nombre }, ya existe!`
        });
    }

    //generar data para guardar
    const data = {
        nombre,
        rut,
        celular,
        correo,
        usuario: req.usuario._id
    }
    const cliente = new Cliente( data ); 

    //guardar BD
    await cliente.save();

    res.status(201).json(cliente);
}



//actualizarCliente
const actualizarCliente= async(req, res=response) =>{

        const { id }= req.params;
        const { estado, usuario, ...data } =req.body;

        data.nombre= data.nombre.toUpperCase();
        data.usuario = req.usuario._id;

        const cliente = await Cliente.findByIdAndUpdate(id, data, { new: true });
        res.json( cliente );
}


//borrarCliente - estado:false
const eliminarCliente= async(req, res=response) =>{

    const { id }= req.params;
    const clienteBorrado = await Cliente.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json( clienteBorrado );
}





module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente
}