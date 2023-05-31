import React, { useEffect, useState } from 'react';
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { FaStar } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { publicRequest, userMethod } from '../../useFetch.js'
import Search from '../../components/Search.jsx';

const Testing = () => {

  const tokenUserId = Cookies.get('userId');
  const [recommendations, setRecommendations] = useState([]);
  

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch user's ratings
        const userRatings = await userMethod.get(`/products/${tokenUserId}/reviews`);

        // Fetch all products along with their reviews
        const products = await publicRequest.get('/product/all');

        console.log(products.data)

        // Calculate item similarities
        const itemSimilarities = calculateItemSimilarities(products.data);

        console.log(itemSimilarities)

        // Generate recommendations
        const recommendations = generateRecommendations(userRatings.data, itemSimilarities);

        setRecommendations(recommendations);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecommendations();
  }, [tokenUserId]);

  // Calculate item similarities
  const calculateItemSimilarities = (products) => {
    const itemSimilarities = {};

    for (const product of products) {
      const { _id, reviews } = product;
      itemSimilarities[_id] = {};

      for (const otherProduct of products) {
        const { _id: otherId, reviews: otherReviews } = otherProduct;

        if (_id !== otherId) {
          let numerator = 0;
          let denominator = 0;

          for (const review of reviews) {
            const { rating, user } = review;

            for (const otherReview of otherReviews) {
              if (otherReview.user === user) {
                const otherRating = otherReview.rating;

                numerator += rating * otherRating;
                denominator += otherRating;
                break;
              }
            }
          }

          itemSimilarities[_id][otherId] = denominator !== 0 ? numerator / denominator : 0;
        }
      }
    }

    return itemSimilarities;
  };

   // Generate recommendations
   const generateRecommendations = (userRatings, itemSimilarities) => {
    const recommendations = [];

    for (const rating of userRatings) {
      const { product, rating: userRating } = rating;
      const similarItems = itemSimilarities[product];

      for (const similarItem in similarItems) {
        if (similarItems.hasOwnProperty(similarItem)) {
          const similarity = similarItems[similarItem];

          if (similarity > 0) {
            const predictedRating = calculatePredictedRating(userRatings, similarItem, similarity);
            recommendations.push({ product: similarItem, predictedRating });
          }
        }
      }
    }

    // Sort recommendations by predicted rating
    recommendations.sort((a, b) => b.predictedRating - a.predictedRating);

    return recommendations;
  };

  // Calculate predicted rating for a particular item
  const calculatePredictedRating = (userRatings, item, similarity) => {
    let numerator = 0;
    let denominator = 0;

    for (const rating of userRatings) {
      const { product, rating: userRating } = rating;

      if (product === item) {
        numerator += userRating * similarity;
      }

      denominator += similarity;
    }

    return denominator !== 0 ? numerator / denominator : 0;
  };

  return (
    <div>
      <Search />
    {/* <h2>Recommendations</h2>
    <ul>
      {recommendations.map((recommendation) => (
        <li key={recommendation.product}>{recommendation.product}</li>
      ))}
    </ul> */}
    </div>
  )
}

export default Testing

