const { request, response } = require('express');
const { Team, Usuario } = require('../models');

const validarGuardiaTeams = async(req, res, next) => {
     //verificar id
     const {id} = req.params;
     const {guardia}= req.body;
     const datoGuardia = await Usuario.findById(guardia);
     
     const team = await Team.findById(id);
     if (team.guardias.includes(guardia)) {
          throw new Error(`El guardia: ${datoGuardia.nombre} ${datoGuardia.apellido}, ya existe...`);
     }
    next();
}

module.exports = {
    validarGuardiaTeams
}