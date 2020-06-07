const express = require('express')
const path = require('path')
const morgan = require('morgan')
const ejsLayouts = require('express-ejs-layouts')
const errorHandler = require('errorhandler')

const index = require('./routes')
require('./database')

const app = express()

app.set('views', path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(ejsLayouts)

app.use(morgan('combined'))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(require('./config/session.config'))
const { passportMW , sessionPassportMW} = require('./config/passport.config')
app.use(passportMW)
app.use(sessionPassportMW)

app.use(index)



if('DEV' === process.env.NODE_ENV){
    app.use(errorHandler())
}else{
    app.use((err,req,res,next) => {
        const code = (err.code || 500)
        res.status(code).json({
            code : code,
            message : `Une erreur est survenue, veuillez contacter le webmaster 
            admin@test.com avec le code d'erreur suivant 
            \n` + (500 === code)? `` : `err.message`
        })
    })
}

module.exports = app
