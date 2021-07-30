const { Schema, model } = require('mongoose');

const CiudadSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
});


module.exports = model('Ciudad', CiudadSchema);