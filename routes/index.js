const router = require('express').Router()
const tweets = require('./tweets.route')
const users = require('./users.route')
const auth = require('./auth.route')
const { ensureAuthenticated } = require('../config/guards.config')


router.use('/tweets',ensureAuthenticated,tweets)
router.use('/users',users)
router.use('/auth',auth)

router.use('/',(req,res,next) => {
    res.redirect('/tweets')
})

module.exports = router