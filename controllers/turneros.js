const { response } = require("express");
const { Team, Usuario, Turnero } = require("../models");




//obtenerTeams- páginado- total- populate
const obtenerTurneros = async (req = request, res = response) => {
  const { limite = 16, desde = 0 } = req.query;
  const query = { estado: true };  //solo los turneros activos en bd

  const [total, turnos] = await Promise.all([ //envío arreglo, demora menos 
    Turnero.countDocuments(query),
    Turnero.find(query)
      .populate('usuario', 'nombre')
      .populate('cliente', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite))
  ]);
  res.json({
    total,
    turnos
  });
}


//obtenerTeam - populate
const obtenerTurnero = async (req, res = response) => {
  const { id } = req.params;
  const turno = await Turnero.findById(id)
    .populate('usuario', 'nombre')
    .populate('cliente', 'nombre');

  res.json(turno);
}



//crear team
const crearTurnero = async (req, res = response) => {

  const { estado, usuario, ...body } = req.body;

  /*const turneroBD = await Turnero.findOne({ nombre: body });
  if (turneroBD) {
    return res.status(400).json({
      msg: `Ese turno, en esa fecha, ya existe!`
    });
  }*/

  //generar data para guardar
  const data = {
    ...body,
    usuario: req.usuario._id
  }
  const turno = new Turnero(data);

  //guardar BD
  await turno.save();

  res.status(201).json(turno);
}



//actualizarTeam
const actualizarTurnero = async (req, res = response) => {

  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.usuario = req.usuario._id;

  const turno = await Turnero.findByIdAndUpdate(id, data, { new: true });
  res.json(turno);
}


//borrarTeam - estado:false
const eliminarTurnero = async (req, res = response) => {

  const { id } = req.params;
  const turnoBorrado = await Turnero.findByIdAndUpdate(id, { estado: false }, { new: true });

  res.json(turnoBorrado);
}








module.exports = {

  obtenerTurneros,
  obtenerTurnero,
  crearTurnero,
  actualizarTurnero,
  eliminarTurnero
}