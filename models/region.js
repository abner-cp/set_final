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

RegionSchema.method('toJSON', function() {
    const { __v, _id, ...Object } = this.toObject();
    Object.id = _id;
    return Object;
})

module.exports = model('Region', RegionSchema);