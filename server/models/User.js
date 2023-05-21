const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        require: true,
        unique: true
    },
    email : {
        type: String,
        require: true,
        unique: true
    },
    password : {
        type: String,
        require: true
    },
    isAdmin : {
        type: Boolean,
        default: false,
    },
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wishlists',
    },
    resetToken: String,
    resetTokenExpires: Date,

}, { timestamps: true })

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel