
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos} = require('../middlewares');

const { eliminarRegion, crearRegion, addCiudad } = require('../controllers/region');


const router = Router();

/**
 * {{url}}/api/region
 */



//crear una region -privado- con token valido con supervisor
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearRegion);

//agregar ciudad a region -privado- con token valido
router.put('/:id', [
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    check('ciudad', 'La ciudad es obligatorio').not().isEmpty(),
    validarCampos
], addCiudad);


//borrar una region -privado- Admin
router.delete('/:id',[
    check('id', 'NO es un id mongo válido!!!').isMongoId(),
    validarCampos,
], eliminarRegion);


module.exports = router;