const {user} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const transporter = require('../config/nodemailer');

const register = async(req, res)=>{
    try{
        const {NAME, EMAIL, PASSWORD} = req.body;

        if(!NAME || !EMAIL || !PASSWORD){
            res.status(400).json({
                success: true,
                message: "Please fill up the name, email and password",
            })
        }
        //check with other email
        const existingUser = await user.findOne({EMAIL});
        if(existingUser){
            res.status(400).json({
                success: true,
                message: "Email Already Exist",
            })
        }

        const hashedPassword = await bcrypt.hash(PASSWORD, 10);
        
        const newUser = new user({
            NAME, 
            EMAIL,
            PASSWORD: hashedPassword,
        })
        await newUser.save();

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? "none":"strict",
            maxAge: 7*24*60*60*1000,
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: EMAIL,
            subject: "Welcome to our website",
            text: `Your account is created with email id ${EMAIL}`,
        }

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: "New user created successfully",
            user: newUser
        })
        
        
    }catch(error){
        res.status(500).json({
            success: false,
            message: "500 Internal Server error"

        })
        // console.log(error);
    }
}

const login = async(req, res)=>{
    try{
        const {EMAIL, PASSWORD} = req.body;
        if(!EMAIL || !PASSWORD){
            res.status(400).json({
                success: false,
                message: "Email and Password is required",
            })
        }

        const findEmail = await user.findOne({EMAIL});
        if(!findEmail){
            res.status(404).json({
                success: false,
                message:"Email not found",
            })
        }

        const isMatch = await bcrypt.compare(PASSWORD, findEmail.PASSWORD);
        if(!isMatch){
            res.status(404).json({
                success: false,
                message:"password is not correct",
            })
        }

        const token = jwt.sign({id: findEmail._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? "none":"strict",
            maxAge: 7*24*60*60*1000,
        })

        res.status(200).json({
            success: true,
            message: "User Loged In successfully",
            token: token,
        })        

    }catch(error){
        res.status(500).json({
            success: false,
            message: "500 Internal Server error"
        })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "500 Internal server error",
        });
    }
};

const sendVerifyOtp = async(req, res)=>{
    try{
        const {userId} = req.body;
        const foundUser = await user.findOne({_id: userId});  

        if(!foundUser){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if(foundUser.IS_ACCOUNT_VERIFIED){
            return res.status(400).json({ success: false, message: "Account Already Verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        foundUser.VERIFY_OTP = otp;
        foundUser.VERIFY_OTP_EXPIRED_AT = Date.now() + 24 * 60 * 60 * 1000; 
        await foundUser.save();   

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: foundUser.EMAIL,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        });

            return res.status(200).json({ success: true, message: "OTP sent successfully" });
        }catch(error){
            console.log(error);
            return res.status(500).json({ success: false, message: "500 Internal Server Error" });
        }
};

const verifyOTP = async(req, res)=>{
    try{
        const{userId, otp} = req.body;
        if(!userId || !otp){
            res.status(400).json({
                success: false,
                message: "Information is missing"
            })
        }
        const finduser = await user.findById(userId);
        if(!finduser){
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        if(finduser.VERIFY_OTP === '' || finduser.VERIFY_OTP !== otp ){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        if(finduser.VERIFY_OTP_EXPIRED_AT < Date.now()){
             res.status(400).json({
                success: false,
                message: "OTP is expired",
            })
        }

        finduser.IS_ACCOUNT_VERIFIED = true;
        finduser.VERIFY_OTP = '';
        finduser.VERIFY_OTP_EXPIRED_AT = 0;

        await finduser.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: "500 Internal Server Error",
        })
        console.log(error);
    }
}

const isAuthenticated = async(req, res)=>{
    try{
        return res.status(200).json({
            message: true,
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

module.exports ={register, login, logout, sendVerifyOtp, verifyOTP, isAuthenticated};