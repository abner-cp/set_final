const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerTurneros, obtenerTurnero, crearTurnero, actualizarTurnero, eliminarTurnero } = require('../controllers/turneros');

const { validarCampos, validarJWT, AdminRole, validarGuardiaTeams} = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/turnero
 */



//obtener todos los turneros - publico
router.get('/', obtenerTurneros);


//obtener un turnero en particular por id - público
router.get('/:id', [
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    //check('id').custom(existeTeamById),
    validarCampos
], obtenerTurnero);


//crear un turnero -privado- con token valido con supervisor
router.post('/', [
    validarJWT,
    //AdminRole,
    check('guardia', 'El guardia es obligatorio').not().isEmpty(),
    check('guardia', 'NO es un id mongo válido!!!').isMongoId(),
    check('inicio', 'El inicio es obligatorio').not().isEmpty(),
    check('final', 'El final es obligatorio').not().isEmpty(),
    check('cliente', 'El cliente es obligatorio').not().isEmpty(),
    validarCampos
], crearTurnero);

//actualizar un team -privado- con token valido
router.put('/:id', [
    validarJWT,
    //AdminRole,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    //check('id').custom(existeTeamById),
    validarCampos
], actualizarTurnero);


//borrar un turnero -privado- Admin
router.delete('/:id',[
    validarJWT,
    //AdminRole,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    //check('id').custom(existeTeamById),
    validarCampos,
], eliminarTurnero);


module.exports = router;