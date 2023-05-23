const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const Category = require("../models/Category");

const createCategory = async (req, res) => {

    const newCategory = new Category(req.body);

    try {        
        const saveCategory = await newCategory.save();
        res.status(200).json(saveCategory);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

const getAllCategory = async (req, res) => {
    
    try {
        const category = await Category.find({});
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json(err);
    }
}


router.post("/category/create", verifyTokenAndAdmin , createCategory);
router.get("/category/all", getAllCategory);

module.exports = router