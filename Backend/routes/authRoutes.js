const express = require('express');
const {register, login, logout, sendVerifyOtp, verifyOTP} = require('../controller/authController');
const userAuth = require('../middleware/userAuth');
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth ,sendVerifyOtp);
authRouter.post('/verify-otp', userAuth ,verifyOTP);


module.exports = {authRouter};