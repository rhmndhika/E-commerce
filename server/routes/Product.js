const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');

const ProductModel = require('../models/Product');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() +  path.extname(file.originalname))
    }
});

const upload = multer({storage: storage});

const addProduct = async (req, res) => {

    const dataProduct = new ProductModel({
        name : req.body.name,
        price : req.body.price,
        category : req.body.category,
        stock : req.body.stock,
        description : req.body.description,
        image : `http://localhost:5000/images/${req.file.filename}`
    })

    dataProduct.save(function(err) {
        if (err) {
            res.json(err);
        } else {
            res.json(dataProduct);
        }
    })
}

const getAllProduct = (req, res) => {

    ProductModel.find({}, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    })
}

const updateProductById = async (req, res) => {
    const Id = req.params.id;
  
    try {
      const updateProduct = await ProductModel.findByIdAndUpdate({_id : Id}, {
        name : req.body.name,
        price : req.body.price,
        category : req.body.category,
        stock : req.body.stock,
        description : req.body.description
      })

        return res.send(updateProduct);

    } catch (err) {
      return res.status(500).send({
        message: err.message
      })
    }
}

const deleteProductById = async (req, res) => {
    const Id = req.params.id;
  
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete({_id : Id});
      return res.send(deleteProduct);
    } catch (err) {
      return res.status(500).send({
        message: err.message
      })
    }
  }

router.post("/product/add", upload.single('file'), addProduct);
router.get("/product/all", getAllProduct);
router.put("/product/update/:id", updateProductById);
router.delete("/product/delete/:id", deleteProductById);

module.exports = router