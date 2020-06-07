const passport = require('passport')
const LocalStrategy =  require('passport-local').Strategy
const { findUserPerEmail,findUserPerId } = require('../database/models/user.model')

exports.passportMW = passport.initialize()
exports.sessionPassportMW = passport.session()


passport.serializeUser((user,done) => {
    done(null,user._id)
})

passport.deserializeUser( async (userId,done) => {
    try{
        const user = await findUserPerId(userId)
        if(user)
            done(null,user)
        else
            done(null, false , { userId : { message : "Unknown User Id "}})
    }catch(e){
        done(e)
    }

})

passport.use('local', new LocalStrategy({
    usernameField : 'email'
}, async (email,password,done) => {
    try{
        const user = await findUserPerEmail(email)
        if(user){
            const match = await user.comparePassword(password)
            if(match){
                done(null,user)
            }else {
                done(null,false, { password : { message : "Incorrect Password"}})
            }            
        }else{
            done(null,false, { email : { message :'User not Found'}})
        }
    }catch(e){
        done(e)
    }
}))