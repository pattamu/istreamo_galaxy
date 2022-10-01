const express = require('express')
const app = express()

const mongoose = require('mongoose')
const route = require('./route/router')
const multer = require('multer')

const port = process.env.PORT || 3000
const dbUrl = "mongodb+srv://sandeep:lnK5jvTCoXS0XcWu@cluster0.ifen3lh.mongodb.net/social_media-db"

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use( multer().any())

mongoose.connect(dbUrl, {useNewUrlParser: true})
.then(() => console.log('mongoose is connected'))
.catch(err => console.log(err.message))

app.use('/',route)

app.listen(port, () =>{
    console.log(`Express app ruuning on PORT: ${port}`)
})