
const { Router } = require('express');
const { check } = require('express-validator');
const { crearTurno,
    obtenerTurnos,
    obtenerTurno,
    actualizarTurno,
    eliminarTurno } = require('../controllers/turnos');
const { existeTurnoById } = require('../helpers/db-validators');

const { validarCampos, validarJWT, AdminRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/turnos
 */



//obtener todos los turnos - publico
router.get('/', obtenerTurnos);


//obtener un turno en particular por id - público
router.get('/:id', [
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    check('id').custom(existeTurnoById),
    validarCampos
], obtenerTurno);


//crear un turno -privado- con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('ingreso', 'El ingreso es obligatorio').not().isEmpty(),
    check('salida', 'La salida es obligatorio').not().isEmpty(),
    check('horas', 'Las horas/duración es obligatorio').not().isEmpty(),
    check('colacion', 'La colacion es obligatorio').not().isEmpty(),
    validarCampos
], crearTurno);

//actualizar un turno -privado- con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeTurnoById),
    validarCampos
], actualizarTurno);

//borrar un turno -privado- Admin
router.delete('/:id',[
    validarJWT,
    AdminRole,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    check('id').custom(existeTurnoById),
    validarCampos,
], eliminarTurno);


module.exports = router;