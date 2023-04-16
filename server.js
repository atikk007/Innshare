require('dotenv').config();
const express = require('express');
const app = express();
// const apiRoutes = require('./routes/files')
const path = require('path');
const PORT = process.env.PORT || 10000 || 3000;

const cors = require('cors')
// Cors

const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS
}

app.use(cors(corsOptions));
app.use(express.static('public'));

const connectDB = require('./config/db')
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.render('index', { title: "file sharing made easy" });
});

app.get('', (req, res) => {
    res.redirect('/');
});

//Template Engine 
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
// Routes 

app.use('/api/files', require('./routes/files'));
app.use('/api/files/', require('./routes/api'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});