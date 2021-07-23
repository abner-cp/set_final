const Role = require('../models/role'); // model de los roles de usuario
const { Usuario, Turno, Team, Cliente } = require('../models');



const esRoleValido = async (rol = '') => {
     const existeRol = await Role.findOne({ rol });
     if (!existeRol) {
          throw new Error(`El rol ${rol} no está registrado en la BD`)
     }
}

const emailExiste = async (correo = '') => {
     //verificar mail
     const existeEmail = await Usuario.findOne({ correo });
     if (existeEmail) {
          throw new Error(`El correo: ${correo}. ya está registrado...`);
     }
}


const existeUsuarioById = async (id) => {
     //verificar id
     const existeUsuario = await Usuario.findById(id);
     if (!existeUsuario) {
          throw new Error(`El Usuario: ${id}, no existe...`);
     }
}

const existeTurnoById = async (id) => {
     //verificar id
     const existeTurno = await Turno.findById(id);
     if (!existeTurno) {
          throw new Error(`El Turno: ${id}, no existe...`);
     }
}


const existeTeamById = async (id) => {
     //verificar id
     const existeTeam = await Team.findById(id);
     if (!existeTeam) {
          throw new Error(`El Team: ${id}, no existe...`);
     }
}

const existeClienteById = async (id) => {
     //verificar id
     const existeCliente = await Cliente.findById(id);
     if (!existeCliente) {
          throw new Error(`El Cliente: ${id}, no existe...`);
     }
}

const existeSupervisorById = async (id) => {
     //verificar id
     const existeSupervisor = await Usuario.findById(id);
     if (!existeSupervisor) {
          throw new Error(`El Supervisor: ${id}, no existe...`);
     }
     if (existeSupervisor.rol !== 'SUPERVISOR_ROLE') {
          throw new Error(`El Usuario: ${id}, no es supervisor...`);
     }
}
const existeGuardiaById = async (id) => {
     //verificar id
     const existeGuardia = await Usuario.findById(id);
     if (!existeGuardia) {
          throw new Error(`El guardia: ${id}, no existe...`);
     }
     if (existeGuardia.rol !== 'GUARDIA_ROLE') {
          throw new Error(`El Usuario: ${id}, no es guardia...`);
     }
}







module.exports = {
     esRoleValido,
     emailExiste,
     existeUsuarioById,
     existeTurnoById,
     existeTeamById,
     existeGuardiaById,
     existeClienteById,
     existeSupervisorById,
    
}