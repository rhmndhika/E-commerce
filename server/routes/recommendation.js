const express = require("express");
const router = express.Router();

const UserModel = require('../models/User');
const WishlistModel = require('../models/Wishlist');
const ProductModel = require('../models/Product');
const { verifyToken } = require("./verifyToken");


// const getRecommendationProduct = async (req, res) => {
//     const userId = req.params.userId;

//     try {
//         // Retrieve the user's wishlist
//         const user = await UserModel.findById(userId).populate('wishlist');
//         const wishlist = user.wishlist;
    
//         // Retrieve product IDs from the wishlist
//         const productIds = wishlist.products.map((product) => product.productId);
    
//         // Fetch product details from the database
//         const products = await ProductModel.find({ _id: { $in: productIds } });
    
//         // Implement content-based filtering algorithm to generate recommendations
//         const recommendations = generateContentBasedRecommendations(products);
    
//         res.json(recommendations);
//       } catch (error) {
//         console.error('Error retrieving recommendations:', error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
// }

// Recommendation algorithm function
// function generateContentBasedRecommendations(products) {
//     // Create a mapping of products by their categories
//     const productsByCategory = {};
//     for (const product of products) {
//       for (const category of product.categories) {
//         if (!productsByCategory[category]) {
//           productsByCategory[category] = [];
//         }
//         productsByCategory[category].push(product);
//       }
//     }
  
//     // Create a mapping of products by their materials
//     const productsByMaterials = {};
//     for (const product of products) {
//       const material = product.materials;
//       if (material) {
//         if (!productsByMaterials[material]) {
//           productsByMaterials[material] = [];
//         }
//         productsByMaterials[material].push(product);
//       }
//     }
  
//     // Implement content-based filtering algorithm based on categories and materials
//     const recommendations = [];
  
//     // Retrieve categories and materials from the user's wishlist
//     const wishlistCategories = [];
//     const wishlistMaterials = [];
  
//     for (const product of products) {
//       for (const category of product.categories) {
//         if (wishlistCategories.includes(category)) {
//           // Get products similar to the ones in the same category
//           const similarProducts = productsByCategory[category].filter(
//             (p) => p._id.toString() !== product._id.toString()
//           );
  
//           recommendations.push(...similarProducts);
//         }
//       }
  
//       const material = product.materials;
//       if (material && wishlistMaterials.includes(material)) {
//         // Get products with the same material
//         const similarProducts = productsByMaterials[material].filter(
//           (p) => p._id.toString() !== product._id.toString()
//         );
  
//         recommendations.push(...similarProducts);
//       }
//     }
  
//     // Deduplicate and limit the number of recommendations
//     const uniqueRecommendations = Array.from(new Set(recommendations));
//     return uniqueRecommendations.slice(0, 10);
//   }
  

const getRecommendationProduct = async (req, res) => {
    const userId = req.params.id;

    try {
        const recommendations = await generateContentBasedRecommendations(userId);
        res.status(200).json(recommendations);
      } catch (error) {
        console.log('Failed to generate recommendations:', error.message);
        res.status(500).json({ message: 'Failed to generate recommendations' });
      }
}

// Assuming you have the ProductModel, UserModel, and WishlistModel imported

// Recommendation algorithm function
async function generateContentBasedRecommendations(userId) {
    try {
      // Find the user's wishlist
      const wishlist = await WishlistModel.findOne({ userId: userId }).populate('products.productId');
  
      if (!wishlist) {
        return [];
      }
  
      const userWishlist = wishlist.products.map((product) => product.productId);
  
      // Retrieve all products
      const allProducts = await ProductModel.find();
  
      // Implement content-based filtering algorithm based on categories and materials
      const recommendations = [];
  
      for (const wishlistProduct of userWishlist) {
        const { categories, materials } = wishlistProduct;
  
        // Get products with similar categories
        const similarProductsByCategory = allProducts.filter((product) => {
          return (
            product._id.toString() !== wishlistProduct._id.toString() &&
            product.categories.some((category) => categories.includes(category))
          );
        });
  
        recommendations.push(...similarProductsByCategory);
  
        // Get products with the same material
        if (materials) {
          const similarProductsByMaterial = allProducts.filter((product) => {
            return (
              product._id.toString() !== wishlistProduct._id.toString() &&
              product.materials === materials
            );
          });
  
          recommendations.push(...similarProductsByMaterial);
        }
      }
  
      // Deduplicate and limit the number of recommendations
      const uniqueRecommendations = Array.from(new Set(recommendations));
      return uniqueRecommendations.slice(0, 5);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to generate recommendations');
    }
  }
  
router.get("/recommendations/:id", getRecommendationProduct);
module.exports = router;