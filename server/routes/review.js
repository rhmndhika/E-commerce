const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyTokenAndAuthorization, verifyToken } = require('./verifyToken');

// router.post('/', async (req, res) => {
//   const { user, product, rating, comment } = req.body;
//   const review = new Review({
//     user,
//     product,
//     rating,
//     comment
//   });
//   try {
//     const newReview = await review.save();
//     res.status(201).json(newReview);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

const createReview = async (req, res) => {

    const newReview = new Review(req.body)

    try {
        const saveReview = await newReview.save((err, savedReview) => {
          if (err) {
            // Handle the error
          } else {
            // Add the review ID to the product's reviews array
            Product.findByIdAndUpdate(
              req.body.product,
              { $push: { reviews: savedReview._id } },
              (err) => {
                if (err) {
                  // Handle the error
                } else {
                  // Review added to the product successfully
                  res.status(200).json("Review added to the product successfully");
                }
              }
            );
          }
        })
        res.status(200).json(saveReview);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
}

// const getUserReview = async (req, res) => {

//     try {
//         const review = await Review.findOne({ product: req.params.id })
//         console.log(req.params.id) 
//         res.status(200).json(review);
//     } catch(err) {
//         res.status(500).json(err);
//         console.log(err)
//     }
// }
const getAllReview = async (req, res) => {

    try {
        const review = await Review.find({}).populate('product').populate('user').populate('order')
        res.status(200).json(review);
    } catch(err) {
        res.status(500).json(err);
        console.log(err)
    }
}


const getReviewedProduct = async (req, res) => {
    try {
        // Get all the reviews
        const reviews = await Review.find();
    
        // Extract all the unique product IDs from the reviews
        const productIds = [...new Set(reviews.map((review) => review.product))];
    
        // Query the product collection using the IDs obtained above
        const products = await Product.find({ _id: { $in: productIds } });
    
        // Return the list of products to the client
        res.json(products);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
      }
}

const getSpesificReview = async (req, res) => {

    try {
      const reviews = await Review.find({ user: req.params.userId }).populate('product').populate('user').populate('order')
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
}

const getReviewById = async (req, res) => {
    try {
        const reviews = await Review.findOne({_id :req.params.id}).populate('product').populate('user').populate('order')
        res.status(200).json(reviews);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}


router.post("/product/review", verifyToken, createReview);
router.get("/product/getreview", verifyToken, getAllReview);
router.get("/test/test", verifyToken, getReviewedProduct);
router.get('/products/:userId/reviews', verifyToken, getSpesificReview)
router.get('/products/reviewed/:id', verifyToken, getReviewById)



module.exports = router;
