
const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Usuario, Turno, Team, Role } = require('../models');
const usuario = require('../models/usuario');


const coleccionesPermitidas = [
    'usuarios',
    'turnos',
    'roles',
    'teams',
    'clientes',
    'guardias'
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

const buscarGuardias = async (termino = '', res = response) => {
    if(termino='all'){
        const guardias = await Usuario.find({
            $or: [{ rol: 'GUARDIA_ROLE' }],
            $and: [{ estado: true }]
        });
        const totalGuardias = await Usuario.countDocuments({estado: true, rol: 'GUARDIA_ROLE'  });
        return res.json({
            totalGuardias,
            results: guardias
        });

    }
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        if( usuario.rol.includes('GUARDIA_ROLE')){
            return res.json({
                results: (usuario) ? [usuario] : []
            })
        }
        return res.json({
            results: usuarios = await Usuario.find({rol: 'GUARDIA_ROLE'})
        })
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }, {rol: 'GUARDIA_ROLE'}]
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

const buscarRoles = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const rol = await Role.findById(termino); //incoporar populate con cliente
        return res.json({
            results: (rol) ? [rol]: []
        })
    }

    const regex = new RegExp(termino, 'i');
    const roles = await Role.find({ rol: regex}); //incorporar populate con cliente

    res.json({
        //total: usuario.length,
        results: roles
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

        case 'roles':
            buscarRoles(termino, res);
            break;

        case 'guardias':
            buscarGuardias(termino, res);
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