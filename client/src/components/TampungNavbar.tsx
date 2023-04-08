import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton
} from '@chakra-ui/react'
import styled from 'styled-components';
import { MoonIcon, SunIcon, BellIcon, SearchIcon } from '@chakra-ui/icons'
import { BsFillCartFill } from 'react-icons/bs'

const Container = styled.div`
`

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);



export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box backgroundColor={'white'} px={4} shadow="md">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <a href="/">
              E-Commerce
            </a>
          </Box>

          <Flex>
            <InputGroup margin="10px">
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color='black.300' />}/>
            <Input border="1px solid" textColor="black.300" width="150px" height="40px" type='text' placeholder='Cari di toko.....' />
            </InputGroup>
          </Flex>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
             
              <IconButton aria-label='Notification' icon={<BsFillCartFill />} />
             
              <Flex>
                <a href="/signup">
                  <Button mr="20px" variant="outline" colorScheme='teal'>Register</Button>
                </a>
                <a href="/signin">
                <Button variant="solid" colorScheme='teal'>Login</Button>
                </a>
              </Flex>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}