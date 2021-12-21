
const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({
    nombre: {
        type: String,
        //require: [true, 'El Nombre es obligatorio'],
        //unique: true
    },
    empresa: {
        type: String,
    },
    rut: {
        type: String,
        require: [true, 'El RUT es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    celular: {
        type: Number,
        require: [true, 'El celular es obligatorio']
    },
    correo: {
        type: String,
        // required: [true, 'El correo es obligatorio'],
    },
    fecha: {
        type: Date,
        // required: [true, 'El correo es obligatorio'],
    },
    img: {
        type: String,
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
    nivel: {
        type: Number,
        default: 3
    }

});

//metodo sobrescrito 
ClienteSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model('Cliente', ClienteSchema);