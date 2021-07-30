const { Schema, model } = require('mongoose');

const RegionSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    ciudades: [ {
        type: String,
       // require: true
    }],
    estado: {
        type: Boolean,
        default: true
    },
});


module.exports = model('Region', RegionSchema);