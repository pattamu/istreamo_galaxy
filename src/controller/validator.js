const { check } = require('express-validator')
const {userModel} = require('../model/userModel');

const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
// const mobileReg = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
const mobileReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

module.exports = {
    validateEmail: check('email')
        .trim() // Normalizing the email address
        .normalizeEmail()
        .isEmail() // Custom message
        .withMessage('Invalid email')
        // Custom validation
        // Validate email in use or not
        .custom(async (email) => {
            const existingEmail = await userModel.findOne({ email })
            if(existingEmail)
                throw new Error('Email already in use')
        }),

    validatePassword: check('password')
        .custom(async (password) => {
            if(password.charCodeAt(password[0]) > 90 || password.charCodeAt(password[0]) < 65)
                throw new Error('First character should be capital')
            if(!passwordReg.test(password))
                throw new Error('Invalid Password: Should be 8 characters, first char capital, alphanumeric, atleast one special char, one digit')
        }),
    
    validatemobile: check('mobile')
        .custom(async (mobile) => {
            const existingMobile = await userModel.findOne({ mobile })
            if(existingMobile)
                throw new Error('Mobile number already exist')
            if(!mobileReg.test(mobile))
                throw new Error('Invalid Mobile Number')
        }),

    validateUsername: check('user_name')
        .custom(async (user_name) => {
            const existingUserName = await userModel.findOne({ user_name })
            if(existingUserName)
                throw new Error('UserName is already taken')
        }),
    
    validateGender: check('gender')
        .custom(async (gender) => {
            if(!['male', 'female','other'].includes(gender))
                throw new Error("Gender can either be 'male', 'female' or 'other'")
        }),

    validateProfile: check('profile')
        .custom(async (profile) => {
            if(!['public','private'].includes(profile))
                throw new Error("Gender can either be 'public' or 'provate'")
        }),

    validateMedia: (file) => {
        let ext = ['png', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'webp',
        'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi','wmv','mov']
        let fileExt = file.originalname.split('.')
        return ext.includes(fileExt[fileExt.length-1])
    }
}