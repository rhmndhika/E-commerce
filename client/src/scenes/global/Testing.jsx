import { HStack, IconButton, Text } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Testing = () => {

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleRatingClick = (value) => {
        setRating(value);
    };

  return (
    <HStack spacing="1">
      {[...Array(5)].map((_, i) => (
        <IconButton
          key={i}
          icon={<StarIcon color={i < rating ? "yellow.500" : "gray.200"} />}
          aria-label={`rating ${i}`}
          onClick={() => handleRatingClick(i + 1)}
        />
      ))}
      <Text>{rating} out of 5 stars</Text>
    </HStack>
  )
}

export default Testing

