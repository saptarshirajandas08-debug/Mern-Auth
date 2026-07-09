const express = require('express');
const userAuth = require('../middleware/userAuth');
const {getUserData} = require('../controller/userController');

const userRoute = express.Router();

userRoute.post('/get-user-data', userAuth, getUserData)

module.exports = {userRoute};