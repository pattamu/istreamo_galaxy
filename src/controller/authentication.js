const jwt = require('jsonwebtoken')
const {userModel} = require('../model/userModel')
const secret = process.env.JWT_SECRET || "istreamo galaxy Pvt. ltd"
const exp = process.env.JWT_EXP || '24h'

const generateToken = (userData) => {
    return jwt.sign({
        userId: userData._id.toString(),
        email: userData.email
    }, secret, { expiresIn: exp })
}

const userLogin = async (req, res) => {
    let data = req.body
    try {
        if (Object.keys(data).length === 2 && data.email && data.password) {
            let userCheck = await userModel.findOne({email: data.email, password: data.password})
            if (!userCheck)
                return res.status(401).send({
                    status: false,
                    message: "Invalid credentials. User doesn't exist."
                })
            let token = generateToken(userCheck)
            res.setHeader('user-auth-key', token)
            res.status(201).send({
                status: true,
                data: {
                    userId: userCheck._id.toString(),
                    token
                }
            })
        }
        else
            res.status(400).send({
                status: false,
                messgae: "Please enter Valid E-mail and Password."
            })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

module.exports = { userLogin }