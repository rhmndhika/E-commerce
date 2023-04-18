import React from 'react';
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
import { Link } from 'react-router-dom'
import { logout } from '../redux/userRedux';


// const NavLink = ({ children }: { children: ReactNode }) => (
//   <Link
//     px={2}
//     py={1}
//     rounded={'md'}
//     _hover={{
//       textDecoration: 'none',
//       bg: useColorModeValue('gray.200', 'gray.700'),
//     }}
//     href={'#'}>
//     {children}
//   </Link>
// );

export default function Nav() {

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const quantity = useSelector(state=>state.cart.quantity);

  const user = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }

  
  return (
    <>
      <Box bg={useColorModeValue('white', 'gray.800')} color={useColorModeValue('gray.600', 'white')} px={4} shadow={'md'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box as='a' href="/">Logo</Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Link to="/cart">
              <Button>
                {/* {colorMode === 'light' ? <MoonIcon /> : <SunIcon />} */}
                <BsFillCartFill />
                <Text>{quantity}</Text>
              </Button>
              </Link>

              { user ? 
              <p onClick={handleLogout}>{user.username}</p>
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
