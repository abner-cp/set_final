const { Schema, model } = require('mongoose');

const TurneroSchema = Schema({
    guardia: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
    },
    turno: {
        type: Schema.Types.ObjectId,
        ref: 'Turno', 
    },
    inicio:{
        type: Date
    },
    observacion: [{
        type: [String],
        default: [],
    }],
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    estado: {
        type: Boolean,
        default: true //solo disponible en true, de lo contrario el turno ya se efectuó
    },
    encurso: {
        type: Boolean,
        default: false //cuando está en true, significa "Turno en Curso"!
    },
});

TurneroSchema.method('toJSON', function() {
    const { __v, _id, ...Object } = this.toObject();
    Object.id = _id;
    return Object;
})


module.exports = model('Turnero', TurneroSchema);