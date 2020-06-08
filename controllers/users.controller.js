const { createUserLocal,findUserPerUsername, findUserPerId, findUserPerEmail,
     searchUserPerUsername, removeUserIdOfCurrentFollowing,addUserIdToCurrentFollowing } = require('../database/models/user.model')
const { getTweetsForUser } = require('../database/models/tweet.model')
const path = require('path')
const multer = require('multer')
const upload = multer({
    storage : multer.diskStorage({
        destination : (req,file,cb) => {
            cb(null, path.join(__dirname,'../public/images/avatars'))
        },
        filename : (req,file,cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

const { v4: uuidv4 } = require('uuid');
const emailFactory = require('../email')

exports.signup = async (req,res,next) => {
    try{
        const {email , password, username } = req.body
        const user = await createUserLocal(email,password,username)
        req.login(user, (err) => {
            if(err) {next(err)}    
            res.redirect('/tweets')
        })
        emailFactory.sendEmailVerification({
            to : user.local.email,
            host : req.headers.host,
            username : user.username,
            userId : user._id,
            emailToken : user.local.emailToken
        }).catch( err => {console.log(err)})
        res.redirect('/tweets')
    } catch(e) {
        Object.keys(e.errors).forEach((value) => {console.log(value,e.errors[value].message)})
        res.status(400).render('users/user-form',{ user : req.body , errors : e.errors, isAuthenticated : req.isAuthenticated() })
    }
}

exports.signupForm = (req,res,next) => {
    res.render('users/user-form', { user : {} , errors : {} , isAuthenticated : req.isAuthenticated()})
}

exports.uploadImage = [
        upload.single('avatar'),
        async (req,res,next) => {
            try{
                const user = req.user
                user.avatar = '/images/avatars/'+req.file.filename
                await user.save()
                res.redirect('/tweets')
            }catch(e){
                next(e)
            }
        }
    ]

exports.userProfile = async (req,res,next) => {
    try {
        const username = req.params.username
        const user = await findUserPerUsername(username)
        const tweetsList = await getTweetsForUser(user)
        res.render('tweets/tweet',{
            tweetsList,
            isAuthenticated : req.isAuthenticated() ,
            currentUser : req.user,
            user : user
        })
    }catch(e){
        next(e)
    }
}

exports.userList = async (req,res,next) => {
    try {
        const searchKey = req.query.search
        const users = await searchUserPerUsername(searchKey)
        // Tweak to use partials with layout and EJS
        res.render('none', { layout : 'users/user-search-list', users}) 
    }catch(e){
        next(e)
    }
}

exports.followUser = async (req,res,next) => {
    try{
        const userId = req.params.userId
        const currentUser = req.user
        await addUserIdToCurrentFollowing(userId,currentUser)
        res.redirect(req.get('referer'))
    }catch(e){
        next(e)
    }
}

exports.unfollowUser = async (req,res,next) => {
    try{
        const userId = req.params.userId
        const currentUser = req.user
        await removeUserIdOfCurrentFollowing(userId,currentUser)
        res.redirect(req.get('referer'))
    }catch(e){
        next(e)
    }
}

exports.verifyEmailLink = async (req,res,next) => {
    try {
        const {userId , emailToken} = req.params
        const user =  await findUserPerId(userId)
        if(user && emailToken && emailToken === user.local.emailToken){
            user.local.emailVerified = true
            user.save() 
            res.redirect('/tweets')
        }else{
            res.status(400).json("Email Verification Error")
        }
    } catch (error) {
        next(error)
    }
}


exports.initForgotPassword = async (req,res,next) => {
    try{
        const { email } = req.body
        const user = await findUserPerEmail(email)
        if(user){
            user.local.passwordToken = uuidv4()
            let dateExpiration = new Date()
            dateExpiration.setMinutes(dateExpiration.getMinutes() + 2)
            user.local.passwordTokenExpiration = dateExpiration
            await user.save()
            emailFactory.sendEmailPasswordReset({
                to : user.local.email,
                host : req.headers.host,
                username : user.username,
                userId : user._id,
                passwordToken : user.local.passwordToken
            }).catch( err => {console.log(err)})
            res.status(200).json({
                email : email
            })
        }else{
            res.status(400).json("Utilisateur inconnu");
        }        
    } catch(e) {
        next(e)
    }
}

exports.verifyPasswordLink = async (req,res,next)  => {
    try{
        const { userId, passwordToken } = req.params
        const user = await findUserPerId(userId)
        if(user){
            if(user.local.passwordToken === passwordToken){
                
                if(new Date() < user.local.passwordTokenExpiration){
                    res.render('auth/auth-reset-password',{
                        url : `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
                        isAuthenticated : false,
                        errors : null
                    })
                }else{
                    return res.status(400).json("Le lien de réinitialisation a expiré, veuillez recommencer la procédure");
                }
            }else{
                return res.status(400).json("L'utilisateur n'existe pas");
            }
        }else{
            return res.status(400).json("L'utilisateur n'existe pas");
        }
        
    }catch(e){
        next(e)
    }
}

exports.resetPassword = async (req,res,next) => {
    try{
        const { userId, passwordToken } = req.params
        const { password } = req.body
        const user = await findUserPerId(userId)
        const result = {}
        if(user && password){
            if(user.local.passwordToken === passwordToken){
                if(new Date() < user.local.passwordTokenExpiration){
                    user.local.password = await user.hashPassword(password)
                    user.local.passwordTokenExpiration = null
                    user.local.passwordToken = null
                    await user.save()
                    res.redirect('/tweets')
                }else{
                    result.password = {
                        message :  "Le lien de réinitialisation a expiré, veuillez recommencer la procédure"
                    }
                    res.render('auth/auth-reset-password',{
                        url : `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
                        isAuthenticated : false,
                        errors : result
                    })
                    
                }
            }else{
                
                result.password = {
                    message :  "L'utilisateur n'a pas pu être vérifié, veuillez recommencer la procédure"
                }
                res.render('auth/auth-reset-password',{
                    url : `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
                    isAuthenticated : false,
                    errors : result
                })
            }
        }else{            
            if(!password)
                result.password = {
                    message :  "Veuillez renseigner un mot de passe"
                }
            else
                result.password = {
                    message :  "L'utilisateur n'existe pas, veuillez recommencer la procédure"
                }
            res.render('auth/auth-reset-password',{
                url : `https://${req.headers.host}/users/reset-password/${user._id}/${user.local.passwordToken}`,
                isAuthenticated : false,
                errors : result
            })
        }
                
    }catch(e){
        next(e)
    }
}