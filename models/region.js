const { Schema, model } = require('mongoose');

const RegionSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
});


module.exports = model('Region', RegionSchema);