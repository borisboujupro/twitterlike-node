const { createUserLocal,findUserPerUsername,searchUserPerUsername, removeUserIdOfCurrentFollowing,addUserIdToCurrentFollowing} = require('../database/models/user.model')
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

exports.signup = async (req,res,next) => {
    try{
        const {email , password, username } = req.body
        const user = await createUserLocal(email,password,username)
        req.login(user, (err) => {
            if(err) {next(err)}    
            res.redirect('/tweets')
        })
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
        console.log("là <-----------------------------------------")
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