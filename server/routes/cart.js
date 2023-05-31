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
        res.status(500).json(err);
    }
}

const getUserCart = async (req, res) => {
    try {
        const cart = await Cart.find(req.params.id)
        
        res.status(200).json(cart);
    } catch(err) {
        res.status(500).json(err);
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
    
    try {

        let selectedId = null
        let CartItem = []
        
        const orders = await Order.find({})
        const carts = await Cart.find({});

        orders.map((item) => {
           selectedId = (item.products[0].productId.toString());
        })

    } catch (err) {
        console.log(err);
    }
}

const increaseQuantityProduct = async (req, res) => {
    const { cartId, productId } = req.params;

    try {
      const cart = await Cart.findById(cartId);
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const product = cart.products.find((p) => p._id.toString() === productId);

  
      if (!product) {
        return res.status(404).json({ message: 'Product not found in the cart' });
      }
  
      product.quantity += 1;
      cart.bill = product.quantity * product.price
  
      await cart.save();
  
      return res.status(200).json({ message: 'Quantity increased successfully', cart });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
}

const decreaseQuantityProduct = async (req, res) => {
    const { cartId, productId } = req.params;

    try {
      const cart = await Cart.findById(cartId);
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const product = cart.products.find((p) => p._id.toString() === productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found in the cart' });
      }
  
      if (product.quantity > 1) {
        product.quantity -= 1;
        cart.bill = product.quantity * product.price
      } else if (product.quantity < 1) {
        // Remove the product from the cart if the quantity is 1
        cart.products = cart.products.filter((p) =>p._id.toString() !== productId);
      }
  
      await cart.save();
  
      return res.status(200).json({ message: 'Quantity decreased successfully', cart });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
}

router.post("/cart/create", verifyToken , createCart);
router.put("/cart/update/:id", verifyTokenAndAuthorization, updateCart);
router.delete("/cart/delete/:id", verifyToken ,deleteCart);
router.get("/cart/find/:userId", verifyToken ,getUserCart);
router.get("/cart/all", verifyTokenAndAdmin, getAllCart);
router.get("/cart/summary/:id", verifyToken, getSummaryPriceCart);
router.delete("/cart/deleteOrdered", verifyToken, deleteCartIfOrdered);
router.put("/cart/increase/:cartId/:productId", verifyToken, increaseQuantityProduct);
router.put("/cart/decrease/:cartId/:productId", verifyToken, decreaseQuantityProduct);

module.exports = router