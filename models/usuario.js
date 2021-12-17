
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        require: [true, 'El apellido es obligatorio']
    },
    rut: {
        type: String,
        require: [true, 'El rut es obligatorio']
    },
    celular: {
        type: Number,
        require: [true, 'El celular es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio'],
    },
    img: {
        type: String,
    },
    ingreso: {
        type: Date,
        default: Date.now,
    },

    direccion: {
        type: String,
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: 'Region',
        //require: true
    },
    ciudad: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        //require: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        //require: true
    },

});

//metodo sobrescrito 
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario} = this.toObject(); //se saca el __v y el password, _id, para q no se impriman
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);