
const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Usuario, Turno, Team } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'turnos',
    'roles',
    'teams',
    'clientes'
];


const buscarUsuarios = async (termino='', res= response)=> {
    const esMongoID = isValidObjectId(termino);
    if( esMongoID){
        const usuario = await Usuario.findById(termino);
        res.json({
            results: (usuario) ? [ usuario ] : []
        })
    }
}


const buscar = (req, res= response) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){

            return res.status(400).json({
                msg: `las colecciones permitidas son: ${ coleccionesPermitidas }`
            })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            
            break;
        case 'turnos':
            
            break;
        case 'teams':
            
            break;
        case 'clientes':
            
            break;
    
        default:
            res.status(500).json({
                msg: 'busqueda incompleta!!!'
            })
    }


}

module.exports = {
    buscar
}