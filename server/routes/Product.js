const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/Product");


// const addProduct = async (req, res) => {

//     const newProduct = new Product(req.body)

//     try {
//         const saveProduct = await newProduct.save();
//         res.status(200).json(saveProduct);
//     } catch (err) {
//         res.status(500).json(err);
//     }

// }
const addProduct = async (req, res) => {
    const newProduct = new Product(req.body);
  
    try {
      // Check if the same product already exists
      const existingProduct = await Product.findOne({ title: req.body.title });
      if (existingProduct) {
        return res.status(409).json({ message: 'Product already exists' });
      }
  
      // Save the new product
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  };

// const updateProduct = async (req, res) => {
    
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(
//           req.params.id,
//           {
//             $set: req.body,
//           },
//           { new: true }
//         );
//         res.status(200).json(updatedProduct);
//       } catch (err) {
//         res.status(500).json(err);
//       }
// }

const updateProduct = async (req, res) => {
  try {
    // Find the product to be updated
    const productToUpdate = await Product.findById(req.params.id);

    if (!productToUpdate) {
      return res.status(404).json('Product not found');
    }

    // Check if the updated category already exists
    const existingProduct = await Product.findOne({
      category: req.body.category,
      _id: { $ne: productToUpdate._id } // Exclude the current product from the check
    });
    if (existingProduct) {
      return res.status(409).json('Product with the updated category already exists');
    }

    // Update the product
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
};

const deleteProduct = async (req, res) => {
  
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted..");
    } catch(err) {
        res.status(500).json(err);
    }
}

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('reviews')
        
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
            products = await Product.find({}).sort({ createdAt: -1}).limit(5).populate('reviews');
        } else if (queryCategory) {
            products = await Product.find({categories: {
                $in: [queryCategory],
            },
        }).populate('reviews');
        } else {
            products = await Product.find({}).populate('reviews');
        }
  
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json(err)
    }
}


const getSearchedProduct = async (req, res) => {

  const { term } = req.query;

  try {
    const products = await Product.find({
      title: { $regex: new RegExp(term, 'i') }, // Perform case-insensitive search
    }).select('title categories img price'); // Select only the title field

    const titles = products.map((product) => product.title);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

router.post("/product/add", verifyTokenAndAdmin, addProduct);
router.put("/product/update/:id", verifyTokenAndAdmin, updateProduct);
router.delete("/product/delete/:id", verifyTokenAndAdmin, deleteProduct);
router.get("/product/find/:id", getProduct);
router.get("/product/all", getAllProduct);
router.get("/product/search", getSearchedProduct);

module.exports = router;