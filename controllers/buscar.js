
const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Usuario, Turnero, Team, Role } = require('../models');
const { $where } = require('../models/usuario');
const usuario = require('../models/usuario');


const coleccionesPermitidas = [
    'usuarios',
    'turnos',
    'roles',
    'teams',
    'clientes',
    'guardias',
    'supervisor',
];


const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    if (termino != 'all') {
        //expresion regular
        const regex = new RegExp(termino, 'i');
        const usuarioss = await Usuario.find({ nombre: regex });
        if (!usuarioss) {
            return res.status(400).json({
                msg: `no hay coincidencias`
            });
        }
        return res.json({
            total: usuarioss.length,
            results: usuarioss
        });
    }
    if (termino == 'all') {
        const usuarios = await Usuario.find().where({ estado: true });
        return res.json({
            total: usuarios.length,
            results: usuarios
        });
    }
}


const buscarGuardias = async (termino = '', res = response) => {
    if (termino == 'all') {
        const guardias = await Usuario.find({
            $or: [{ rol: '60b7fbd0c86aab40dc8b5e9b' }],
            $and: [{ estado: true }]
        }).populate('team', 'nombre');
        const totalGuardias = await Usuario.countDocuments({ estado: true, rol: '60b7fbd0c86aab40dc8b5e9b' });

        return res.json({
            total: totalGuardias,
            results: guardias
        })
    }
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        const role = await Role.findById(usuario.rol);
        if (role.rol == 'GUARDIA_ROLE') {
            return res.json({
                results: usuario
            });
        }
        return res.status(400).json({
            msg: `no hay coincidencias`
        });
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }, { rol: '60b7fbd0c86aab40dc8b5e9b' }]
    });

    res.json({
        total: usuarios.length,
        results: usuarios
    });
}


const buscarSupervisor = async (termino = '', res = response) => {
    if (termino == 'all') {
        const supervisores = await Usuario.find({
            $or: [{ rol: '60b7fbeec86aab40dc8b5e9c' }],
            $and: [{ estado: true }]
        }).populate('team', 'nombre');
        const totales = await Usuario.countDocuments({ estado: true, rol: '60b7fbeec86aab40dc8b5e9c' });

        return res.json({
            total: totales,
            results: supervisores
        })
    }
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        const role = await Role.findById(usuario.rol);
        if (role.rol == 'SUPERVISOR_ROLE') {
            return res.json({
                results: (usuario) ? [usuario] : []
            })
        }
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }, { rol: '60b7fbeec86aab40dc8b5e9c' }]
    });

    res.json({
        total: usuarios.length,
        results: usuarios
    });
}


const buscarTurnos = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);

    if (esMongoID) {
        const guardiaBD = await Usuario.findById(termino);
        if (guardiaBD) {
            const turnosBD = await Turnero.find().where({ estado: true })
                .where({ guardia: termino });
            if (!turnosBD) {
                return res.status(400).json({
                    msg: `no hay coincidencias`
                });
            }
            return res.json({
                results: (turnosBD) ? [turnosBD] : []
            })
        }
        else {
            // const teamBD = await Team.findById(termino);
            const turnosBD = await Turnero.find().where({ estado: true })
                .where({ team: termino });
            if (!turnosBD)
                return res.status(400).json({
                    msg: `no hay coincidencias`
                });
            return res.json({
                results: (turnosBD) ? [turnosBD] : []
            })
        }

    }

    return res.status(400).json({
        msg: `proporciones un termino válido`
    });
}




const buscarTeams = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const team = await Team.findById(termino); //incoporar populate con cliente
        return res.json({
            results: (team) ? [team] : []
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
            results: (team) ? [team] : []
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
            results: (rol) ? [rol] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const roles = await Role.find({ rol: regex }); //incorporar populate con cliente

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
        case 'supervisor':
            buscarSupervisor(termino, res);
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