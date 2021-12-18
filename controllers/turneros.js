const { response } = require("express");
const { Team, Usuario, Turnero } = require("../models");
const { guardias } = require("./teams");




//obtenerTeams- páginado- total- populate
const obtenerTurneros = async (req = request, res = response) => {
  const { limite = 16, desde = 0 } = req.query;
  const query = { estado: true };  //solo los turneros activos en bd

  const [total, turnos] = await Promise.all([ //envío arreglo, demora menos 
    Turnero.countDocuments(query),
    Turnero.find(query)
      .populate('guardia')
      .populate('turno')
      .populate('usuario', 'nombre')
      .populate('cliente', 'nombre')
      .populate('team', 'nombre')
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
    .populate('guardia')
    .populate('turno')
    .populate('usuario', 'nombre')
    .populate('cliente', 'nombre')
    .populate('team', 'nombre');

  res.json(turno);
}



//crear turnero
const crearTurnero = async (req, res = response) => {

  const { estado, usuario, guardia, inicio, ...body } = req.body;
  const fechaInicio = new Date(inicio);

  const guardiaBD = await Usuario.findById(guardia);
  const teamBD= guardiaBD.team;

  /*const turneroBD = await Turnero.findOne({ nombre: body });
  if (turneroBD) {
    return res.status(400).json({
      msg: `Ese turno, en esa fecha, ya existe!`
    });
  }*/

  //validar turnos repetidos en guardias y max 6 turnos x semana...verificar el tema de los dias repetitivos(array)
  const turnosBD = await Turnero.find().where({ estado: true })
                                        .where({guardia: guardia});
  if(turnosBD.length> 5){
    return res.status(400).json({
        msg: `El guardia ${guardiaBD.nombre}, Máximo 6 turnos semanales!`
      });
    }
  const validarFecha= turnosBD.find(elemento => elemento.inicio==fechaInicio);
 console.log(validarFecha);
 console.log(fechaInicio);
  if(validarFecha){
    return res.status(400).json({
        msg: `El guardia ${guardiaBD.nombre}, Ya tiene asignado un turno en esa fecha!`
      });
    }

  console.log(turnosBD);

  //generar data para guardar
  const data = {
    ...body,
    inicio: inicio,
    guardia: guardia,
    team: teamBD,
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