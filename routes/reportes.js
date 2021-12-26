const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerReporte, obtenerReportes, crearReporte, totales } = require('../controllers/reportes');


const { validarCampos, validarArchivo } = require('../middlewares');



const router = Router();

router.post('/', crearReporte);

router.post('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    validarCampos
], crearReporte)

router.get('', [
   // check('id', 'El ID debe ser de Mongo').isMongoId(),
    //validarCampos
], obtenerReportes)

router.get('/:coleccion/:termino', [
    //check('id', 'El ID debe ser de Mongo').isMongoId(),
   // validarCampos
], totales)




module.exports= router;