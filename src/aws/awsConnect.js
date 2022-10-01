const S3 = require('aws-sdk/clients/s3')

const bucketName = "sandeep-social-media-app"
const region = 'ap-south-1'
const accessKeyId = "AKIATCRPKSQ2NYRKUSJU"
const secretAccessKeyId = "QloyMHsU4wQ19F0boxjwinbROzBJbWWj6KL/WjI2"

const s3 = new S3({
    apiVersion: "2010-12-01",
    region,
    accessKeyId,
    secretAccessKeyId
})

const uploadFile = (file) => {
    const uploadParams = {
        Bucket: bucketName,
        Key: "sandeep/" + file.originalname,
        Body: file.buffer
    }
    return s3.upload(uploadParams).promise()
}

module.exports = {uploadFile}