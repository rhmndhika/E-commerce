const mongoose = require('mongoose')

const CategoriesSchema = new mongoose.Schema({
    img : {
        type: String
    },
    cat : {
        type: String
    }
}, { timestamps: true })

const CategoriesModel = mongoose.model("categorys", CategoriesSchema)
module.exports = CategoriesModel