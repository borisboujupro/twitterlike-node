const router = require('express').Router()
const { signup, signupForm,uploadImage ,userProfile,userList,
     followUser , unfollowUser ,verifyEmailLink,
     initForgotPassword, verifyPasswordLink, resetPassword } = require('../controllers/users.controller')
const { ensureAuthenticated } = require('../config/guards.config')

router.get('/signup/form', signupForm)

router.post('/signup',signup)

router.post('/update/image',ensureAuthenticated,uploadImage)

router.get('/unfollow/:userId',unfollowUser)

router.get('/follow/:userId',followUser)

router.get('/email-verify/:userId/:emailToken',verifyEmailLink)

router.get('/search',userList)

router.get('/:username',ensureAuthenticated,userProfile)

router.post('/forgot-password',initForgotPassword)

router.get('/reset-password/:userId/:passwordToken',verifyPasswordLink)

router.post('/reset-password/:userId/:passwordToken',resetPassword)

module.exports = router