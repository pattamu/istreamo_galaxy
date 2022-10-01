const express = require('express')
const router = express.Router()

const { validationResult } = require('express-validator')
const { validateEmail, validatePassword, validatemobile, validateUsername, validateGender } = require('../controller/validator')

const {userLogin} = require('../controller/authentication')
const {userAuthorization} = require('../middleware/authorization')
const {filterBlockedUser, filterBlockedUserForpost} = require('../middleware/filterBlockedUsers')

const {createUser, editUser, followUser, unfollowUser, blockUser, unBlockUser} = require('../controller/userController')
const {getUser, followersCount, followingsCount, likedPostUsers, dislikedPostUsers, countPosts} = require('../controller/prifileAPIs')
const {createPost, editPost, deletePost, likePost, unlikePost, commentPost, getPost, getMyPosts} = require('../controller/postController')
const {getPublicPosts, getRandomPost, paginationPost, likedByMePosts} = require('../controller/explorePosts')

//User apis
router.post('/register', 
    [validateEmail], [validatePassword], [validatemobile], [validateUsername], [validateGender],
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.send({ msg: errors })
        }
        next()
    },
    createUser
)

router.put('/edit-user', 
    userAuthorization, 
    [validateEmail], [validatePassword], [validatemobile], [validateUsername], [validateGender],
        async (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.send({ msg: errors })
            }
            next()
        },
    editUser
)

router.post('/login', userLogin)

router.post('/block-user', userAuthorization, blockUser)
router.post('/unblock-user', userAuthorization, unBlockUser)

router.post('/follow/:id', userAuthorization, filterBlockedUser, followUser)
router.post('/unfollow/:id', userAuthorization, filterBlockedUser, unfollowUser)

//Post related apis
router.post('/posts', userAuthorization, createPost)
router.put('/edit-post/:postId', userAuthorization, editPost)
router.delete('/posts/:postId', userAuthorization, deletePost)

router.post('/like/:postId', userAuthorization, filterBlockedUserForpost, likePost)
router.post('/unlike/:postId', userAuthorization, filterBlockedUserForpost, unlikePost)

router.post('/comment/:postId', userAuthorization, filterBlockedUserForpost, commentPost)
router.get('/posts/:postId', userAuthorization, filterBlockedUserForpost, getPost)
router.get('/all-my-posts', userAuthorization, getMyPosts)


//Profile Apis
router.get('/profile', userAuthorization, getUser)
router.get('/followers-count', userAuthorization, followersCount)
router.get('/followings-count', userAuthorization, followingsCount)
router.get('/liked-post-users/:postId', userAuthorization, likedPostUsers)
router.get('/disliked-post-users/:postId', userAuthorization, dislikedPostUsers)
router.get('/post-count', userAuthorization, countPosts)

//explore Apis
router.get('/get-latest-public-posts', userAuthorization, getPublicPosts)
router.get('/random-post', userAuthorization, getRandomPost)
router.get('/pagination-post/:pages', userAuthorization, paginationPost)
router.get('/my-liked-posts', userAuthorization, likedByMePosts)


module.exports = router