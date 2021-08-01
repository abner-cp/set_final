const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT,
     validarCampos,
      tieneRole,
       AdminRole} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioById, existeClienteById } = require('../helpers/db-validators');


const {  crearServicio, obtenerServicio, obtenerServicios, actualizarServicio, eliminarServicio } = require('../controllers/servicios');



const router = Router();

router.get('/', obtenerServicios);

router.get('/:id',[
    check('id', 'NO es un ID válido').isMongoId(),
    //check('id').custom(existeUsuarioById),
    validarCampos
] ,obtenerServicio);

router.post('/', [
    validarJWT,
    AdminRole,
    check('titulo', 'el titulo no es válido').not().isEmpty(),
    check('turno', 'debe ingresar un turno').not().isEmpty(),
    check('turno', 'NO es un ID válido').isMongoId(),
    validarCampos
], crearServicio);


router.put('/:id', [
    validarJWT,
    AdminRole,
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom( existeClienteById ),
    validarCampos
], actualizarServicio);


router.delete('/:id',[
    validarJWT,
     AdminRole,
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom( existeClienteById ), 
    validarCampos
], eliminarServicio);







module.exports = router;