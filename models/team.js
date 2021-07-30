
const { Schema, model } = require('mongoose');

const TeamSchema = Schema({
    nombre: {
        type: String,
        //require: [true, 'El Nombre es obligatorio'],
        //unique: true
    },
    color: {
        type: String,
        default: "red"
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario:  {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    guardias: [ {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    }],
    supervisor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

//metodo sobrescrito 
TeamSchema.methods.toJSON = function() {
    const { __v, estado, ...data} = this.toObject(); 
    return data;
}


module.exports= model('Team', TeamSchema);