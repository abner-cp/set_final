const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    title: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
    },
    turno: {
        type: Schema.Types.ObjectId,
        ref: 'Turno',
    },
    date:{
        type: Date
    },
    start: {
        type: String,
        default: Date.now,
    },
    end: {
        type: String,
    },
    observacion: [{
        type: [String],
        default: [],
    }],
    imagenes: [{
        type: [String],
        default: [],
    }],
    usuarioIn: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',   
    },
    usuarioOut: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
    },
    estado: {
        type: Boolean,
        default: true
    },
});

ServicioSchema.method('toJSON', function() {
    const { __v, _id, ...Object } = this.toObject();
    Object.id = _id;
    return Object;
})


module.exports = model('Servicio', ServicioSchema);