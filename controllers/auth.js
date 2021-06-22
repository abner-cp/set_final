const { response } = require("express");
const Usuario = require("../models/usuario");

const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {

        //verificar email 
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/contraseña incorrecta - correo'
            });
        }

        //verificar usuario en bd
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario/contraseña incorrecta - estado: false'
            });
        }

        //verificar la contraseña
        const validarPass = bcryptjs.compareSync(password, usuario.password);
        if (!validarPass) {
            return res.status(400).json({
                msg: 'Usuario/contraseña incorrecta  -password'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({
           usuario,
           token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el Admin'
        });
    }
}


module.exports = {
    login
}