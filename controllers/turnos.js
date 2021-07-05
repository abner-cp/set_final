const { response } = require("express");
const { Turno } = require("../models");



//obtenerTurnos - páginado- total- populate
const obtenerTurnos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };  //solo los turnos activos en bd
  
    const [total, turnos] = await Promise.all([ //envío arreglo, demora menos 
      Turno.countDocuments(query),
      Turno.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
  res.json({
    total,
    turnos
  });
  }


//obtenerTurno - populate
const obtenerTurno= async(req, res=response)=> {
    const { id }= req.params;
    const turno = await Turno.findById( id ).populate('usuario', 'nombre');

    res.json( turno );
}


//crear turno
const crearTurno = async(req, res= response) => {

    const nombre = req.body.nombre.toUpperCase();
    const turnoBD = await Turno.findOne({ nombre });

    if( turnoBD ){
        return res.status(400).json({
            msg: `El turno ${ turnoBD.nombre }, ya existe!`
        });
    }

    //generar data para guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const turno = new Turno( data ); 

    //guardar BD
    await turno.save();

    res.status(201).json(turno);
}


//actualizarTurno
const actualizarTurno= async(req, res=response) =>{

        const { id }= req.params;
        const { estado, usuario, ...data } =req.body;

        data.nombre= data.nombre.toUpperCase();
        data.usuario = req.usuario._id;

        const turno = await Turno.findByIdAndUpdate(id, data, { new: true });
        res.json( turno );
}


//borrarTurno - estado:false
const eliminarTurno= async(req, res=response) =>{

    const { id }= req.params;
    const turnoBorrado = await Turno.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json( turnoBorrado );
}





module.exports = {
    crearTurno,
    obtenerTurnos,
    obtenerTurno,
    actualizarTurno,
    eliminarTurno
}