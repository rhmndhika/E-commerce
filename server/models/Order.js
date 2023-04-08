const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
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
    ],
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status : {
        type: String,
        default: "pending"
    }

}, { timestamps: true })

const OrderModel = mongoose.model("orders", OrderSchema)
module.exports = OrderModel