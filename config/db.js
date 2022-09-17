require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
    // Database Connection 
    // const dbURI; 

    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, });

    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log('Database connected.');
    }).on('error', (err) => {
        console.log('Connection failed ', err);
    })

}

module.exports = connectDB;