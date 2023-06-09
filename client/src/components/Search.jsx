import React, { useEffect, useState } from 'react';
import {
  Box,
  Input,
  Image,
  Badge,
  Flex,
  Tooltip,
  Icon,
  chakra,
  Select,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { publicRequest } from '../useFetch';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sort, setSort] = useState('Newest');
  const [categoryFilters, setCategoryFilters] = useState({
    automotive: false,
    others: false,
    construction: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const filterByCategory = (products) => {
    console.log(products)
      if (
        !categoryFilters.automotive &&
        !categoryFilters.others &&
        !categoryFilters.construction
      ) {
        return products; // Display all results when no category checkbox is checked
      }
  
      return products.filter((product) => {
        if (
          (categoryFilters.automotive && product.categories.includes('Automotive')) ||
          (categoryFilters.others && product.categories.includes('Others')) ||
          (categoryFilters.construction && product.categories.includes('Construction'))
        ) {
          return true;
        }
        return false;
      });
    };

    const sortProducts = (products) => {
      return products.sort((a, b) => {
        if (sort === 'Newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sort === 'Asc') {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    };

    let filteredResults = [...searchResults];
    if (Object.values(categoryFilters).some((value) => value)) {
      filteredResults = filterByCategory(filteredResults);
    }
    filteredResults = sortProducts(filteredResults);

    setSearchResults(filteredResults);
  }, [sort, categoryFilters]);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    try {
      if (term.length === 0) {
        setSearchResults([]);
      } else {
        const response = await publicRequest.get('/product/search', {
          params: { term },
        });

        setSearchResults(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProduct = (product) => {
    navigate(`/productSingle/${product._id}`);
  };

  const handleCategoryFilterChange = (category) => {
    setCategoryFilters((prevFilters) => ({
      ...prevFilters,
      [category]: !prevFilters[category],
    }));
  };

  return (
    <Box>
      <Flex justify="space-between" alignItems="center" padding="30px">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for products..."
          size="md"
        />
        <Select value={sort} onChange={(e) => setSort(e.target.value)} w="150px">
          <option value="Newest">Newest</option>
          <option value="Asc">Price (ASC)</option>
          <option value="Desc">Price (DESC)</option>
        </Select>
      </Flex>
      <Flex justify="center" mt={4}>
        <Checkbox
          isChecked={categoryFilters.automotive}
          onChange={() => handleCategoryFilterChange('automotive')}
          colorScheme="red"
          size="md"
          mr={2}
        >
          Automotive
        </Checkbox>
        <Checkbox
          isChecked={categoryFilters.others}
          onChange={() => handleCategoryFilterChange('others')}
          colorScheme="red"
          size="md"
          mr={2}
        >
          Others
        </Checkbox>
        <Checkbox
          isChecked={categoryFilters.construction}
          onChange={() => handleCategoryFilterChange('construction')}
          colorScheme="red"
          size="md"
        >
          Construction
        </Checkbox>
      </Flex>
      {searchResults.length > 0 && (
        <Flex flexWrap="wrap" justifyContent="center" mt={4}>
          {searchResults.map((product) => (
            <Box
              key={product._id}
              width="300px"
              borderWidth="1px"
              rounded="lg"
              shadow="lg"
              margin="10px"
              position="relative"
            >
              <Link to={`/productSingle/${product._id}`}>
                <Image
                  src={product.img}
                  alt={`Picture of`}
                  roundedTop="lg"
                  objectFit="cover"
                  height="250px"
                />
              </Link>

              <Box p="6">
                <Box alignItems="baseline">
                  <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                    {product.categories}
                  </Badge>
                </Box>
                <Flex mt="1" justifyContent="space-between" alignContent="center" flexDirection="column">
                  <Box
                    fontSize="2xl"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                  >
                    {product.title}
                  </Box>
                  <Box
                    fontSize="2xl"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                  >
                    <Text>$ {product.price}</Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default Search;
