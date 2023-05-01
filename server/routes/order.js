const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Order = require("../models/Order");



const createOrder = async (req, res) => {

    const newOrder = new Order(req.body)

    try {
        const saveOrder = await newOrder.save();
        res.status(200).json(saveOrder);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateOrder = async (req, res) => {
    
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedOrder);
      } catch (err) {
        res.status(500).json(err);
      }
}

const deleteOrder = async (req, res) => {
  
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted..");
    } catch(err) {
        res.status(500).json(err)
    }
}

const getUserOrder = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        
        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getUserSingleOrder = async (req, res) => {
    try {

        const orders = await Order.findById(req.params.id).populate('products.productId').exec();
        
        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err);
        console.log(err);
    }
}

const getAllOrder = async (req, res) => {
    
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getMonthlyIncome = async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {

        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth }, ...(productId && {
                products: {
                    $elementMatch: { productId }
                },
            }) } },
            {
                $project: {
                    month: { $month : "$createdAt" },
                    sales: "$amount"
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
}


router.post("/order/create", verifyToken, createOrder);
router.put("/order/update/:id", verifyTokenAndAdmin, updateOrder);
router.delete("/order/delete/:id", verifyTokenAndAdmin, deleteOrder);
router.get("/order/find/:userId", verifyToken, getUserOrder);
router.get("/order/single/:id", verifyToken, getUserSingleOrder);
router.get("/order/all", verifyTokenAndAdmin, getAllOrder);
router.get("/order/income", verifyTokenAndAdmin, getMonthlyIncome);

module.exports = router