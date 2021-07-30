const path = require('path'); //unir las rutas
const { v4: uuidv4 } = require('uuid');


const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'PNG'], carpeta='' ) => {

    return new Promise ( ( resolve, reject ) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
    
        //validar extensión
        if (!extensionesValidas.includes(extension)) {
           return reject( `La extensión ${extension} No es permitida..., Debe ser: ${extensionesValidas}` );
        }
    
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp); //ruta carpeta
    
        archivo.mv(uploadPath, (err) => {
            if (err) {
              reject(err);
            }
    
           resolve( nombreTemp );
        });
    });

}





module.exports = {
    subirArchivo
}