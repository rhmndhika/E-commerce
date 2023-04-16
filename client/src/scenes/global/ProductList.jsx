import { Flex, Text, Select } from '@chakra-ui/react'
import React, { useState } from 'react'
import styled from 'styled-components'
import Products from '../../components/Products'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer.tsx'
import Navbar from '../../components/Navbar.tsx'
import { useMediaQuery } from '@chakra-ui/react'
import { mobile, isMobile } from '../../reponsive'
import { useLocation } from 'react-router-dom'

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


  const handleFilters = (e) => {
    const value = e.target.value
    setFilter({
      ...filter,
      [e.target.name]: value
    })

  }

  const deleteKey = () => {
   if (filter.materials === "Material") {
    delete filter.materials   
   }
  }

  const [ isSmallerThan666 ] = useMediaQuery('(min-width: 800px)', {
    ssr: true,
    fallback: false, 
  })

  return (
    <>
    <Navbar />
    <Flex flexDirection="column" justifyContent="center">
      <Text margin="20px" fontSize="35px" fontWeight="bold">{cat}</Text>
        { isSmallerThan666 ? 
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" margin="20px">
          <Flex flexDirection="row">
            <FilterText>Filter Products</FilterText>
         
            <Select name="categories" width="140px" mt="-3px" ml="5px" onChange={handleFilters}>
              <option value='SC' selected>All</option> :
              <option value='Automotive'>Automotive</option>
              <option value='Construction'>Construction</option>
              <option value='Health'>Health</option>
            </Select>
       
            { filter.categories === "Automotive" ? 
            <Select name="materials" width="140px" mt="-3px" ml="5px" onChange={handleFilters}>
              <option value='Material' onClick={deleteKey()}>Material</option>
              <option value='Rubber'>Rubber</option>
              <option value='Metal'>Metal</option>
              <option value='Plastic'>Plastic</option>
              <option value='Polyurethane'>Polyurethane</option>
            </Select>
            :
            null
            }
          </Flex>

          <Flex>
            <FilterText>Sort Products</FilterText>
            <Select width="110px" mt="-3px" ml="5px" onChange={e => setSort(e.target.value) }>
              <option value='Newest'>Newest</option>
              <option value='Asc'>Price (ASC)</option>
              <option value='Desc'>Price (DESC)</option>
            </Select>
          </Flex>
        </Flex>

        :
        <Flex flexDirection="column" justifyContent="space-between" alignItems="center" margin="20px" width="0px 20px">
          <Flex flexDirection="row" alignSelf="flex-start">
            <FilterText>Filter Products</FilterText>
          
            <Select name="categories" width="140px" mt="-3px" ml="5px" onChange={handleFilters}>
              <option value='SC' selected>All</option> :
              <option value='Automotive'>Automotive</option>
              <option value='Construction'>Construction</option>
              <option value='Health'>Health</option>
            </Select>
          
             <Select name="materials" placeholder='Material' width="140px" mt="-3px" ml="5px" onChange={handleFilters}>
              <option value='Rubber'>Rubber</option>
              <option value='Metal'>Metal</option>
              <option value='Plastic'>Plastic</option>
              <option value='Polyurethane'>Polyurethane</option>
            </Select>
          </Flex>

          <Flex alignSelf="flex-start" mt="20px">
            <FilterText>Sort Products</FilterText>
            <Select width="140px" mt="-3px" ml="5px" onChange={e => setSort(e.target.value) }>
              <option value='Newest'>Newest</option>
              <option value='Asc'>Price (ASC)</option>
              <option value='Desc'>Price (DESC)</option>
            </Select>
          </Flex>
        </Flex>
        }
      <Products cat={cat} filter={filter} sort={sort} />
      <Newsletter />
      <Footer />
    </Flex>
    </>
  )
}

export default ProductList