
const express = require('express');
const cors= require('cors');
const { dbConnetion } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

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

        //lectura y parseio body
        this.app.use( express.json() );


        //directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
       this.app.use(this.usuariosPath, require('../routes/usuarios'));
    
    }

    listen(){
        this.app.listen(this.PORT, () => {
            console.log('Servidor corriendo en puerto= ', this.PORT);
        });
    }

}

module.exports = Server;