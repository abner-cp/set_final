const { request, response } = require('express');
const { Team } = require('../models');

const validarGuardiaTeams = async(req, res, next) => {
     //verificar id
     const {id} = req.params;
     const {guardia}= req.body;
     const team = await Team.findById(id);
     if (team.guardias.includes(guardia)) {
          throw new Error(`El guardia: ${guardia}, ya existe...`);
     }
    next();
}

module.exports = {
    validarGuardiaTeams
}