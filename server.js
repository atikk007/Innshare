const express = require('express');
const app = express();
const apiRoutes = require('./routes/files')

const PORT = process.env.PORT || 3000;

const connectDB = require('./config/db')
connectDB();

// Routes 

app.use('/api/files', apiRoutes)
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});