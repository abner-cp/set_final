const { response } = require("express");


//validar que venga el archivo desde el front
const validarArchivo = (req, res= response, next) =>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: 'No hay archivos para subir - validarArchivo' });
    }
    next();
}



module.exports= {
    validarArchivo
}