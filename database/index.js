const mongoose = require('mongoose')
const env = require('../environment/'+process.env.NODE_ENV)

module.exports = mongoose.connect(env.dbUrl, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then(() => {
    console.log("Connection Mongo OK ! ")
}).catch( (err) => {
    console.log("Error Connecting to server", err)
})


