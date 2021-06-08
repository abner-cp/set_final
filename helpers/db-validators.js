const Role = require('../models/role'); // model de los roles de usuario
const Usuario = require('../models/usuario'); 


const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne( {rol} );
        if( !existeRol ){
                throw new Error(`El rol ${ rol } no está registrado en la BD`)
        }
}

const emailExiste = async (correo = '') => {
   //verificar mail
   const existeEmail = await Usuario.findOne({ correo });
   if (existeEmail) {
        throw new Error(`El correo: ${ correo }. ya está registrado...`)
   }
}


const existeUsuarioById = async (id) => {
   //verificar id
   const existeUsuario = await Usuario.findById( {id });
   if (!existeUsuario) {
        throw new Error(`El Usuario: ${ id }, no existe...`);
   }
}




module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioById
}