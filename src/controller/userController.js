const {userModel,counterModel} = require('../model/userModel');
const mongoose = require('mongoose')

const createUser = async (req,res) => {
    try{
        counterModel.findOneAndUpdate(
            {id: "autoval"},
            {$inc:{'seq': 1}},
            {new: true}, async (err, cd) => {
                let seqId;
                if(cd == null){
                    const newVal = new counterModel({id: "autoval",seq: 1})
                    newVal.save()
                    seqId = 1
                }else{
                    seqId = cd.seq
                }

                let data = req.body
                data.userId = seqId
                await userModel.create(data, async (err,data)=>{
                    if(err){
                        await counterModel.findOneAndUpdate({id:"autoval"},{$inc:{'seq':-1}},{new: true})
                        return res.status(400).send({msg: err.message})
                    }
                    if(data){
                        return res.status(201).send({data})
                    }
                })
            }
        )

    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const editUser = async (req,res) => {
    try{
        let data = req.body
        let myId = req.headers['valid-user']
        let updatedUser = await userModel.findOneAndUpdate({_id: myId, isDeleted: false},data,{new:true})
        if(!updatedUser)
            return res.status(404).send({msg: "User not found."}) 
        res.status(200).send({data: updatedUser})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

// const getUser = async (req,res) => {
//     try{
//         let userId = req.headers['valid-user']
//         let getUserData = await userModel.findOne({_id: userId},{_id:0, createdAt:0, updatedAt:0, __v:0})
//         if(!getUserData)
//             return res.status(404).send({msg: "User not found."}) 
//         res.status(200).send({data: getUserData})
//     }
//     catch(err){
//         res.status(500).send({msg: err.message})
//     }
// }

const followUser = async (req,res) => {
    try{
        let userToFollowId = req.params.id
        let myId = req.headers['valid-user']

        if(userToFollowId === myId) 
            return res.status(400).send({msg: "You can't follow/unfollow your own profile."}) 

        let checkIfFollowedAlready = await userModel.findOne({followers: myId})
        if(checkIfFollowedAlready) 
            return res.status(200).send({msg: "You're already a follower."})

        let followedUser = await userModel.findOneAndUpdate({_id: userToFollowId},{
            $addToSet: {followers: myId}
            },{new: true})

        let followingUser = await userModel.findOneAndUpdate({_id: myId}, {
            $addToSet: {followings: userToFollowId}
            },{new: true})
        res.status(200).send({msg: `you've now followed ${userToFollowId}`, data: followingUser})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const unfollowUser = async (req,res) => {
    try{
        let userToUnfollowId = req.params.id
        let myId = req.headers['valid-user']

        if(userToUnfollowId === myId) 
            return res.status(400).send({msg: "You can't follow/unfollow your own profile."}) 

        let checkIfUnfollowedAlready = await userModel.findOne({followers: myId})
        if(!checkIfUnfollowedAlready) 
            return res.status(200).send({msg: "You've already unfollwed."})

        let unfollowedUser = await userModel.findOneAndUpdate({_id: userToUnfollowId},{
            $pull: {followers: myId}
            },{new: true})

        let unfollowingUser = await userModel.findOneAndUpdate({_id: myId}, {
            $pull: {followings: userToUnfollowId}
            },{new: true})
        res.status(200).send({msg: `you've now unfollowed ${userToUnfollowId}`, data: unfollowingUser})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const blockUser = async (req,res) => {
    try{
        let userIdToBeBlocked = req.query.user
        let myId = req.headers['valid-user']

        if(userIdToBeBlocked === myId) 
            return res.status(400).send({msg: "Not Allowed."}) 

        let block = await userModel.findOneAndUpdate({_id: myId},{
            $addToSet: {blockedUsers: userIdToBeBlocked}
        },{new: true})

        res.status(200).send({msg: `User "${userIdToBeBlocked}" blocked succefully.`})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const unBlockUser = async (req,res) => {
    try{
        let userIdToBeUnBlocked = req.query.user
        let myId = req.headers['valid-user']

        if(userIdToBeUnBlocked === myId) 
            return res.status(400).send({msg: "Not Allowed."}) 

        let unBlock = await userModel.findOneAndUpdate({_id: myId, blockedUsers: userIdToBeUnBlocked},{
            $pull: {blockedUsers: userIdToBeUnBlocked}
        },{new: true})
        if(!unBlock)
            return res.status(404).send({msg: "User is already unblocked"})
        res.status(200).send({msg: `User "${userIdToBeUnBlocked}" Unblocked succefully.`})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

module.exports = {createUser, editUser, followUser, unfollowUser, blockUser, unBlockUser}