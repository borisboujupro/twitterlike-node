const path = require('path')

module.exports = {
    dbUrl : 'mongodb+srv://admin:admin@cluster0-zptsp.gcp.mongodb.net/twitter?retryWrites=true&w=majority',
    cert : path.join(__dirname, ''),
    key : path.join(__dirname, ''),
    httpPort : 80,
    httpsPort : 443
}