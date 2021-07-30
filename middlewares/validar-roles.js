const { response } = require("express")


const AdminRole = (req, res = response, next) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se intenta verificar rol, sin pasar por validación de token'
        });
    }
    const { rol, nombre } =req.usuario;

    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${nombre} no es Administrador- No está autorizado para esto`
        });
    }

    next();
}



const tieneRole = ( ...roles ) => {
    return (req, res= response, next) => {

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere verificar rol, sin validar token'
            });
        }
        if ( !roles.includes( req.usuario.rol ) ){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        next();
    }
}


module.exports = {
    AdminRole, 
    tieneRole,
 
}