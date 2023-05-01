const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/product");


const addProduct = async (req, res) => {

    const newProduct = new Product(req.body)

    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (err) {
        res.status(500).json(err);
    }

}

const updateProduct = async (req, res) => {
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedProduct);
      } catch (err) {
        res.status(500).json(err);
      }

}

const deleteProduct = async (req, res) => {
  
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted..");
    } catch(err) {
        res.status(500).json(err)
    }
}

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        res.status(200).json(product);
    } catch(err) {
        res.status(500).json(err)
    }
}

const getAllProduct = async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;

    try {
        let products;

        if(queryNew) {
            products = await Product.find({}).sort({ createdAt: -1}).limit(5);
        } else if (queryCategory) {
            products = await Product.find({categories: {
                $in: [queryCategory],
            },
        });
        } else {
            products = await Product.find({});
        }
  
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json(err)
    }
}

router.post("/product/add", verifyTokenAndAdmin, addProduct);
router.put("/product/update/:id", verifyTokenAndAdmin, updateProduct);
router.delete("/product/delete/:id", verifyTokenAndAdmin, deleteProduct);
router.get("/product/find/:id", getProduct);
router.get("/product/all", getAllProduct);

module.exports = router