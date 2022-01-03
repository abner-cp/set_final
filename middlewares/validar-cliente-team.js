const { request, response } = require('express');
const { Team, Usuario, Cliente } = require('../models');

const validarClienteTeams = async(req, res, next) => {
     //verificar id
     const {id} = req.params;
     const {cliente}= req.body;
     const datoCliente = await Cliente.findById(cliente);
     
     const team = await Team.findById(id);
     if (team.clientes.includes(cliente)) {
          throw new Error(`El cliente: ${datoCliente.nombre} ${datoCliente.rut}, ya existe...`);
     }
    next();
}

module.exports = {
    validarClienteTeams
}