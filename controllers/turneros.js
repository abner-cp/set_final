const { response } = require("express");
const { Team, Usuario, Turnero, Cliente, Turno } = require("../models");
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

  const { estado, usuario, guardia, inicio, cliente, team, turno, ...body } = req.body;
  const fechaInicio = new Date(inicio);

  const clienteBD = await Cliente.findById(cliente);
  const guardiaBD = await Usuario.findById(guardia);
  const teamBD = await Team.findById(team);
  const turnoBD = await Turno.findById(turno);
  if(!turnoBD){
    return res.status(400).json({
      msg: `Proporcione un turno válido`
    });
  }

  if (!teamBD.clientes.includes(cliente)) {
    return res.status(400).json({
      msg: `El cliente ${clienteBD.nombre}, NO existe en teams: ${teamBD.nombre}`
    });
  }
  if (!teamBD.guardias.includes(guardia)) {
    return res.status(400).json({
      msg: `El guardia ${guardiaBD.nombre}, NO existe en teams: ${teamBD.nombre}`
    });
  }

  //validar turnos repetidos en guardias y max 6 turnos x semana...verificar el tema de los dias repetitivos(array)
  const turnosBD = await Turnero.find().where({ estado: true })
    .where({ guardia: guardia });
  if (turnosBD.length > 5) {
    return res.status(400).json({
      msg: `El guardia ${guardiaBD.nombre}, Máximo 6 turnos semanales!`
    });
  }
  const validarFecha = await turnosBD.find(elemento => elemento.inicio == fechaInicio);
  console.log(validarFecha); //llega undefined
  console.log(fechaInicio);
  if (validarFecha) {
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
    turno,
    team,
    cliente: cliente,
    usuario: req.usuario._id
  }
  const newTurno = new Turnero(data);

  //guardar BD
  await newTurno.save();

  res.status(201).json(newTurno);
}



//actualizarTeam
const actualizarTurnero = async (req, res = response) => {

  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.usuario = req.usuario._id;

  const turno = await Turnero.findByIdAndUpdate(id, data, { new: true });
  res.json(turno);
}


//iniciar un turno (guardia)
const iniciarTurnero = async (id, req, res = response) => {

 // const { id } = req.params;
  const turnero = await Turnero.findById(id);
  console.log(turnero.guardia);
  console.log(req.usuario._id);
  const user1 = await Usuario.findById(turnero.guardia);
  const user2 = await Usuario.findById(req.usuario._id);
  if(!user1._id.equals(user2._id)){
    return res.status(400).json({
      msg: `Acceso denegado/ Guardia no corresponde`
    });
  }

  if(!turnero){
    return res.status(400).json({
      msg: `El turno no existe`
    });
  }
const turno = await Turno.findById(turnero.turno);
if(turnero.estado == false){
  return res.status(400).json({
    msg: `EL turno ya caducó`
  });
}
if(turnero.encurso == true){
  return res.status(400).json({
    msg: `EL turno ya está en CURSO`
  });
}
//falta validar fecha de turno
await Turnero.findByIdAndUpdate(id,  { encurso: true });

  res.json(turnero);
}


//finalizar un turno (guardia)
const finalizarTurnero = async (id, req, res = response) => {

  //const { id } = req.params;
  const turnero = await Turnero.findById(id);
  const user1 = await Usuario.findById(turnero.guardia);
  const user2 = await Usuario.findById(req.usuario._id);
  if(!user1._id.equals(user2._id)){
    return res.status(400).json({
      msg: `Acceso denegado/ Guardia no corresponde`
    });
  }
  if(!turnero){
    return res.status(400).json({
      msg: `El turno no existe`
    });
  }
  if(turnero.encurso == false){
    return res.status(400).json({
      msg: `El turno No Está En Curso`
    });
  }
 
  const newTurnero =await Turnero.findByIdAndUpdate(id,  { encurso: false, estado: false });
  const guardia = await Usuario.findById(turnero.guardia);
  let horas= Number;
  horas = guardia.totalHoras +8;
  console.log(horas);
  console.log(req.usuario._id);

  const user= await Usuario.findByIdAndUpdate(guardia._id, {totalHoras: horas});

  res.json({ newTurnero, user});
}


//borrarTeam - estado:false
const eliminarTurnero = async (req, res = response) => {

  const { id } = req.params;
  const turnoBorrado = await Turnero.findByIdAndUpdate(id, { estado: false }, { new: true });

  res.json(turnoBorrado);
}

//guardia añade observacion al turno
const addObs = async (id, req, res = response) => {
 const {observacion} = req.body;
 const turnero = await Turnero.findById(id);
 const user1 = await Usuario.findById(turnero.guardia);
 const user2 = await Usuario.findById(req.usuario._id);
 if(!user1._id.equals(user2._id)){
   return res.status(400).json({
     msg: `Acceso denegado/ Guardia no corresponde`
   });
 }

 if(!turnero){
   return res.status(400).json({
     msg: `El turno no existe`
   });
 }
const turno = await Turno.findById(turnero.turno);
if(turnero.estado == false){
 return res.status(400).json({
   msg: `EL turno ya caducó`
 });
}
if(!turnero.encurso == true){
 return res.status(400).json({
   msg: `EL turno NO está en CURSO!!!`
 });
}

const addObs = await Turnero.findByIdAndUpdate(id, {
  $push: { observacion },
});

 res.json(addObs);
}

//ver observaciones de un turno
const viewObs = async (id, req, res = response) => {

 const turnero = await Turnero.findById(id);
 if(!turnero){
  return res.status(400).json({
    msg: `El turno NO existe!!!`
  });
 }
 const obs = turnero.observacion;
 res.json(obs);
}


const turnos = (req, res = response) => {

  const { coleccion, id } = req.params;


  switch (coleccion) {
    case 'in':
      iniciarTurnero(id, req, res);
      break;
    case 'out':
      finalizarTurnero(id, req, res);
      break;
    case 'obs':
      addObs(id, req, res);
      break;
    case 'viewObs':
      viewObs(id, req, res);
      break;
   
    default:
      res.status(500).json({
        msg: 'busqueda incompleta!!!'
      })
  }
}









module.exports = {

  obtenerTurneros,
  obtenerTurnero,
  crearTurnero,
  actualizarTurnero,
  eliminarTurnero,
  iniciarTurnero,
  finalizarTurnero, 
  turnos
}