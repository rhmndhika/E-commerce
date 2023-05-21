const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    fullname : {
        type: String,
        require: true
    },
    email : {
        type: String,
        require: true
    },
    dateOfBirth : {
        type: Date,
        require: true
    },
    phoneNumber : {
        type: Number,
        require: true
    },
    gender : {
        type: String,
        require: true
    },
    available : {
        type: String,
        require: true
    },
    company : {
        type: String
    },
    img : {
        type: String
    },
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wishlists',
      },
}, { timestamps: true })

const ProfileModel = mongoose.model("profiles", ProfileSchema)
module.exports = ProfileModel