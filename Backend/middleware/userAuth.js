const jwt = require('jsonwebtoken');
const { user } = require('../models/user');

const userAuth = async(req, res, next) =>{
    try{
        const {token} = req.cookies;

        if(!token){
            res.status(400).json({
                success: false,
                message: "User is not logged In",
            })
        }

        const tokenId = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(tokenId.id){
            req.body = req.body || {};
            req.body.userId = tokenId.id;
        }else{
            res.status(400).json({
                success: false,
                message: "Not authorized login",
            })
        }

        next();
    }catch(error){
        console.log(error);
    }
}

module.exports = userAuth;