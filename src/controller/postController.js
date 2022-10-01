const {postModel} = require('../model/postModel');
const {commentModel} = require('../model/commetModel')
const {uploadFile} = require('../aws/awsConnect')
const {validateMedia} = require('../controller/validator');
const { userModel } = require('../model/userModel');

const createPost = async (req,res) => {
    try{
        let data = JSON.parse(JSON.stringify(req.body))
        let file = req.files[0]
        data.userId = req.headers['valid-user']

        if(file){
            if(!validateMedia(file))
                return res.status(400).send({msg: "Only Image or Video file is allowed."})
            data.media = await uploadFile(file)
        }
        console.log(data);
        let savePost = await postModel.create(data)
        res.status(201).send({data: {
            _id: savePost._id,
            title: savePost.title,
            description: savePost.description,
            media: savePost.media,
            createdAt: savePost.createdAt
        }})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const editPost = async (req,res) => {
    try{
        let data = JSON.parse(JSON.stringify(req.body))
        let postId = req.params.postId
        let myId = req.headers['valid-user']
        let updatedPost = await postModel.findOneAndUpdate({_id: postId, userId: myId, isDeleted: false},data,{new:true})
        if(!updatedPost)
            return res.status(404).send({msg: "Post not found.🚫"}) 
        res.status(200).send({data: updatedPost})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const deletePost = async (req,res) => {
    try{
        let postId = req.params.postId
        let userId = req.headers['valid-user']
        let userOfPost = await postModel.findById(postId)

        if(userId !== userOfPost.userId.toString())
            return res.status(403).send({msg: "You can't delete this post."})

        let deleted = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},{isdeleted: true},{new: true})
        if(!deleted)
            return res.status(404).send({msg: "Post not found."})

        res.status(200).end()
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const likePost = async (req,res) => {
    try{
        let postId = req.params.postId
        let userId = req.headers['valid-user']
        let userChoice = await postModel.findOne({$or:[{likedUsers: userId},{dislikedUsers: userId}]})

        let userAlreadyLiked = userChoice?.likedUsers.find(x => x = userId)

        if(!userAlreadyLiked){
            let findPost = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},
                {$inc: {likes: 1}, $addToSet: {likedUsers: userId}},
                {new: true})
            if(!findPost)
                return res.status(404).send({msg: "Post not found."})
        }

        if(userChoice?.dislikedUsers.find(x => x = userId)){
            let findPost = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},
                {$inc: {unlikes: -1}, $pull: {dislikedUsers: userId}},
                {new: true})
        }
        if(userAlreadyLiked)
            return res.status(400).send({msg: "You've already liked this post 👍"})
        res.status(200).end()
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const unlikePost = async (req,res) => {
    try{
        let postId = req.params.postId
        let userId = req.headers['valid-user']
        let userChoice = await postModel.findOne({$or:[{likedUsers: userId},{dislikedUsers: userId}]})

        let userAlreadyDisLiked = userChoice?.dislikedUsers.find(x => x = userId)

        if(!userAlreadyDisLiked){
            let findPost = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},
                {$inc: {unlikes: 1}, $addToSet: {dislikedUsers: userId}},
                {new: true})
            if(!findPost)
                return res.status(404).send({msg: "Post not found."})
        }

        if(userChoice?.likedUsers.find(x => x = userId)){
            let findPost = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},
                {$inc: {likes: -1}, $pull: {likedUsers: userId}},
                {new: true})
        }
        if(userAlreadyDisLiked)
            return res.status(400).send({msg: "You've already dis-liked this post 👍"})
        res.status(200).end()
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const commentPost = async (req,res) => {
    try{
        let data = req.body
        data.userId = req.headers['valid-user']
        data.postId = req.params.postId

        let findPost = await postModel.findOne({_id: req.params.postId, isdeleted: false})
        if(!findPost)
            return res.status(404).send({msg: "post not found."})

        let createComment = await commentModel.create(data)
        res.status(201).send({data: createComment})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const getPost = async (req,res) => {
    try{
        let postId = req.params.postId
        let findPost = await postModel.findById(postId)

        if(findPost?.visibility === 'private')
            return res.status(403).send({msg: "This post is Private.🔒"})
        if(findPost.isdeleted)
            return res.status(404).send({msg: "Post not found."})
        
        let findComments = await commentModel.find({postId},{})
        
        res.status(200).send({
            title: findPost.title,
            description: findPost.description,
            media: findPost.media,
            hashTag: findPost.hashTag,
            friendTag: findPost.friendTag,
            likes: findPost.likes,
            unlikes: findPost.unlikes,
            comments: findComments
        })
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const getMyPosts = async (req,res) => {
    try{
        let userId = req.headers['valid-user']
        let findPosts = await postModel.find({userId, isdeleted: false},
            {userId:0, likedUsers:0, dislikedUsers:0, isdeleted:0, updatedAt:0, __v:0}).sort({ createdAt: 1 }).lean()

        // let myData = await userModel.findById(userId)
        // findPosts = findPosts.filter(post => ![myData.blockedUsers].includes(post.userId))

        let comments = await commentModel.find({isdeleted: false})
        findPosts.forEach(post => {
            post.comments = comments.filter(cmnts => cmnts.postId.toString() === post._id.toString())
        })
        res.status(200).send({data: findPosts})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}


module.exports = {createPost, editPost, deletePost, likePost, unlikePost, commentPost, getPost, getMyPosts}