const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Cart = require("../models/Cart");

const createCart = async (req, res) => {

    const newCart = new Cart(req.body)

    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateCart = async (req, res) => {
    
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedCart);
      } catch (err) {
        res.status(500).json(err);
      }
}

const deleteCart = async (req, res) => {
  
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted..");
    } catch(err) {
        res.status(500).json(err)
    }
}

const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
        
        res.status(200).json(cart);
    } catch(err) {
        res.status(500).json(err)
    }
}

const getAllCart = async (req, res) => {
    
    try {
        const carts = await Cart.find({});
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
}

router.post("/cart/create", verifyToken, createCart);
router.put("/cart/update/:id", verifyTokenAndAuthorization, updateCart);
router.delete("/cart/delete/:id", verifyTokenAndAuthorization, deleteCart);
router.get("/cart/find/:userId", verifyTokenAndAuthorization, getUserCart);
router.get("/cart/all", verifyTokenAndAdmin, getAllCart);

module.exports = router