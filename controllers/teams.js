const { response } = require("express");
const { Team, Usuario } = require("../models");



//obtenerTeams- páginado- total- populate
const obtenerTeams = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };  //solo los teams activos en bd

  const [total, teams] = await Promise.all([ //envío arreglo, demora menos 
    Team.countDocuments(query),
    Team.find(query)
      .populate('usuario', 'nombre')
      .populate('cliente', 'nombre')
      .populate('supervisor', 'nombre')
      .populate('guardias')
      .skip(Number(desde))
      .limit(Number(limite))
  ]);
  res.json({
    total,
    teams
  });
}


//obtenerTeam - populate
const obtenerTeam = async (req, res = response) => {
  const { id } = req.params;
  const team = await Team.findById(id)
    .populate('usuario', 'nombre')
    .populate('supervisor', 'nombre')
    .populate('cliente', 'nombre')
    .populate('guardias');

    const totalGuardias =team.guardias.length;

  res.json({team, totalGuardias});
}



//crear team
const crearTeam = async (req, res = response) => {

  const { estado, usuario, ...body } = req.body;

  const teamBD = await Team.findOne({ nombre: body.nombre });

  if (teamBD) {
    return res.status(400).json({
      msg: `El team ${teamBD.nombre}, ya existe!`
    });
  }

  //generar data para guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id
  }
  const team = new Team(data);

  //guardar BD
  await team.save();

  res.status(201).json(team);
}



//actualizarTeam
const actualizarTeam = async (req, res = response) => {

  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const team = await Team.findByIdAndUpdate(id, data, { new: true });
  res.json(team);
}


//borrarTeam - estado:false
const eliminarTeam = async (req, res = response) => {

  const { id } = req.params;
  const teamBorrado = await Team.findByIdAndUpdate(id, { estado: false }, { new: true });

  res.json(teamBorrado);
}


//agregar guardias a teams
const agregarGuardias = async (id, req, res = response) => {

  const { guardia } = req.body;
  if (guardia == null) {
    return res.status(400).json({
      msg: `El guardia no es válido!`
    });
  }

  const asignarGuardia = await Team.findByIdAndUpdate(id, {
    $push: { guardias: guardia },
  });
  await Usuario.findByIdAndUpdate(guardia, { team: asignarGuardia });

  res.json(asignarGuardia);
}

//eliminar guardias a teams
const eliminarGuardias = async (id, req, res = response) => {

  const { guardia } = req.body;
  if (guardia == null) {
    return res.status(400).json({
      msg: `El guardia no es válido!`
    });
  }

  const eliminarGuardia = await Team.findByIdAndUpdate(id, {
    $pull: { guardias: guardia },
  });

  //await Usuario.findByIdAndUpdate(guardia, {team: null});
  res.json(eliminarGuardia);
}

//agregar cliente a teams
const agregarCliente = async (id, req, res = response) => {

  const { cliente } = req.body;
  if (cliente == null) {
    return res.status(400).json({
      msg: `El cliente no es válido!`
    });
  }

  const asignarCliente = await Team.findByIdAndUpdate(id, {
    $push: { clientes: cliente },
  });
  //await Usuario.findByIdAndUpdate(guardia, { team: asignarGuardia });
  res.json(asignarCliente);
}

//eliminar cliente a teams
const eliminarCliente = async (id, req, res = response) => {

  const { cliente } = req.body;
  if (cliente == null) {
    return res.status(400).json({
      msg: `El cliente no es válido!`
    });
  }
  const eliminarCliente = await Team.findByIdAndUpdate(id, {
    $pull: { clientes: cliente },
  });

  //await Usuario.findByIdAndUpdate(guardia, {team: null});
  res.json(eliminarCliente);
}



const guardias = (req, res = response) => {

  const { coleccion, id } = req.params;

  /*if (!coleccionesPermitidas.includes(coleccion)) {

    return res.status(400).json({
      msg: `las colecciones permitidas son: ${coleccionesPermitidas}`
    })
  }*/

  switch (coleccion) {
    case 'add':
      agregarGuardias(id, req, res);
      break;
    case 'aCliente':
      agregarCliente(id, req, res);
      break;
    case 'bCliente':
      eliminarCliente(id, req, res);
      break;

    case 'del':
      eliminarGuardias(id, req, res);
      break;
    default:
      res.status(500).json({
        msg: 'busqueda incompleta!!!'
      })
  }
}





module.exports = {

  guardias,
  obtenerTeams,
  obtenerTeam,
  crearTeam,
  actualizarTeam,
  eliminarTeam
}