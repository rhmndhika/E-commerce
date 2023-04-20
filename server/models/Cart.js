const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userId : {
        type: String
    },
    products : [
        {
            productId : {
                type: String
            },
            categories : [],
            desc : {
                type: String,
            },
            img : {
                type: String,
            },
            materials : {
                type: String,
            },
            price : {
                type: Number,
            },
            title : {
                type: String,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity can not be less then 1.'],
                default: 1
            },
            total : {
                type: Number
            }
        }
    ],
    bill : {
        type: Number,
        required: true,
        default: 0
    } 
}, { timestamps: true })

const CartModel = mongoose.model("carts", CartSchema)
module.exports = CartModel