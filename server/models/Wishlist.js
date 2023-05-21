const mongoose = require('mongoose')

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
          },
        },
      ],
}, { timestamps: true })

const WishlistModel = mongoose.model("wishlists", WishlistSchema)
module.exports = WishlistModel

