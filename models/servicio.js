const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    titulo: {
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
    inicio: {
        type: Date,
        default: Date.now,
    },
    termino: {
        type: Date,
    },
    evento: [{
        type: [String],
        default: [],
    }],
    imagenes: [{
        type: [String],
        default: [],
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
});

ServicioSchema.method('toJSON', function() {
    const { __v, _id, ...Object } = this.toObject();
    Object.id = _id;
    return Object;
})


module.exports = model('Servicio', ServicioSchema);