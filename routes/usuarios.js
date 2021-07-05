const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT,
     validarCampos,
      tieneRole,
       AdminRole} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioById } = require('../helpers/db-validators');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, obtenerUsuario } = require('../controllers/usuarios');



const router = Router();

router.get('/', usuariosGet);

router.get('/:id',[
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
] ,obtenerUsuario);

router.post('/', [
    check('nombre', 'el nombre no es válido').not().isEmpty(),
    check('apellido', 'el apellido no es válido').not().isEmpty(),
    check('password', 'el password debe ser de más de 6 letras').isLength({ min: 6 }),
    check('correo', 'el correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    //check('rol', 'ROl no es válido').isIn( [ 'ADMIN_ROLE', 'USER_ROLE' ] ),
    check('rol').custom( esRoleValido), // esRoleValido recibe el primer valor del custom, osea; ROL
    validarCampos
], usuariosPost);


router.put('/:id', [
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioById ),
    check('rol').custom( esRoleValido),
    validarCampos
], usuariosPut);


router.delete('/:id',[
    validarJWT,
   // AdminRole,
   tieneRole( 'ADMIN_ROLE', 'USER_ROLE', 'GUARDIA_ROLE', 'SUPERVISOR_ROLE' ),
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioById ), 
    validarCampos
], usuariosDelete);




module.exports = router;