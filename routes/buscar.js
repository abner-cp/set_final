
const { Router }= require('express');
const { buscar } = require('../controllers/buscar');
const { validarJWT, AdminRole } = require('../middlewares');

const router = Router();

router.get('/:coleccion/:termino', [
    validarJWT,
    AdminRole,
], buscar)



module.exports = router;