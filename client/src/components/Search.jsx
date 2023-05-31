import React, { useState } from 'react';
import { Flex, Input, List, ListItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../useFetch';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    try {
      if (term.length === 0) {
        setSuggestions([]); // Clear suggestions if search term is empty
      } else {
        const response = await publicRequest.get('/product/autocomplete', {
          params: { term },
        });

        setSuggestions(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProduct = (product) => {
    navigate(`/productSingle/${product._id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelectProduct(suggestions[0]); // Navigate to the first suggestion when pressing Enter
    }
  };

  return (
    <div>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onKeyPress={handleKeyPress}
        placeholder="Search for products..."
        size="md"
      />
      {suggestions.length > 0 && (
        <List mt={2} maxH="200px" overflowY="scroll" bg="white" boxShadow="md" rounded="md">
          {suggestions.map((product) => (
            <ListItem
              key={product._id}
              p={2}
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              onClick={() => handleSelectProduct(product)}
            >
              {product.title}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Search;
