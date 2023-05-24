const express = require('express');
const router = express.Router();
const { verifyToken } = require("./verifyToken");
const { getItemBasedRecommendations } = require('./recommendationUtils');

const getRecommendation = async (req, res) => {
    try {
        const productId = req.params.productId;
        const limit = 5; // Number of recommendations
    
        // Get recommendations based on item-based collaborative filtering
        const recommendations = await getItemBasedRecommendations(productId, limit);
    
        res.json(recommendations);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
}

router.get('/recommendations/:productId', verifyToken, getRecommendation);
  
module.exports = router;