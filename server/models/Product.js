const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title : {
        type: String,
        require: true,
        unique: true
    },
    desc : {
        type: String,
        require: true
    },
    img : {
        type: String,
        require: true
    },
    categories : {
        type: Array,
        require: true
    },
    materials : {
        type: String
    },
    materialsDesc : {
        type: String
    },
    price : {
        type: Number,
        require: true
    },
    inStock : {
        type: Boolean,
        default: true
    },
    reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'reviews'
        }
      ]
}, { timestamps: true })

const ProductModel = mongoose.model("products", ProductSchema)
module.exports = ProductModel