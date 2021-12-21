
const { Schema, model } = require('mongoose');

const TeamSchema = Schema({
    nombre: {
        type: String,
        //require: [true, 'El Nombre es obligatorio'],
        //unique: true
    },
    nivel: {
        type: Number,
        default: 3
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    creacion: {
        type: Date,
        default: Date.now,
    },
    admin:  {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    guardias: [ {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    }],
    supervisor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    clientes: [ {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        require: true
    }]

});

//metodo sobrescrito 
TeamSchema.methods.toJSON = function() {
    const { __v, estado, ...data} = this.toObject(); 
    return data;
}


module.exports= model('Team', TeamSchema);