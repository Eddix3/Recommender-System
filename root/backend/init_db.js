const {connect/*, connection*/} = require('mongoose');

module.exports = () => {
    const uri = process.env.DB_URI
    connect(uri, {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => {
        console.log('Connection established with MongoDB');
    }).catch(error => console.error(error));
}
