const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    price : {
        type : Number,
        require : true
    },
    category : {
        type : String,
        require : true
    },
    image : {
        type : String,
        require : true
    },
    stock : {
        type : Number,
        require : true
    },
    description : {
        type : String,
        require : true
    }
})

const ProductModel = mongoose.model("products", ProductSchema)
module.exports = ProductModel