const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT,
     validarCampos,
      tieneRole,
       AdminRole} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioById, existeTeamById } = require('../helpers/db-validators');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, obtenerUsuario } = require('../controllers/usuarios');



const router = Router();

router.get('/', usuariosGet);

router.get('/:id',[
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
] ,obtenerUsuario);

router.post('/', [
    validarJWT,
    check('nombre', 'el nombre no es válido').not().isEmpty(),
    check('apellido', 'el apellido no es válido').not().isEmpty(),
    check('rut', 'el rut no es válido').not().isEmpty(),
    check('direccion', 'ingrese una direccion').not().isEmpty(),
    check('region', 'ingrese región').not().isEmpty(),
    check('ciudad', 'ingrese ciudad').not().isEmpty(),
    check('password', 'el password debe ser de más de 6 letras').isLength({ min: 6 }),
    check('correo', 'el correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    check('rol', 'ingrese rol de usuario').not().isEmpty(),
    check('rol', 'NO es un ID válido').isMongoId(),
    //check('rol', 'ROl no es válido').isIn( [ 'ADMIN_ROLE', 'USER_ROLE' ] ),
    //check('rol').custom( esRoleValido), // esRoleValido recibe el primer valor del custom, osea; ROL
    validarCampos
], usuariosPost);


router.put('/:id', [
    validarJWT,
    tieneRole( 'ADMIN_ROLE', 'USER_ROLE', 'GUARDIA_ROLE', 'SUPERVISOR_ROLE' ),
    AdminRole,
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioById ),
    //check('team', 'el team no es válido').not().isEmpty(),
    //check('team').custom( existeTeamById ),
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