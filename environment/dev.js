const path = require('path')

module.exports = {
    dbUrl : 'mongodb+srv://admin:admin@cluster0-zptsp.gcp.mongodb.net/twitter?retryWrites=true&w=majority',
    cert : path.join(__dirname, '../ssl/local.crt'),
    key : path.join(__dirname, '../ssl/local.key'),
    httpPort : 3000,
    httpsPort : 3001
}