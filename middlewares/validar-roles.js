const { response } = require("express");
const { Role } = require("../models");


const AdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se intenta verificar rol, sin pasar por validación de token'
        });
    }
    const { rol, nombre } = req.usuario;

    const validarRol = String(rol);

    if (validarRol !== '60b7fb45c86aab40dc8b5e99') {
        return res.status(401).json({
            msg: `${nombre} no es Administrador- No está autorizado para esto`
        });
    }

    next();
}

const Admin_super_Role = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se intenta verificar rol, sin pasar por validación de token'
        });
    }
    const { rol, nombre } = req.usuario;

    const validarRol = String(rol);

    console.log(validarRol);
    if (rol.equals('60b7fbd0c86aab40dc8b5e9b')) {
        return res.status(401).json({
            msg: `${nombre} No está autorizado para esto`
        });
    }
    next();
}




const tieneRole = (...roles) => {
    return async (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar rol, sin validar token'
            });
        }
        const rolesbd = await Role.findById(req.usuario.rol);
        if (!rolesbd) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }
        next();
    }
}


module.exports = {
    AdminRole,
    tieneRole,
    Admin_super_Role

}