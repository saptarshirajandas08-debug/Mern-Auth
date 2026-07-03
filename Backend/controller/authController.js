const {user} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

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

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? "none":"strict",
            maxAge: 7*24*60*60*1000,
        })

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
        if(!EMAIL){
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

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

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

module.exports ={register, login, logout};