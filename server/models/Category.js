const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    img : {
        type: String
    },
    cat : {
        type: String
    }

}, { timestamps: true })

const CategoryModel = mongoose.model("categories", categorySchema)
module.exports = CategoryModel