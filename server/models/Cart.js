const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userId : {
        type: String,
        require: true
    },
    products : [
        {
            productId : {
                type: String
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ] 
}, { timestamps: true })

const CartModel = mongoose.model("carts", CartSchema)
module.exports = CartModel