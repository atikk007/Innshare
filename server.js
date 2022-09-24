const express = require('express');
const app = express();
// const apiRoutes = require('./routes/files')
const path = require('path');
const cors = require('cors')

const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.json());
const connectDB = require('./config/db')
connectDB();

// Cors

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5000']
}

app.use(cors(corsOptions));

app.get('', (req, res) => {
    res.render('index', { title: "file sharing made easy" });
});

//Template Engine 
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
// Routes 

app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});