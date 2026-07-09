const {user} = require('../models/user');

const getUserData = async(req, res)=>{
    try{
        const {userId} = req.body;

        const foundUser = await user.findById(userId);
        if(!foundUser){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        res.status(200).json({
            success: true,
            userData:{
                NAME: foundUser.NAME,
                IS_ACCOUNT_VERIFIED: foundUser.IS_ACCOUNT_VERIFIED,
                
            }
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        })
    }
}

module.exports = {getUserData}