const {userModel} = require('../model/userModel')
const {postModel} = require('../model/postModel');

const filterBlockedUser = async (req,res,next) => {
    try{
        let userId = req.params.id
        let myId = req.headers['valid-user']
        let findUser = await userModel.findOne({_id:myId, blockedUsers: userId})
        if(findUser)
            return res.status(403).send({msg: "User is blocked.🚫"})
        next()
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const filterBlockedUserForpost = async (req,res,next) => {
    try{
        let postId = req.params.id
        let myId = req.headers['valid-user']
        let post = await postModel.findById(postId)
        let findUser = await userModel.findOne({_id: myId, blockedUsers: post?.userId})
        if(findUser)
            return res.status(403).send({msg: "User is blocked.🚫"})
        next()
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

module.exports = {filterBlockedUser, filterBlockedUserForpost}