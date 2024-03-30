// add .env to process
require('dotenv').config({path: require('path').resolve(__dirname, 'config/.env')})

const express = require('express');
const app = express();

require('./init_db')();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// recommendations-route
const yelpRoute = require('./api/routes');
app.use('/recommendations', yelpRoute);

// batch route
const batchRoute = require('./api/batch')
app.use('/batch', batchRoute)

app.get('/', (req, res) => {
    res.json({message: 'we are on home'});
});

// start listening to the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
