
const { Schema, model } = require('mongoose');

const TurnoSchema = Schema({
    nombre: {
        type: String,
        //require: [true, 'El Nombre es obligatorio'],
    },
    ingreso: {
        type: String,
        //require: [true, 'El Nombre es obligatorio'],
    },
    salida: {
        type: String,
        //require: [true, 'El Nombre es obligatorio'],
    },
    horas: {
        type: Number,
    },
    colacion: {
        type: String,
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
    }

});

//metodo sobrescrito 
TurnoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model('Turno', TurnoSchema);