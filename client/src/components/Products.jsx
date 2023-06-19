import React, { useEffect, useState } from 'react';  
import Product from './Product';
import { Flex, Text } from '@chakra-ui/react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    margin-top: -130px;
`

const Products = ({cat,filter,sort}) => {

  const [ products, setProducts ] = useState([]);
  const [ filteredProducts, setFilteredProducts ] = useState([]); 

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get( cat ? `https://e-commerce-production-25ef.up.railway.app/product/all?category=${cat}` : "https://e-commerce-production-25ef.up.railway.app/product/all");
        setProducts(response.data);
      }catch(err) {
        console.log(err);
      }
    };
    getProducts();
  }, [cat])

  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filter).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
  }, [products, cat, filter, sort])

  useEffect(() => {
    const insertionSort = (arr) => {
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        let j = i;
        if (sort === "Newest") {
          while (j > 0 && arr[j - 1].createdAt < arr[j].createdAt) {
            swap(arr, j, j - 1);
            j--;
          }
        } else if (sort === "Asc") {
          while (j > 0 && arr[j - 1].price > arr[j].price) {
            swap(arr, j, j - 1);
            j--;
          }
        } else if (sort === "Desc") {
          while (j > 0 && arr[j - 1].price < arr[j].price) {
            swap(arr, j, j - 1);
            j--;
          }
        } else if (sort === "Rating") {
          while (
            j > 0 &&
            getSumRating(arr[j - 1].reviews) < getSumRating(arr[j].reviews)
          ) {
            swap(arr, j, j - 1);
            j--;
          }
        }
      }
      return arr;
    };
  
    const swap = (arr, i, j) => {
      const temp = arr[i]; 
      arr[i] = arr[j]; 
      arr[j] = temp; 
    };
  
    const getSumRating = (reviews) => {
      if (!reviews || reviews.length === 0) return 0;
  
      let sum = 0;
      for (let i = 0; i < reviews.length; i++) {
        sum += reviews[i].rating;
      }
      return sum;
    };
  
    setFilteredProducts((prev) => {
      const sortedProducts = insertionSort([...prev]);
      let filteredProducts;
      if (sort === "Rating") {
        filteredProducts = sortedProducts.filter(
          (product) => product.reviews.length > 0
        );
      } else {
        filteredProducts = sortedProducts;
      }
      return filteredProducts;
    });
  }, [sort]);
  


  // useEffect(() => {
  //   const insertionSort = (arr) => {
  //     const n = arr.length;
  //     for (let i = 1; i < n; i++) {
  //       let j = i;
  //       if (sort === "Newest") {
  //         while (j > 0 && arr[j - 1].createdAt < arr[j].createdAt) {
  //           swap(arr, j, j - 1);
  //           j--;
  //         }
  //       } else if (sort === "Asc") {
  //         while (j > 0 && arr[j - 1].price > arr[j].price) {
  //           swap(arr, j, j - 1);
  //           j--;
  //         }
  //       } else if (sort === "Desc") {
  //         while (j > 0 && arr[j - 1].price < arr[j].price) {
  //           swap(arr, j, j - 1);
  //           j--;
  //         }
  //       } else if (sort == "Rating") {
  //         while (
  //           j > 0 &&
  //           getAverageRating(arr[j - 1].reviews) < getAverageRating(arr[j].reviews)
  //         ) {
  //           swap(arr, j, j - 1);
  //           j--;
  //         }
  //       }
  //     }
  //     return arr;
  //   };
  
  //   const swap = (arr, i, j) => {
  //     const temp = arr[i];
  //     arr[i] = arr[j];
  //     arr[j] = temp;
  //   };
  
  //   const getAverageRating = (reviews) => {
  //     if (!reviews || reviews.length === 0) return 0;
  
  //     let sum = 0;
  //     for (let i = 0; i < reviews.length; i++) {
  //       sum += reviews[i].rating;
  //     }
  //     return sum / reviews.length;
  //   };
  
  //   setFilteredProducts((prev) => {
  //     const sortedProducts = insertionSort([...prev]);
  //     const filteredProducts = sortedProducts.filter(
  //       (product) => product.reviews.length > 0
  //     );
  //     return filteredProducts;
  //   });
  // }, [sort]);
  
  // useEffect(() => {
  //   const insertionSort = (arr) => {
  //     const n = arr.length;
  //     for (let i = 1; i < n; i++) {
  //       let j = i;
  //       if (sort === "Newest") {
  //         while (j > 0 && arr[j - 1].createdAt < arr[j].createdAt) {
  //           swap(arr, j, j - 1);
  //           j--;
  //         }
  //       } else if (sort === "Asc") {
  //         while (j > 0 && arr[j - 1].price > arr[j].price) {
  //           swap(arr, j, j - 1);
  //           j--;
  //         }
  //       } else if (sort === "Desc") {
  //         while (j > 0 && arr[j - 1].price < arr[j].price) {
  //           swap(arr, j, j - 1);
  //           j--;
  //         }
  //       } else {
  //         while (
  //           j > 0 &&
  //           getAverageRating(arr[j - 1].reviews) < getAverageRating(arr[j].reviews)
  //         ) {
  //           swap(arr, j, j - 1);
  //           j--;
  //         }
  //       }
  //     }
  //     return arr;
  //   };
  
  //   const swap = (arr, i, j) => {
  //     const temp = arr[i];
  //     arr[i] = arr[j];
  //     arr[j] = temp;
  //   };
  
  //   const getAverageRating = (reviews) => {
  //     if (!reviews || reviews.length === 0) return 0;
  
  //     let sum = 0;
  //     for (let i = 0; i < reviews.length; i++) {
  //       sum += reviews[i].rating;
  //     }
  //     console.log(sum / reviews.length, reviews)
  //     return sum / reviews.length;
  //   };
  
  //   setFilteredProducts((prev) => {
  //     const sortedProducts = insertionSort([...prev]);
  //     let filteredProducts;
  //     if (sort === "Rating") {
  //       filteredProducts = sortedProducts.filter(
  //         (product) => product.reviews.length > 0
  //       );
  //     } else {
  //       filteredProducts = sortedProducts;
  //     }
  //     return filteredProducts;
  //   });
  // }, [sort]);
  

  return (
    <Flex flexDirection="column" padding="30px" mt="-60px" >
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
        { cat 
        ? filteredProducts.map((item) => ( <Product item={item} key={item.id} />)) 
        : products.slice(0, 8).map((item) => ( <Product item={item} key={item.id} />))}
      </Flex>
    </Flex>
  )
}

export default Products