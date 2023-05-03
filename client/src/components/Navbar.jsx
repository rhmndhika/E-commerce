import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Avatar,
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
  Text,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { BsFillCartFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../redux/userRedux';
import { cartQuantitySelector } from '../redux/cartRedux';
import Cookies from 'js-cookie';


export default function Nav() {

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ Carts, setCarts ] = useState([]);

  const user = useSelector((state) => state.user.currentUser);

  //*
  const cartQuantity = useSelector(cartQuantitySelector);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('token');
    navigate("/");
  }
  
  return (
    <>
      <Box bg={useColorModeValue('white', 'gray.800')} color={useColorModeValue('gray.600', 'white')} px={4} shadow={'md'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box as='a' href="/">Logo</Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              { user ?
              <a href={`/cart/${user._id}`}>
              <Button>
                <BsFillCartFill />
                  {/* <Text>{cartQuantity}</Text> */}
              </Button>
              </a>
              :
              null
              }
              { user ? 
              // <p onClick={handleLogout}>{user.username}</p>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{user.username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <Link to={`/user/profile/${user._id}`}>
                    <MenuItem>Account Settings</MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
              :
              <Flex>
                <Button
                  as={'a'}
                  fontSize={'sm'}
                  fontWeight={400}
                  mr={'5'}
                  variant={'outline'}
                  colorScheme='pink'
                  href={'/signin'}>
                  Sign In
                </Button>
                <Button
                  as={'a'}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'pink.400'}
                  href={'/signup'}
                  _hover={{
                    bg: 'pink.300',
                  }}>
                  Sign Up
                </Button>
              </Flex>
              }
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
