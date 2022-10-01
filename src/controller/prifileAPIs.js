const {postModel} = require('../model/postModel');
const { userModel } = require('../model/userModel');

/*
profile details

follower count

following count

get list of all users who liked my post (hint: use aggregation)

post count

*/

const getUser = async (req,res) => {
    try{
        let userId = req.headers['valid-user']
        let getUserData = await userModel.findOne({_id: userId},{_id:0, createdAt:0, updatedAt:0, __v:0})
        if(!getUserData)
            return res.status(404).send({msg: "User not found."}) 
        res.status(200).send({data: getUserData})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const followersCount = async (req,res) => {
    try{
        let myId = req.headers['valid-user']
        let user = await userModel.findById(myId)
        res.status(200).send({followersCount: user.followers.length})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const followingsCount = async (req,res) => {
    try{
        let myId = req.headers['valid-user']
        let user = await userModel.findById(myId)
        res.status(200).send({followingsCount: user.followings.length})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const likedPostUsers = async (req,res) => {
    try{
        let myId = req.headers['valid-user']
        let postId = req.params.postId
        let post = await postModel.findById(postId).populate({path:'likedUsers',select:['_id', 'name','email', 'user_name']})
        if(post.userId != myId)
            return res.status(403).send({msg: "This is not your post"})
        res.status(200).send({data: post.likedUsers})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const dislikedPostUsers = async (req,res) => {
    try{
        let myId = req.headers['valid-user']
        let postId = req.params.postId
        let post = await postModel.findById(postId).populate({path:'dislikedUsers',select:['_id', 'name','email', 'user_name']})
        if(post.userId != myId)
            return res.status(403).send({msg: "This is not your post"})
        res.status(200).send({data: post.dislikedUsers})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const countPosts = async (req,res) => {
    try{
        let myId = req.headers['valid-user']
        let postCount = await postModel.count({userId: myId})
        res.status(200).send({postCount})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

module.exports = {getUser, followersCount, followingsCount, likedPostUsers, dislikedPostUsers, countPosts}