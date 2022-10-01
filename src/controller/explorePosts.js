const {postModel} = require('../model/postModel');

const getPublicPosts = async (req,res) => {
    try{
        let myId = req.headers['valid-user']
        let post = await postModel.find({visibility: 'public', isdeleted: false})
                                    .select({hashTag: 0, friendTag: 0, isdeleted: 0, __v: 0, visibility: 0})
                                    .sort({createdAt:1})
                                    .limit(1)
        if(post[0].dislikedUsers.includes(myId))
            return res.status(200).send({msg: "You've liked this post.", post})
        res.status(200).send({post})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const getRandomPost = async (req,res) => {
    try{
        let myId = req.headers['valid-user']
        let randomPost = await postModel.aggregate([{ $sample: { size: 1 } }])
        randomPost = randomPost[0]

        res.status(200).send({data: {
            _id: randomPost._id,
            userId: randomPost.userId,
            title: randomPost.title,
            description: randomPost.description,
            likes: randomPost.likes,
            likedUsers: randomPost.likedUsers,
            unlikes: randomPost.unlikes,
            dislikedUsers: randomPost.dislikedUsers,
            createdAt: randomPost.createdAt,
            updatedAt: randomPost.updatedAt
        }})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const paginationPost = async (req,res) => {
    try{
        let pageLimit = req.params.pages
        let posts = await postModel.find({visibility: 'public', isdeleted: false})
                                    .select({hashTag: 0, friendTag: 0, isdeleted: 0, __v: 0, visibility: 0})
                                    .limit(pageLimit)
        res.status(200).send({posts})

    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const likedByMePosts = async (req,res) => {
    try{
        let myId = req.headers['valid-user']
        let posts = await postModel.find({visibility: 'public', isdeleted: false, likedUsers: myId})
                                    .select({hashTag: 0, friendTag: 0, isdeleted: 0, __v: 0, visibility: 0})
        posts = posts.filter(post => post.userId != myId) //filters out signed in users posts which shouldn't be visible 
        if(!posts.length)
            return res.status(404).send({msg: "You've not liked any posts so far."})
        res.status(200).send({posts})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

module.exports = {getPublicPosts, getRandomPost, paginationPost, likedByMePosts}