const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const Category = require("../models/Categories");

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

const getSingleCategory = async (req, res) => {
    try {

        const category = await Category.findById(req.params.id)
        
        res.status(200).json(category);
    } catch(err) {
        res.status(500).json(err);
        console.log(err);
    }
}

const deleteCategory = async (req, res) => {
  
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json("Category has been deleted..");
    } catch(err) {
        res.status(500).json(err)
    }
}

const updateCategory = async (req, res) => {
    
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedCategory);
      } catch (err) {
        res.status(500).json(err);
      }

}

router.post("/categories/create", verifyTokenAndAdmin , createCategory);
router.get("/categories/all", getAllCategory);
router.get("/categories/details/:id", verifyTokenAndAdmin, getSingleCategory);
router.delete("/categories/delete/:id", verifyTokenAndAdmin, deleteCategory);
router.put("/categories/update/:id", verifyTokenAndAdmin, updateCategory);

module.exports = router