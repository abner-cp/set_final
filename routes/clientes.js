const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT,
     validarCampos,
      tieneRole,
       AdminRole} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioById, existeCliente, existeClienteById } = require('../helpers/db-validators');

const {  crearCliente, obtenerCliente, obtenerClientes, actualizarCliente, eliminarCliente} = require('../controllers/clientes');



const router = Router();

router.get('/', obtenerClientes);

router.get('/:id',[
    check('id', 'NO es un ID válido').isMongoId(),
    //check('id').custom(existeUsuarioById),
    validarCampos
] ,obtenerCliente);

router.post('/', [
    validarJWT,
    AdminRole,
    check('nombre', 'el nombre no es válido').not().isEmpty(),
    check('rut', 'el rut no es válido').not().isEmpty(),
    check('celular', 'el celular no es válido').not().isEmpty(),
    check('correo', 'el correo no es válido').isEmail(),
    check('direccion', 'ingrese una direccion').not().isEmpty(),
    check('region', 'ingrese región').not().isEmpty(),
    check('ciudad', 'ingrese ciudad').not().isEmpty(),
    check('empresa', 'ingrese un empresa o consorcio').not().isEmpty(),
    check('nivel', 'ingrese el nivel del cliente').not().isEmpty(),
    validarCampos
], crearCliente);


router.put('/:id', [
    validarJWT,
    AdminRole,
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom( existeClienteById ),
    validarCampos
], actualizarCliente);


router.delete('/:id',[
    validarJWT,
     AdminRole,
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom( existeClienteById ), 
    validarCampos
], eliminarCliente);







module.exports = router;