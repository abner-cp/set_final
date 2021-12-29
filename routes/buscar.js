
const { Router }= require('express');
const { buscar } = require('../controllers/buscar');
const { validarJWT, AdminRole, Admin_super_Role } = require('../middlewares/index');

const router = Router();

router.get('/:coleccion/:termino', [
    validarJWT,
    Admin_super_Role,
], buscar)



module.exports = router;