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
        const response = await axios.get( cat ? `http://localhost:5000/product/all?category=${cat}` : "http://localhost:5000/product/all");
        setProducts(response.data);
      }catch(err) {

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
  }, [products, cat, filter])

  // useEffect(() => {
  //   if (sort === "Newest") {
  //     setFilteredProducts((prev) =>
  //       [...prev].sort((a, b) => a.createdAt - b.createdAt)
  //     );
  //   } else if (sort === "Asc") {
  //     setFilteredProducts((prev) =>
  //       [...prev].sort((a, b) => a.price - b.price)
  //     );
  //   } else {
  //     setFilteredProducts((prev) =>
  //       [...prev].sort((a, b) => b.price - a.price)
  //     );
  //   }
  // }, [sort]);

  // useEffect(() => {
  //   const bubbleSort = (arr) => {
  //     const n = arr.length;
  //     for (let i = 0; i < n - 1; i++) {
  //       for (let j = 0; j < n - i - 1; j++) {
  //         if (arr[j].createdAt > arr[j + 1].createdAt) {
  //           // Swap arr[j] and arr[j+1]
  //           const temp = arr[j];
  //           arr[j] = arr[j + 1];
  //           arr[j + 1] = temp;
  //         }
  //       }
  //     }
  //     return arr;
  //   };
  
  //   if (sort === "Newest") {
  //     setFilteredProducts((prev) => bubbleSort([...prev]));
  //   } else if (sort === "Asc") {
  //     setFilteredProducts((prev) => bubbleSort([...prev]).sort((a, b) => a.price - b.price));
  //   } else {
  //     setFilteredProducts((prev) => bubbleSort([...prev]).sort((a, b) => b.price - a.price));
  //   }
  // }, [sort]);

  // useEffect(() => {
  //   const selectionSort = (arr) => {
  //     const n = arr.length;
  //     for (let i = 0; i < n - 1; i++) {
  //       let minIndex = i;
  //       for (let j = i + 1; j < n; j++) {
  //         if (sort === "Newest") {
  //           if (arr[j].createdAt < arr[minIndex].createdAt) {
  //             minIndex = j;
  //           }
  //         } else if (sort === "Asc") {
  //           if (arr[j].price < arr[minIndex].price) {
  //             minIndex = j;
  //           }
  //         } else {
  //           if (arr[j].price > arr[minIndex].price) {
  //             minIndex = j;
  //           }
  //         }
  //       }
  //       const temp = arr[i];
  //       arr[i] = arr[minIndex];
  //       arr[minIndex] = temp;
  //     }
  //     return arr;
  //   };
  
  //   setFilteredProducts((prev) => selectionSort([...prev]));
  // }, [sort]);
  
  // useEffect(() => {
  //   const mergeSort = (arr) => {
  //     if (arr.length <= 1) {
  //       return arr;
  //     }
  
  //     const mid = Math.floor(arr.length / 2);
  //     const left = arr.slice(0, mid);
  //     const right = arr.slice(mid);
  
  //     const merge = (left, right) => {
  //       const sortedArr = [];
  //       let leftIndex = 0;
  //       let rightIndex = 0;
  
  //       while (leftIndex < left.length && rightIndex < right.length) {
  //         if (sort === "Newest") {
  //           if (left[leftIndex].createdAt <= right[rightIndex].createdAt) {
  //             sortedArr.push(left[leftIndex]);
  //             leftIndex++;
  //           } else {
  //             sortedArr.push(right[rightIndex]);
  //             rightIndex++;
  //           }
  //         } else if (sort === "Asc") {
  //           if (left[leftIndex].price <= right[rightIndex].price) {
  //             sortedArr.push(left[leftIndex]);
  //             leftIndex++;
  //           } else {
  //             sortedArr.push(right[rightIndex]);
  //             rightIndex++;
  //           }
  //         } else {
  //           if (left[leftIndex].price >= right[rightIndex].price) {
  //             sortedArr.push(left[leftIndex]);
  //             leftIndex++;
  //           } else {
  //             sortedArr.push(right[rightIndex]);
  //             rightIndex++;
  //           }
  //         }
  //       }
  
  //       while (leftIndex < left.length) {
  //         sortedArr.push(left[leftIndex]);
  //         leftIndex++;
  //       }
  
  //       while (rightIndex < right.length) {
  //         sortedArr.push(right[rightIndex]);
  //         rightIndex++;
  //       }
  
  //       return sortedArr;
  //     };
  
  //     const sortedLeft = mergeSort(left);
  //     const sortedRight = mergeSort(right);
  //     return merge(sortedLeft, sortedRight);
  //   };
  
  //   setFilteredProducts((prev) => mergeSort([...prev]));
  // }, [sort]);
  
  useEffect(() => {
    const insertionSort = (arr) => {
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        let j = i;
        if (sort === "Newest") {
          while (j > 0 && arr[j - 1].createdAt < arr[j].createdAt) {
            // Swap arr[j] and arr[j-1]
            const temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;
            j--;
          }
        } else if (sort === "Asc") {
          while (j > 0 && arr[j - 1].price > arr[j].price) {
            // Swap arr[j] and arr[j-1]
            const temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;
            j--;
          }
        } else {
          while (j > 0 && arr[j - 1].price < arr[j].price) {
            // Swap arr[j] and arr[j-1]
            const temp = arr[j];
            arr[j] = arr[j - 1];
            arr[j - 1] = temp;
            j--;
          }
        }
      }
      return arr;
    };
  
    setFilteredProducts((prev) => insertionSort([...prev]));
  }, [sort]);
  

  return (
    <Flex flexDirection="column" padding="30px" mt="-60px">
      <Flex flexWrap="wrap">
        { cat 
        ? filteredProducts.map((item) => ( <Product item={item} key={item.id} />)) 
        : products.slice(0, 8).map((item) => ( <Product item={item} key={item.id} />))}
      </Flex>
    </Flex>
  )
}

export default Products