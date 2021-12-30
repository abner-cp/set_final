const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerTurneros, obtenerTurnero, crearTurnero, actualizarTurnero, eliminarTurnero,  turnos} = require('../controllers/turneros');

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
    check('team', 'El team es obligatorio').not().isEmpty(),
    check('team', 'NO es un id mongo válido!!!').isMongoId(),
    check('guardia', 'El guardia es obligatorio').not().isEmpty(),
    check('guardia', 'NO es un id mongo válido!!!').isMongoId(),
    check('turno', 'El turno es obligatorio').not().isEmpty(),
    check('turno', 'NO es un id mongo válido!!!').isMongoId(),
    check('inicio', 'El inicio es obligatorio').not().isEmpty(),
    check('cliente', 'El cliente es obligatorio').not().isEmpty(),
    check('cliente', 'NO es un id mongo válido!!!').isMongoId(),
    validarCampos
], crearTurnero);

//actualizar un turnero -privado- con token valido
router.put('/:id', [
    validarJWT,
    //AdminRole,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    //check('id').custom(existeTeamById),
    validarCampos
], actualizarTurnero);

//iniciar un turno -privado- con token valido de guardia
router.put('/:coleccion/:id', [
    validarJWT,
    //AdminRole,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    //check('id').custom(existeTeamById),
    validarCampos
], turnos);

router.get('/:coleccion/:id', [
    validarJWT,
    //AdminRole,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    //check('id').custom(existeTeamById),
    validarCampos
], turnos);



//borrar un turnero -privado- Admin
router.delete('/:id',[
    validarJWT,
    //AdminRole,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    //check('id').custom(existeTeamById),
    validarCampos,
], eliminarTurnero);


module.exports = router;