const { response } = require("express");

const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { Usuario, Turnero, Role } = require("../models");


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

        //verificar estado usuario en bd
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
        const role = await Role.findById(usuario.rol);

        if (role.rol == 'GUARDIA_ROLE') {

            const turnosBD = await Turnero.find().where({ estado: true })
                .where({ guardia: usuario.id });
            if (!turnosBD) {
                return res.status(400).json({
                    msg: `no hay coincidencias`
                });
            }
            const token = await generarJWT(usuario.id);
            return res.json({
                results: (turnosBD) ? [turnosBD] : [],
                usuario,
                token
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el Admin'
        });
    }
}



const googleSigin = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //tengo q crearlo
            const data = {
                nombre,
                correo,
                password: 'xd',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        //verificar estado en BD
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el admin- Usuario bloqueado'
            });
        }

        //generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
}




module.exports = {
    login,
    googleSigin
}