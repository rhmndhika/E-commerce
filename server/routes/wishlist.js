const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Wishlist = require("../models/Wishlist");

const createWishlist = async (req, res) => {

  const userId = req.body.userId;
  
  try {
      const wishlist = await Wishlist.findOne({ userId: userId });

      if (wishlist) {
        const existingProduct = wishlist.products.find(p => p.productId === req.body.products);
        if (existingProduct) {
            return res.status(400).json("Product already exists in wishlist");
        }
          await Wishlist.updateOne({ userId: userId }, { $push: { products: [{ productId: req.body.products }] } });

          res.status(200).json("Product added to wishlist");
      } else {
          const wishlist = new Wishlist({
            userId: userId,
            products: [{ productId: req.body.products }],
          });
          await wishlist.save();
          res.status(200).json("Wishlist created and product added to wishlist");
      }
  } catch (err) {
      res.status(500).json("Failed to add product to wishlist");
      console.log(err);
  }
}

const deleteUserWishlist = async (req, res) => {

  const userId = req.params.userId;
  const productIdToDelete = req.params.productId;

  try {

    const wishlist = await Wishlist.findOne({ userId: userId });

    if (!wishlist) {
      return res.status(404).send('User not found');
    }

    // Log the wishlist and productIdToDelete to check their values

    // Find the index of the product in the wishlist array
    // const index = wishlist.products.findIndex(product => product.productId === productIdToDelete);
    const index = wishlist.products.findIndex(p => p.productId.toString() === req.params.productId);

    // If the product exists in the wishlist, remove it
    if (index !== -1) {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      res.send('Product removed from wishlist.');
    } else {
      res.status(404).send('Product not found in wishlist.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};


const getUserWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({userId : req.params.id})
          .populate('userId', 'email username _id isAdmin')
          .populate('products.productId')
          .exec();
        res.status(200).json(wishlist);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
  };


router.post("/wishlist/add", verifyToken , createWishlist);
router.delete("/wishlist/delete/:userId/:productId", verifyToken , deleteUserWishlist);
router.get("/wishlist/user/:id", verifyTokenAndAuthorization , getUserWishlist);


module.exports = router