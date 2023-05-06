const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    fullname : {
        type: String
    },
    dateOfBirth : {
        type: Date
    },
    gender : {
        type: String
    },
    available : {
        type: String
    },
    company : {
        type: String
    },
    img : {
        type: String
    }
}, { timestamps: true })

const ProfileModel = mongoose.model("profiles", ProfileSchema)
module.exports = ProfileModel