const { request, response } = require('express');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'NO hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //buscar el usuario en modelo bd
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            })
        }

        //Verificar estado de uid
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario, estado false'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'TOKEN No Valido!!!'
        })
    }
}



module.exports = {
    validarJWT
}