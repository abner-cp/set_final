const { response } = require("express");
const { Team } = require("../models");



//obtenerTeams- páginado- total- populate
const obtenerTeams = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };  //solo los teams activos en bd
  
    const [total, teams] = await Promise.all([ //envío arreglo, demora menos 
      Team.countDocuments(query),
      Team.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
  res.json({
    total,
    teams
  });
  }


//obtenerTeam - populate
const obtenerTeam= async(req, res=response)=> {
    const { id }= req.params;
    const team = await Team.findById( id ).populate('usuario', 'nombre');

    res.json( team );
}



//crear team
const crearTeam = async(req, res= response) => {

  const {estado, usuario, ...body} = req.body;

  const teamBD = await Team.findOne({ nombre: body.nombre });

  if( teamBD ){
      return res.status(400).json({
          msg: `El team ${ teamBD.nombre }, ya existe!`
      });
  }

  //generar data para guardar
  const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuario._id
  }
  const team = new Team( data ); 

  //guardar BD
  await team.save();

  res.status(201).json( team );
}



//actualizarTeam
const actualizarTeam= async(req, res=response) =>{

  const { id }= req.params;
  const { estado, usuario, ...data } =req.body;

  if( data.nombre ){
    data.nombre= data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const team = await Team.findByIdAndUpdate(id, data, { new: true });
  res.json( team );
}


//borrarTeam - estado:false
const eliminarTeam= async(req, res=response) =>{

const { id }= req.params;
const teamBorrado = await Team.findByIdAndUpdate( id, { estado: false }, { new: true });

res.json( teamBorrado );
}




module.exports = {

    obtenerTeams,
    obtenerTeam,
    crearTeam,
    actualizarTeam,
    eliminarTeam
}