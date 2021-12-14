
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');


const { dbConnetion } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar', //por roles, usuarios, teams, turnos
            clientes: '/api/clientes',
            teams: '/api/teams',
            turnos: '/api/turnos',
            turneros: '/api/turneros',
            usuarios: '/api/usuarios',
            servicios: '/api/servicios',
            regiones: '/api/regiones',
            //ciudades: '/api/ciudades',
            uploads: '/api/uploads',
            reportes: '/api/reportes',
        }


        //conectar a BD
        this.conectarDB();


        //middlewares
        this.middlewares();

        //rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnetion();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //lectura y parseo body
        this.app.use(express.json());


        //directorio publico
        this.app.use(express.static('public'));

        //Fileupload - Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true //para crear directorios
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar')); //por roles, usuarios, teams, turnos
        this.app.use(this.paths.clientes, require('../routes/clientes'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.teams, require('../routes/teams'));
        this.app.use(this.paths.turnos, require('../routes/turnos'));
        this.app.use(this.paths.turneros, require('../routes/turneros'));
        this.app.use(this.paths.servicios, require('../routes/servicios'));
        this.app.use(this.paths.regiones, require('../routes/region'));
       // this.app.use(this.paths.ciudades, require('../routes/ciudad'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.reportes, require('../routes/reportes'));
    }


    listen() {
        this.app.listen(this.PORT, () => {
            console.log('Servidor corriendo en puerto= ', this.PORT);
        });
    }

}

module.exports = Server;