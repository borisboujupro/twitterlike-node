const passport = require('passport')

exports.signinForm = (req,res,next) => {
    res.render('auth/auth-form', { errors : null, isAuthenticated : req.isAuthenticated() , currentUser : req.user })
}

exports.signin = (req,res,next) => {
    passport.authenticate('local', (err,user,infos) => {        
        if(err) {
            next(err)
        } else if (user) {
            req.login(user, (err) => {
                if(err) {next(err)}    
                res.redirect('/tweets')
            })
        } else {  
            if(req.body && !req.body.email)  
            {
                infos.email = { 
                    message : "You must provide credentials in order to sign in"
                }
            }
            res.render('auth/auth-form',{
                errors : infos,
                isAuthenticated : req.isAuthenticated() , currentUser : req.user
            })
        }
    })(req,res,next)
}

exports.signout = (req,res,next) => {
    req.logout()
    res.redirect('/auth/signin/form')
}