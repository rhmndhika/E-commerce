const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Cart = require("../models/Cart");
const Order = require("../models/Order")

const createCart = async (req, res) => {

    const newCart = new Cart(req.body);

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
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted..");
    } catch(err) {
        res.status(500).json(err)
    }
}

const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.find(req.params.id)
        
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

const getSummaryPriceCart = async (req, res) => {

   try {

    const carts = await Cart.find({userId: req.params.id});

    let total = 0; 

    carts.map((item) => {
        total = total + item.bill
    })

    res.status(200).json(total);

   } catch (err) {
        res.status(500).json(err);
   }
}

const deleteCartIfOrdered = async (req, res) => {
    // removeItem: (state, action) => {
    //     state.products.splice(state.products.findIndex((arrow) => arrow.id === action.payload), 1);
    // },
    
    
    
    try {
        
        const orders = await Order.find({userId: req.params.id}).select("userId -_id");
        const carts = await Cart.find({ userId: orders[0].userId }).select("userId -_id");
  

        const deleteCarts = await Cart.deleteMany({carts});

        res.status(200).json(deleteCarts);

    } catch (err) {
        console.log(err);
    }
}

router.post("/cart/create", verifyToken ,createCart);
router.put("/cart/update/:id", verifyTokenAndAuthorization, updateCart);
router.delete("/cart/delete/:id", verifyToken ,deleteCart);
router.get("/cart/find/:userId", verifyToken ,getUserCart);
router.get("/cart/all", verifyTokenAndAdmin, getAllCart);
router.get("/cart/summary/:id", verifyToken, getSummaryPriceCart);
router.delete("/cart/deleteOrdered/:id", verifyToken, deleteCartIfOrdered);

module.exports = router