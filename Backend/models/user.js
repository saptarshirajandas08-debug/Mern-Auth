const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    NAME:{
        type: String,
        required: true,
    },
    EMAIL:{
        type: String,
        required: true,
        unique: true,
    },
    PASSWORD:{
        type: String,
        required: true,
    },
    VERIFY_OTP:{
        type: String,
        default: '',
    },
    VERIFY_OTP_EXPIRED_AT:{
        type: Number,
        default: 0,
    },
    IS_ACCOUNT_VERIFIED:{
        type:Boolean,
        default: false,
    },
    RESET_OTP:{
        type: String,
        default: '',
    },
    RESET_OTP_EXPIRED_AT:{
        type: Number,
        default: 0,
    }
})

const user = mongoose.model('user', userSchema);
module.exports = {user};