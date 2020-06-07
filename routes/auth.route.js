const router = require('express').Router();
const {signin, signinForm, signout} = require('../controllers/auth.controller')

router.get('/signin/form',signinForm)
router.post('/signin',signin)
router.use('/signout',signout)

module.exports = router