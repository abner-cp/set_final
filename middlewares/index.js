
const validaCampos  = require('../middlewares/validar-campos'); //middleware personalizado
const validaJWT  = require('../middlewares/validar-jwt');
const  validaRole  = require('../middlewares/validar-roles');



module.exports= {
    ...validaCampos,
    ...validaJWT,
    ...validaRole,
}