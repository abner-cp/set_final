const { Schema, model } = require('mongoose');

const TurneroSchema = Schema({
    guardia: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
    },
    inicio:{
        type: Date
    },
    final:{
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
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    estado: {
        type: Boolean,
        default: true
    },
});

TurneroSchema.method('toJSON', function() {
    const { __v, _id, ...Object } = this.toObject();
    Object.id = _id;
    return Object;
})


module.exports = model('Turnero', TurneroSchema);