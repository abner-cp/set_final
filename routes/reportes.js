const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerReporte, obtenerReportes, crearReporte } = require('../controllers/reportes');


const { validarCampos, validarArchivo } = require('../middlewares');



const router = Router();

router.post('/', crearReporte);

router.post('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    validarCampos
], crearReporte)


router.get('/:coleccion/:id', [
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    validarCampos
], obtenerReporte)

router.get('', [
   // check('id', 'El ID debe ser de Mongo').isMongoId(),
    //validarCampos
], obtenerReportes)

router.get('/:coleccion/:id', [
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    validarCampos
], obtenerReportes)




module.exports= router;