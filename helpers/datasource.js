// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

// -------------------- Datasource Logic -------------------- //
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on('connected', function () {
    console.log('Conectado ao banco de dados ' + process.env.DB_URL);
    require('../models/library').createView(this.db);
});

mongoose.connection.on('error', (errorConnectingToDatabase) => {
    console.log('Erro ao conectar ao banco de dados');
    throw (errorConnectingToDatabase);
});

// --------------------- Module Exports --------------------- //
module.exports = mongoose;