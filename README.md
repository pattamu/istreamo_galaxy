# istreamo_galaxy

# Nodejs developer Assignment

/*****************************************************************************************************************************/
/*****************************************************************************************************************************/

#postman-collection: https://www.getpostman.com/collections/570d6a0759699713d0ed


#physical copy of postman collection: https://drive.google.com/drive/folders/1belJpqntfro0fhmEeQyo3CT21EjIoVx9?usp=sharing


#online hosted on heroku: https://afternoon-ravine-12599.herokuapp.com

/*****************************************************************************************************************************/
/*****************************************************************************************************************************/

Create API in Node js of following feature mentioned


Tech stack to be used 

Laguage: Nodejs/Express js

Database : mongo DB



Create a database in mongodb online cluster.

All API testing need to be done through postman api testing tool, and also create Postman collection for all the API


Create Restful API for the given features


Features to be implemented


User registration

name, 

user_id(auto increment integer number), 

Password (minimum 8 character, first char capital, alphanumeric, use of special char)

email_id(unique, validation for proper email format)

User_name (unique)

Gender (male/female/other)

Mobile (mobile number validation, with country code)

Profile will be public / private (bonus)

User Login

User can login with his created credentials and make use of JWT token for verification for all furter interaction by user 

User can upload their post

Post can contain 

Text 

Images And videos at same time or any one 

Public / private status of post

Hashtag (bonus)

Friend tag (bonus)

Comment(bonus)

Sub-comment (bonus)


Users can follow and unfollow other users.

User can also like post, delete own post

User can only like post one time only

We(user) can block any other user, means we cannot see his post/profile and he can’t see our post/profile (bonus)

Profile api

profile details

follower count

following count

get list of all users who liked my post (hint: use aggregation)

post count


Explore APIs (hint: use aggregation)

List only public post with Get latest uploaded post(like instagram feeds)

Add extra field in reply is the current user liked this post or not 

Get every time random post (extra bonus)

Not getting blocked user post (bonus)

Pagination show 10 post per page

List down the post which is liked by me (user) only 

My own post should not be listed in this api.


Edit profile

Edit post

Delete post (soft delete)

Unblock user (bonus)