const { response, request } = require('express');
const bcryptjs = require('bcryptjs'); //encriptar pass


const Usuario = require('../models/usuario');  //modelo class
const { Team } = require('../models');


//POST
const usuariosPost = async (req, res) => {
  const { nombre, apellido, rut, celular, correo, password, rol, direccion, region, ciudad } = req.body;


  const usuario = new Usuario({ nombre, apellido, rut, celular, correo, password, rol, direccion, region, ciudad });

  //encriptar pass
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //guardar bd
  await usuario.save();
  res.json({
    usuario, 
  });
}


//actualizar
const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;
  //TODO validaciones contra bd
  if (password) {
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json(usuario);
}


//GET
const usuariosGet = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query;
  const query = { estado: true };  //solo los usuarios activos en bd

  const [total, usuarios] = await Promise.all([ //envío arreglo, demora menos 
    Usuario.countDocuments(query),
    Usuario.find(query).populate('region', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite))
  ]);
  res.json({
    total,
    usuarios
  });
}


//obtenerUsuario 
const obtenerUsuario = async (req, res = response) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id);

  res.json(usuario);
}



//Delete
const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const uid = req.uid;
  const usuario = await Usuario.findById(id);
  const teamUs = await Team.findById(usuario.team);
  const arrayGuardias = teamUs.guardias;

  if (!arrayGuardias.includes(usuario._id)) {
    return res.status(400).json({
      msg: `El guardia ${usuario.nombre}, NO existe en teams: ${teamUs.nombre}`
    });
  }

  await Team.findByIdAndUpdate(usuario.team, {
    $pull: { guardias: id },
  });

  const usuarioNew = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json(usuarioNew);
}




module.exports = {
  usuariosGet,
  obtenerUsuario,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
}