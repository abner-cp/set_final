
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        require: [true, 'El rol es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },

});


module.exports= model('Role', RoleSchema);