const mongoose = require('mongoose')
const CartModel = require('./Cart')
const NotificationModel = require('./Notification');

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
        default: "Pending"
    }

}, { timestamps: true })

OrderSchema.post('save', async function (doc, next) {
    try {
      // Create a notification for the order
      const notification = new NotificationModel({
        userId: doc.userId,
        message: `${doc.userId.toString()} order has been created.`,
        type: 'order',
      });
      await notification.save();

      console.log(doc.userId)
      console.log(doc.userId.toString())
  
      // Remove cart data for the user who made the order
      await CartModel.deleteMany({ userId: doc.userId });
  
      next();
    } catch (error) {
      next(error);
    }
  });

const OrderModel = mongoose.model("orders", OrderSchema)
module.exports = OrderModel