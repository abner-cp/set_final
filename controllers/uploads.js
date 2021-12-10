
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Cliente } = require("../models");


const cargarArchivo = async (req, res = response) => {

    try {
        // const pathCompleto= await  subirArchivo(req.files, ['txt', 'md'], 'textos');  //archivo, formato, carpeta
        const pathCompleto = await subirArchivo(req.files, undefined, 'imgs');  //archivo, formato, carpeta
        res.json({
            nombre: pathCompleto
        })

    } catch (msg) {
        res.status(400).json({ msg });
    }

}


//localhost
const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con ese ID: ${id}`
                });
            }
            break;
        case 'clientes':
            modelo = await Cliente.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un cliente con ese ID: ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto!' });
    }

    //limpiar imágenes previas
    if (modelo.img) {
        // borrar la img del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const pathCompleto = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = pathCompleto;
    await modelo.save();

    res.json(modelo);
}


//servicio cloudinary 
/* const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con ese ID: ${id}`
                });
            }
            break;
        case 'clientes':
            modelo = await Cliente.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un cliente con ese ID: ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto!' });
    }

    //limpiar imágenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
}*/



//recibe colección y id para mostrar img
const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con ese ID: ${id}`
                });
            }
            break;
        case 'clientes':
            modelo = await Cliente.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un cliente con ese ID: ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto!' });
    }

    //limpiar imágenes previas
    if (modelo.img) {
        // borrar la img del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);
}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    //actualizarImagenCloudinary
}