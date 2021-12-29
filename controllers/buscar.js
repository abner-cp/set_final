
const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Usuario, Turnero, Team, Role, Cliente } = require('../models');
const { $where } = require('../models/usuario');
const usuario = require('../models/usuario');
const { turnos } = require('./turneros');


const coleccionesPermitidas = [
    'usuarios',
    'turnos',
    'roles',
    'teams',
    'teams2',
    'clientes',
    'clientes2',
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


const buscarTurnos = async (termino = '',req, res = response) => {
    const esMongoID = isValidObjectId(termino);
    const {desde, hasta} = req.body;
    if(desde != '' & hasta != ''){
        console.log('esto es por fechas');
        const turnosBD = await Turnero.find().where({ inicio: {$gte: new Date(desde), $lte: new Date(hasta)}})
        .where({ guardia: termino })
        .populate('guardia')
        .populate('turno')
        .populate('usuario', 'nombre')
        .populate('cliente', 'nombre')
        .populate('team', 'nombre');
    
        return res.status(400).json({
            total: turnosBD.length,
            results: (turnosBD) ? [turnosBD] : []
        });
    }

    if (esMongoID) {
        const guardiaBD = await Usuario.findById(termino);
        if (guardiaBD) {
            console.log('esto es sin fechas');
            const turnosBD = await Turnero.find().where({ estado: true })
                .where({ guardia: termino })
                .populate('guardia')
                .populate('turno')
                .populate('usuario', 'nombre')
                .populate('cliente', 'nombre')
                .populate('team', 'nombre');
            if (!turnosBD) {
                return res.status(400).json({
                    msg: `no hay coincidencias`
                });
            }
            return res.json({
                total: turnosBD.length,
                results: (turnosBD) ? [turnosBD] : []
            })
        }
        else {
            // const teamBD = await Team.findById(termino);
            const turnosBD = await Turnero.find().where({ estado: true })
                .where({ team: termino })
                .populate('guardia')
                .populate('turno')
                .populate('usuario', 'nombre')
                .populate('cliente', 'nombre')
                .populate('team', 'nombre');
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
        msg: `proporcione un termino válido`
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

//busca teams por id de supervisor
const buscarTeams2 = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const supervisor = await Team.find({ supervisor: termino, estado: true });
        if (supervisor) {
            const total = supervisor.length;
            return res.json({
                total,
                results: (supervisor) ? [supervisor] : []
            })
        }
        return res.status(400).json({
            msg: `no hay registros`
        });

    }
    return res.status(400).json({
        msg: `ID invalida`
    });
}

//busca clientes por id de teams
const buscarClientes2 = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const team = await Team.findById(termino);
        if (team) {
            const clientes = team.clientes;
            const total = clientes.length;
            return res.json({
                total,
                results: (clientes) ? [clientes] : []
            })
        }
        return res.status(400).json({
            msg: `no hay registros`
        });

    }
    return res.status(400).json({
        msg: `ID invalida`
    });

   /* const userMessage = await Team.aggregate(
        [
            {
                $loolup:
                {
                    from: 'clientes',
                    localField: 'clientes',
                    foreignField: '_id',
                    as: 'userMessage'
                }
            },
            {$unwind: "$userMessage"},
            { $match: { _id: ObjectId (termino) } },

            {
                $project:
                {
                    name: '$userMessage.nombre',
                    segundoNombre: '$userMessage.empresa',
                }
            },
        ]
    )
    userMessage.map(() => { })
    return userMessage;*/
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
            buscarTurnos(termino, req, res);
            break;

        case 'teams':
            buscarTeams(termino, res);
            break;

        case 'teams2':
            buscarTeams2(termino, res);
            break;

        case 'clientes':
            buscarClientes(termino, res);
            break;
        case 'clientes2':
            buscarClientes2(termino, res);
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