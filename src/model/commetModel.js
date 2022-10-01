const mongoose = require('mongoose')
const ObjectId = mongoose.SchemaTypes.ObjectId

const commentSchema = new mongoose.Schema({
    comment: {
        type: String, 
        required: true, 
        trim: true
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    postId: {
        type: ObjectId,
        ref: 'Post'
    }
},
{timestamps:true})

const commentModel = mongoose.model('Comment', commentSchema)//comments

module.exports = {commentModel}