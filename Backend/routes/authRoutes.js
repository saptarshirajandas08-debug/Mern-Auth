const express = require('express');
const {register, login, logout, sendVerifyOtp, verifyOTP, isAuthenticated} = require('../controller/authController');
const userAuth = require('../middleware/userAuth');
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth ,sendVerifyOtp);
authRouter.post('/verify-otp', userAuth ,verifyOTP);
authRouter.post('/is-authenticated', userAuth, isAuthenticated);


module.exports = {authRouter};