const mongoose = require('mongoose')
const ObjectId = mongoose.SchemaTypes.ObjectId

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    email: {
        type: String, 
        required: true, 
        unique:true, 
        trim: true, 
        lowercase: true
    },
    mobile: {
        type: String, 
        unique:true, 
        trim: true
    }, 
    password: {
        type: String, 
        required: true,
        minLength: 8
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female','other']
    },
    user_name: {
        type: String,
        required: true,
        unique: [true, 'User_name is already taken']
    },
    profile:{
        type: String,
        default: 'public',
        enum: ['public','private']
    },
    followers: {
        type: [ObjectId], 
        ref: 'User'
    },
    followings: {
        type: [ObjectId], 
        ref: 'User'
    },
    blockedUsers:{
        type: [ObjectId],
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
{timestamps:true})

const counterSchema = new mongoose.Schema({
    id:{
        type: String
    },
    seq:{
        type: Number
    }
},{timestamps:true})

const userModel = mongoose.model('User', userSchema)
const counterModel = mongoose.model('Counter', counterSchema)

module.exports = {userModel, counterModel}