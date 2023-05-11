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
  IconButton,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { BsFillCartFill, BsFillHeartFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../redux/userRedux';
import { cartQuantitySelector } from '../redux/cartRedux';
import Cookies from 'js-cookie';
import { BiHeart } from 'react-icons/bi';
import { userMethod } from '../useFetch';


export default function Nav() {

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ Carts, setCarts ] = useState([]);
  const [ userProfile, setUserProfile ] = useState([]);
  const token = Cookies.get('token');
  const tokenId = Cookies.get('userId');
  const tokenUsername = Cookies.get('username');

  const user = useSelector((state) => state.user.currentUser);

  //*
  const cartQuantity = useSelector(cartQuantitySelector);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('token');
    Cookies.remove('userId');
    Cookies.remove('username');
    navigate("/", { replace : true });
  }

  useEffect(() => {
    const getUserProfile = async () => {
        try{
            const response = await userMethod.get(`/profile/${user._id}`);
            setUserProfile(response.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserProfile();
  }, [])

  

  return (
    <>
      <Box bg={useColorModeValue('white', 'gray.800')} color={useColorModeValue('gray.600', 'white')} px={4} shadow={'md'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box as='a' href="/">Bumi Baureksa Pratama</Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              { user || token || tokenId || tokenUsername ?
              <Flex gap="10px">
                <a href={`/cart/${tokenId}`}>
                <IconButton
                  icon={<BsFillCartFill />}
                  />
                </a>
                <a href={`/user/wishlist/${tokenId}`}>
                <IconButton
                  icon={<BsFillHeartFill />}
                  />
                </a>
              </Flex>              
              :
              null
              }
              { user || token || tokenId || tokenUsername ? 
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
                    src={userProfile.img}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={userProfile.img}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{tokenUsername}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <Link to={`/user/profile/${tokenId}`}>
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
