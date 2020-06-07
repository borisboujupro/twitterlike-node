const { createTweet, getTenTweets, getTweets, deleteTweet,getTweet ,updateTweet , getTweetsForCurrentUserWithFollowing} = require('../database/models/tweet.model')

exports.tweetList = async (req,res,next) => {
    try{
        const tweetsList = await getTweetsForCurrentUserWithFollowing(req.user)
        // console.log(tweetsList)
        res.render('tweets/tweet',{tweetsList, isAuthenticated : req.isAuthenticated() , currentUser : req.user, user : req.user})
    } catch (e) {
        next(e)
    }
}

exports.tweetNew = (req,res,next) => {
    res.render('tweets/tweet-form',{
        tweet : {} , isAuthenticated : req.isAuthenticated() , currentUser : req.user , user : req.user
    });
}

exports.tweetCreate = async (req,res,next) => {
    try{
        const body = req.body
        await createTweet({
            ...body,
            author : req.user._id
        })
        res.redirect('/tweets')
    } catch(e) {
        res.status(400).render('tweets/tweet-form',{ tweet : req.body , errors : e.errors, isAuthenticated : req.isAuthenticated() , currentUser : req.user , user : req.user })
    }
}

exports.tweetDelete = async (req,res,next) => {
    try{
        const tweetId = req.params.tweetId
        await deleteTweet(tweetId)
        const tweetsList = await getTweetsForCurrentUserWithFollowing(req.user)
        
        // Tweak to use partials with layout and EJS
        res.render('none', { layout : 'tweets/tweet-list', tweetsList : tweetsList, isAuthenticated : req.isAuthenticated() , currentUser : req.user , user : req.user}) 
    }catch(e){
        next(e)
    }
}

exports.tweetEdit = async (req,res,next) => {
    try{
        const tweetId = req.params.tweetId
        const tweet = await getTweet(tweetId)
        // console.log(tweetId,tweet)
        res.render('tweets/tweet-form',{tweet, isAuthenticated : req.isAuthenticated() , currentUser : req.user , user : req.user});
    }catch(e){
        next(e)
    }
}

exports.tweetUpdate = async (req,res,next) => {
    try{
        const tweetId = req.params.tweetId
        const body = req.body
        await updateTweet(tweetId,body)
        res.redirect('/tweets')
    } catch(e) {
        res.status(400).render('tweets/tweet-form',{
            errors : e.errors,
            tweet : {...req.body,_id : req.params.tweetId},
            isAuthenticated : req.isAuthenticated() , 
            currentUser : req.user,
            user : req.user})
    }
}

    