const mongoose = require('mongoose');
const config = require('../../config');

module.exports = async () => {
    await mongoose
        .connect(config.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then(() => console.log('Connected to the database.'));
};