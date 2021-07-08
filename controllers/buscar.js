
const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Usuario, Turno, Team } = require('../models');
const usuario = require('../models/usuario');
const { usuariosDelete } = require('./usuarios');

const coleccionesPermitidas = [
    'usuarios',
    'turnos',
    'roles',
    'teams',
    'clientes'
];


const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        //total: usuario.length,
        results: usuarios
    });
}


const buscarTurnos = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const turno = await Turno.findById(termino);
        return res.json({
            results: (turno) ? [turno] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const turnos = await Turno.find({ nombre: regex, estado: true });

    res.json({
        //total: usuario.length,
        results: turnos
    });
}


const buscarTeams = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const team = await Team.findById(termino); //incoporar populate con cliente
        return res.json({
            results: (team) ? [team]: []
        })
    }

    const regex = new RegExp(termino, 'i');
    const teams = await Team.find({ nombre: regex, estado: true }); //incorporar populate con cliente

    res.json({
        //total: usuario.length,
        results: teams
    });

}
const buscarClientes = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const team = await Team.findById(termino); //incoporar populate con cliente
        return res.json({
            results: (team) ? [team]: []
        })
    }

    const regex = new RegExp(termino, 'i');
    const teams = await Team.find({ nombre: regex, estado: true }); //incorporar populate con cliente

    res.json({
        //total: usuario.length,
        results: teams
    });
}




const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {

        return res.status(400).json({
            msg: `las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        case 'turnos':
            buscarTurnos(termino, res);
            break;

        case 'teams':
            buscarTeams(termino, res);
            break;

        case 'clientes':
            buscarClientes(termino, res);
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