const mongoose = require('mongoose');

const dbConnetion = async() => {

    try {
      await  mongoose.connect( process.env.MONGODB_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });

      console.log('base de datos conectada');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }

}



module.exports= {
    dbConnetion
}