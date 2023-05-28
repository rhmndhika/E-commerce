const express = require('express');
const router = express.Router();
const { verifyToken } = require("./verifyToken");
const {
  calculateItemSimilarity,
  generateItemRecommendations
} = require('./recommendationUtils');
const ReviewModel = require('../models/Review');



const getRecommendation = async (req, res) => {

 // Calculate the dot product of two vectors
 try {
  const targetUser = '6430ecb9adbbf765790dfab5'; // Replace with your target user ID

  // Retrieve all reviews
  const reviews = await ReviewModel.find({});

  // Convert reviews into a suitable data structure
  const userItemRatings = {};
  reviews.forEach((review) => {
    const { user, product, rating } = review;
    if (!userItemRatings[user]) {
      userItemRatings[user] = {};
    }
    userItemRatings[user][product] = rating;
  });



  // Calculate item-item similarity matrix
  const itemSimilarityMatrix = calculateItemSimilarity(userItemRatings);

  console.log("YO", itemSimilarityMatrix)


  // Generate recommendations for the target user
  const recommendations = generateItemRecommendations(targetUser, userItemRatings, itemSimilarityMatrix);

  res.json({
    targetUser,
    userItemRatings,
    itemSimilarityMatrix,
    recommendations
  });
} catch (error) {
  console.error('Error fetching recommendations:', error);
  res.status(500).json({ error: 'Error fetching recommendations' });
}

}


router.get('/recommendations', getRecommendation);
  
module.exports = router;