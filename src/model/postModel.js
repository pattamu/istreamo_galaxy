const mongoose = require('mongoose')
const ObjectId = mongoose.SchemaTypes.ObjectId

const postSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    visibility:{
        type: String,
        default: 'public',
        enum: ['public','private']
    },
    title: {
        type: String, 
        required: true, 
        trim: true
    },
    description: {
        type: String, 
        trim: true, 
    },
    media: {
        type: String,
        trim: true
    },
    hashTag: {
        type:[String]
    },
    friendTag: {
        type:[ObjectId],
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0
    },
    likedUsers: {
        type: [ObjectId],
        ref: 'User'
    },
    unlikes: {
        type: Number,
        default: 0
    },
    dislikedUsers: {
        type: [ObjectId],
        ref: 'User'
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
},
{timestamps:true})

const postModel = mongoose.model('Post', postSchema)//posts

module.exports = {postModel}