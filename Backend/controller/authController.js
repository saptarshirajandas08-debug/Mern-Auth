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

        const existingUser = await user.findOne({$or: [{EMAIL}]});
        if(existingUser){
            res.status(400).json({
                success: true,
                message: "Email Already Exist",
            })
        }

        
    }catch(error){

    }
}

module.exports ={};