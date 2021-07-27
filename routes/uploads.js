const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarArchivo } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'clientes'])),
    validarCampos
], actualizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'clientes'])),
    validarCampos
], mostrarImagen)




module.exports= router;