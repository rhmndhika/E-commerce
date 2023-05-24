const ProductModel = require('../models/Product');
const ReviewModel = require('../models/Review');


// Calculate similarity between two products
async function calculateSimilarity(productId1, productId2) {
    // Retrieve reviews for the two products
    const reviews1 = await ReviewModel.find({ product: productId1 });
    const reviews2 = await ReviewModel.find({ product: productId2 });
  
    // Calculate the intersection of users who reviewed both products
    const users1 = reviews1.map((review) => review.user.toString());
    const users2 = reviews2.map((review) => review.user.toString());
    const commonUsers = users1.filter((user) => users2.includes(user));
  
    // Calculate the sum of squared differences in ratings
    let sumSquaredDiff = 0;
    for (const user of commonUsers) {
      const rating1 = reviews1.find((review) => review.user.toString() === user).rating;
      const rating2 = reviews2.find((review) => review.user.toString() === user).rating;
      const diff = rating1 - rating2;
      sumSquaredDiff += diff * diff;
    }
  
    // Calculate the similarity score using the inverse of the sum of squared differences
    const similarity = 1 / (1 + Math.sqrt(sumSquaredDiff));
    return similarity;
  }
  
  // Get recommendations based on item-based collaborative filtering
  async function getItemBasedRecommendations(productId, limit) {
    // Retrieve all products
    const products = await ProductModel.find();
  
    // Calculate similarity between the given product and all other products
    const similarities = [];
    for (const product of products) {
      if (product._id.toString() !== productId) {
        const similarity = await calculateSimilarity(productId, product._id.toString());
        similarities.push({ product: product._id.toString(), similarity });
      }
    }
  
    // Sort the similarities in descending order
    similarities.sort((a, b) => b.similarity - a.similarity);
  
    // Get the top recommended products
    const recommendations = [];
    for (let i = 0; i < limit && i < similarities.length; i++) {
      const similarProduct = await ProductModel.findById(similarities[i].product);
      recommendations.push(similarProduct);
    }
  
    return recommendations;
  }
  
  module.exports = {
    calculateSimilarity,
    getItemBasedRecommendations,
  };


// const express = require("express");
// const router = express.Router();

// const UserModel = require('../models/User');
// const WishlistModel = require('../models/Wishlist');
// const ProductModel = require('../models/Product');
// const { verifyToken } = require("./verifyToken");


// const getRecommendationProduct = async (req, res) => {
//     const userId = req.params.id;

//     try {
//         const recommendations = await generateContentBasedRecommendations(userId);
//         res.status(200).json(recommendations);
//       } catch (error) {
//         console.log('Failed to generate recommendations:', error.message);
//         res.status(500).json({ message: 'Failed to generate recommendations' });
//       }
// }

// // Assuming you have the ProductModel, UserModel, and WishlistModel imported

// // Recommendation algorithm function
// async function generateContentBasedRecommendations(userId) {
//     try {
//       // Find the user's wishlist
//       const wishlist = await WishlistModel.findOne({ userId: userId }).populate('products.productId');
  
//       if (!wishlist) {
//         return [];
//       }
  
//       const userWishlist = wishlist.products.map((product) => product.productId);
  
//       // Retrieve all products
//       const allProducts = await ProductModel.find();
  
//       // Implement content-based filtering algorithm based on categories and materials
//       const recommendations = [];
  
//       for (const wishlistProduct of userWishlist) {
//         const { categories, materials } = wishlistProduct;
  
//         // Get products with similar categories
//         const similarProductsByCategory = allProducts.filter((product) => {
//           return (
//             product._id.toString() !== wishlistProduct._id.toString() &&
//             product.categories.some((category) => categories.includes(category))
//           );
//         });
  
//         recommendations.push(...similarProductsByCategory);
  
//         // Get products with the same material
//         if (materials) {
//           const similarProductsByMaterial = allProducts.filter((product) => {
//             return (
//               product._id.toString() !== wishlistProduct._id.toString() &&
//               product.materials === materials
//             );
//           });
  
//           recommendations.push(...similarProductsByMaterial);
//         }
//       }
  
//       // Deduplicate and limit the number of recommendations
//       const uniqueRecommendations = Array.from(new Set(recommendations));
//       return uniqueRecommendations.slice(0, 5);
//     } catch (error) {
//       console.log(error);
//       throw new Error('Failed to generate recommendations');
//     }
//   }
  
// router.get("/recommendations/:id", getRecommendationProduct);
// module.exports = router;

