const mongoose = require('mongoose')
const CartModel = require('./Cart')

const OrderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    products : [
        {
            productId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
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

OrderSchema.post('save', async function (doc, next) {
    // remove cart data for the user who made the order
    await CartModel.deleteMany({ userId: doc.userId })
    next();
})

const OrderModel = mongoose.model("orders", OrderSchema)
module.exports = OrderModel