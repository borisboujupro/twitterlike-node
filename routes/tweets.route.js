const router = require('express').Router()
const { tweetList, tweetCreate, tweetNew, tweetDelete,tweetEdit,tweetUpdate } = require('../controllers/tweets.controller')

router.get('/', tweetList)

router.get('/new',tweetNew)

router.post('/new',tweetCreate)

router.get('/edit/:tweetId', tweetEdit)

router.post('/edit/:tweetId', tweetUpdate)

router.delete('/:tweetId',tweetDelete)

module.exports = router