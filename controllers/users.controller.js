const { createUserLocal } = require('../database/models/user.model')
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