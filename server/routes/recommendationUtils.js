const ProductModel = require('../models/Product');
const ReviewModel = require('../models/Review');

let tampung = null

function calculateCosineSimilarity(vectorA, vectorB) {
  const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + Math.pow(value, 2), 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + Math.pow(value, 2), 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// const calculateItemSimilarity = (userItemRatings) => {
//   console.log(userItemRatings)
//   const itemSimilarityMatrix = {};

//   // Iterate over each item
//   Object.keys(userItemRatings).forEach((itemA) => {
//     itemSimilarityMatrix[itemA] = {};

//     // Iterate over each other item (excluding itemA)
//     Object.keys(userItemRatings).forEach((itemB) => {
//       if (itemA !== itemB) {
//         const ratingsA = [];
//         const ratingsB = [];

//         // Iterate over each user and fetch ratings for itemA and itemB
//         Object.keys(userItemRatings[itemA]).forEach((user) => {
//           if (userItemRatings[user] && userItemRatings[user][itemA] && userItemRatings[user][itemB]) {
//             ratingsA.push(userItemRatings[user][itemA]);
//             ratingsB.push(userItemRatings[user][itemB]);
//           }
//         });

//         console.log("ratingsA", ratingsA);
//         console.log("ratingsB", ratingsB);

//         // Calculate cosine similarity between itemA and itemB based on ratings
//         const similarity = calculateCosineSimilarity(ratingsA, ratingsB);
//         itemSimilarityMatrix[itemA][itemB] = similarity;

//         console.log("similarity", similarity);
//       }
//     });
//   });

//   return itemSimilarityMatrix;
// };

const calculateItemSimilarity = (userItemRatings) => {
  const itemSimilarityMatrix = {};

  // Iterate over each user
  Object.keys(userItemRatings).forEach((user) => {
    const userRatings = userItemRatings[user];

    // Iterate over each item rated by the user
    Object.keys(userRatings).forEach((itemA) => {
      itemSimilarityMatrix[itemA] = {};

      // Iterate over other items (excluding itemA)
      Object.keys(userRatings).forEach((itemB) => {
        if (itemA !== itemB) {
          if (!itemSimilarityMatrix[itemA][itemB]) {
            itemSimilarityMatrix[itemA][itemB] = 0;
          }

          // Calculate similarity between itemA and itemB based on user ratings
          itemSimilarityMatrix[itemA][itemB] += 1;
        }
      });
    });
  });

  tampung = itemSimilarityMatrix
  return itemSimilarityMatrix;
};


const generateItemRecommendations = (targetUser, userItemRatings, itemSimilarityMatrix) => {
  const targetUserRatings = userItemRatings[targetUser];
  const recommendationScores = {};


  if (!targetUserRatings || !itemSimilarityMatrix) {
    // Handle the case when targetUserRatings or itemSimilarityMatrix is undefined or null
    return [];
  }

  // Iterate over each item rated by the target user
  Object.keys(targetUserRatings).forEach((itemA) => {
    const ratingA = targetUserRatings[itemA];

    // Check if itemA exists in the itemSimilarityMatrix
    if (itemSimilarityMatrix[itemA]) {
      // Iterate over similar items to itemA
      Object.keys(itemSimilarityMatrix[itemA]).forEach((itemB) => {
        const similarity = itemSimilarityMatrix[itemA][itemB];

        // Calculate recommendation score
        if (!targetUserRatings[itemB]) {
          if (!recommendationScores[itemB]) {
            recommendationScores[itemB] = {
              score: 0,
              totalSimilarity: 0
            };
          }
          recommendationScores[itemB].score += ratingA * similarity;
          recommendationScores[itemB].totalSimilarity += similarity;
        }
      });
    }
  });

  // Calculate weighted average and sort recommendations
  const recommendations = Object.keys(recommendationScores)
    .map((item) => ({
      item,
      score: recommendationScores[item].score / recommendationScores[item].totalSimilarity
    }))
    .sort((a, b) => b.score - a.score);

  return recommendations;
};



module.exports = {
  calculateItemSimilarity,
  generateItemRecommendations
};



