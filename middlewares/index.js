
const validaCampos  = require('../middlewares/validar-campos'); //middleware personalizado
const validaJWT  = require('../middlewares/validar-jwt');
const  validaRole  = require('../middlewares/validar-roles');
const  validarGuardiaTeams  = require('../middlewares/validar-guardia-team');
const  validarArchivo  = require('../middlewares/validar-archivo');



module.exports= {
    ...validaCampos,
    ...validaJWT,
    ...validaRole,
    ...validarGuardiaTeams,
    ...validarArchivo,
}