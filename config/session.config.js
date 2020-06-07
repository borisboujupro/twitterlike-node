const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

module.exports = session({
    secret: "#$<7#Nj;e%?%3OB",
    resave : false,
    saveUninitialized : false,
    cookie : {
        httpOnly : true,
        maxAge : 1000 * 60 * 30
    },
    store :  new MongoStore({
        mongooseConnection : require('mongoose').connection,
        ttl : 60 * 30 
    })
})