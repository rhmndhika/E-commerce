import React, { useState, useEffect } from 'react'
import { Flex, Text, Select } from '@chakra-ui/react'
import styled from 'styled-components'
import Products from '../../components/Products'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer.tsx'
import Navbar from '../../components/Navbar.jsx'
import { useMediaQuery } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { publicRequest } from '../../useFetch'


const Container = styled.div`
`

const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
  width: 130px;
`

const ProductList = () => {

  const location = useLocation();
  const cat = location.pathname.split("/")[2]

  const [ filter, setFilter ] = useState({});
  const [ sort, setSort ] = useState("Newest");
  const [availableMaterials, setAvailableMaterials] = useState(new Set());

  
  const handleFilters = (e) => {
    const value = e.target.value
    setFilter({
      ...filter,
      [e.target.name]: value
    })

  }

  const deleteKey = () => {
   if (filter.materials === "All") {
    delete filter.materials   
   }
  }

  const [ isSmallerThan666 ] = useMediaQuery('(min-width: 800px)', {
    ssr: true,
    fallback: false, 
  })

  useEffect(() => {
    const getAllProduct = async () => {
        try{
            const response = await publicRequest.get("/product/all");
            const uniqueMaterials = new Set(response.data.map((product) => product.materials));
            setAvailableMaterials(uniqueMaterials);
        } catch (err) {
            console.log(err);
        } 
    }
    getAllProduct();
  }, [])

 
  return (
    <>
    <Navbar />
    <Flex flexDirection="column" justifyContent="center">
      <Text margin="20px" fontSize="35px" fontWeight="bold">{cat}</Text>
        { isSmallerThan666 ? 
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" margin="20px">
  
          <Flex flexDirection="row">
            <FilterText>Filter Products</FilterText>
             <Select name="materials" width="180px" mt="-3px" ml="5px" onChange={handleFilters}>
              <option value='All' onClick={deleteKey()}>All</option>
              {[...availableMaterials].map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </Select>
          </Flex>
           

          <Flex>
            <FilterText>Sort Products</FilterText>
            <Select width="140px" mt="-3px" ml="5px" onChange={e => setSort(e.target.value) }>
              <option value='Newest'>Newest</option>
              <option value='Asc'>Price (ASC)</option>
              <option value='Desc'>Price (DESC)</option>
              <option value='Rating'>Rating</option>
            </Select>
          </Flex>
        </Flex>
        :
        <Flex flexDirection="column" justifyContent="space-between" alignItems="center" margin="20px" width="0px 20px">
          <Flex flexDirection="row" alignSelf="flex-start">
            <FilterText>Filter Products</FilterText>
             <Select name="materials" placeholder='Material' width="140px" mt="-3px" ml="5px" onChange={handleFilters}>
              <option value='All' onClick={deleteKey()}>All</option>
              {[...availableMaterials].map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex alignSelf="flex-start" mt="20px">
            <FilterText>Sort Products</FilterText>
            <Select width="140px" mt="-3px" ml="5px" onChange={e => setSort(e.target.value) }>
              <option value='Newest'>Newest</option>
              <option value='Asc'>Price (ASC)</option>
              <option value='Desc'>Price (DESC)</option>
              <option value='Rating'>Rating</option>
            </Select>
          </Flex>
        </Flex>
        }
      <Flex padding="0 0 20px 20px">
        <Text>{}</Text>
      </Flex>
      <Products cat={cat} filter={filter} sort={sort} />
      <Newsletter />
      <Footer />
    </Flex>
    </>
  )
}

export default ProductList