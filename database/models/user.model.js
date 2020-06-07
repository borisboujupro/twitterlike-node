const mongoose = require('mongoose')
const bcryp = require('bcrypt')

const userSchema = mongoose.Schema({
    username : { type : String , required : [true , "You must provide a username"], unique : true},
    local : { 
        email : {  type : String ,  required : [true , "You must provide and email" ], unique : true},
        password : { type : String , required : [ true , "You must provide a password"] }
    },
    googleId : { type : String }, // TODO Chapitre Oauth2
    avatar : { type : String , default : "/images/defaultProfile.png"}
})

userSchema.statics.hashPassword = (password) => {
    return bcryp.hash(password,8)
}

userSchema.methods.comparePassword = function(password){
    return bcryp.compare(password,this.local.password)
}

const Users = mongoose.model('user',userSchema)

exports.Users = Users

exports.createUserLocal = async (email,password,username) => {
    try{
        const hashPassword = password?await Users.hashPassword(password):""
        return new Users({
            username : username,
            local : {
                email : email,
                password : hashPassword
            }
        }).save()
    }catch(e){
        throw e
    }
}

exports.findUserPerEmail = (email) => {
    return Users.findOne({'local.email' : email})
}

exports.findUserPerId = (userId) => {
    return Users.findById(userId)
}