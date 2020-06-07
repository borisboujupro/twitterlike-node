const mongoose = require('mongoose')

const tweetSchema = mongoose.Schema({
    content : { 
        type : String ,
        required : [true,"Il faut saisir un tweet :)"] ,
        maxlength : [140,"Tweet trop long, désolé :/"],
        minlength : [2,"Tweet trop petit, soyez plus expressif :)"]
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : true
    }
})

const Tweets = mongoose.model('tweets',tweetSchema)

exports.Tweets = Tweets

exports.getTweets = (tweet) => {
    return Tweets.find({})
}

exports.getTenTweets = (tweet) => {
    return Tweets.find({}).limit(10)
}

exports.createTweet = (tweet) => {
    return new Tweets(tweet).save()
}

exports.deleteTweet = (tweetId) => {
    return Tweets.findByIdAndDelete(tweetId)
}

exports.getTweet = (tweetId) => {
    return Tweets.findById(tweetId)
}

exports.updateTweet = (tweetId,tweet) => {
    return Tweets.findByIdAndUpdate(tweetId, { $set : tweet } , { runValidators : true })
}

exports.getTweetsForCurrentUserWithFollowing = (user) => {
    return Tweets.find({ author : { $in : [user._id,...user.following] }}).populate('author')
}

exports.getTweetsForUser = (user) => {
    return Tweets.find({ author : user._id}).populate('author')
}