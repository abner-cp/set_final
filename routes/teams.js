
const { Router } = require('express');
const { check } = require('express-validator');
const { crearTeam,
    obtenerTeams,
    obtenerTeam,
    actualizarTeam,
    eliminarTeam } = require('../controllers/teams');
const { existeTeamById, existeUsuarioById } = require('../helpers/db-validators');

const { validarCampos, validarJWT, AdminRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/teams
 */



//obtener todos los teams - publico
router.get('/', obtenerTeams);


//obtener un team en particular por id - público
router.get('/:id', [
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    check('id').custom(existeTeamById),
    validarCampos
], obtenerTeam);


//crear un team -privado- con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearTeam);

//actualizar un team -privado- con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    check('id').custom(existeTeamById),
    validarCampos
], actualizarTeam);

//borrar un team -privado- Admin
router.delete('/:id',[
    validarJWT,
    AdminRole,
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    check('id').custom(existeTeamById),
    validarCampos,
], eliminarTeam);


module.exports = router;