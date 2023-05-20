import React, { ReactNode, useEffect, useState } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
} from 'react-icons/fi';
import {
  IoStorefrontOutline
} from 'react-icons/io5';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GrTransaction
} from 'react-icons/gr';
import {
  BiDollar
} from 'react-icons/bi';
import Cookies from 'js-cookie';
import { userRequest } from '../../useFetch';
import {
  MdOutlineRateReview
} from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/userRedux';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: String;
}

// const LinkItems: Array<LinkItemProps> = [
//   { 
//     name: 'Home', 
//     icon: FiHome, 
//     href: '/home'  
//   },
//   { 
//     name: 'User', 
//     icon: FiUser,  
//     href: '/userList'
//   },
//   { 
//     name: 'Product', 
//     icon: IoStorefrontOutline,  
//     href: '/productList'
//    },
//   { 
//     name: 'Events', 
//     icon: FiCalendar, 
//     href: '/login' , 
//     children: [
//       {
//         name: 'Vendor Registration',
//         icon: FiHash,
//         href: '/registrationhistory'
//       },
//   ]},
//   { 
//     name: 'Settings', 
//     icon: FiSettings,
//     href: '/login' 
//     },
// ];
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/home' },
  { name: 'User', icon: FiUser, href: '/userList' },
  { name: 'Product', icon: IoStorefrontOutline, href: '/productList' },
  { name: 'Transaction', icon: BiDollar, href: '/transactionList' },
  { name: 'Review', icon: MdOutlineRateReview, href: '/reviewList' },
  // { name: 'Settings', icon: FiSettings, href: '/favorites' },
];


export default function Sidebar({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    // <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" cursor="pointer">
          Admin Panel
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};


interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  href: String;
}

const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  return (
    <NavLink to={href.toString()} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </NavLink>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface FetchedUserProfile {
  _id: String;
  available: String;
  createdAt: String;
  dateOfBirth: String;
  email: String;
  fullname: String;
  gender: String;
  img: string;
  phoneNumber: String;
  updatedAt: String;
  userId: {
    createdAt: String;
    email: String;
    isAdmin: Boolean;
    password: String;
    updatedAt: String;
    username: String;
    __v: Number;
    _id: String;
  };
  __v: number;
}


const MobileNav = ({ onOpen, ...rest }: MobileProps) => {

  const token = Cookies.get('token');
  const tokenUserId = Cookies.get('userId');
  const [userProfile, setUserProfile] = useState<FetchedUserProfile[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await userRequest.get(`/profile/${tokenUserId}`);
        setUserProfile(response.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    getUserProfile();
  }, []);
  
  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('token');
    Cookies.remove('userId');
    Cookies.remove('username');
    Cookies.remove('email');
    navigate("/", { replace : true });
  }



  return (
    <>
    {userProfile.map((item) => {
      return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        cursor="pointer"
        fontWeight="bold">
        Admin Panel
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
               <Avatar
                  size={'sm'}
                  src={item.img}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{item.userId.username}</Text>
                  {item.userId.isAdmin === true ?
                    <Text fontSize="xs" color="gray.600">
                      Admin
                    </Text>
                    :
                    <Text fontSize="xs" color="gray.600">
                      User
                    </Text>
                  }
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              {/* <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider /> */}
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
    )
    })}
    </>
  );
};
// import React, { ReactNode } from 'react';
// import {
//   IconButton,
//   Avatar,
//   Box,
//   CloseButton,
//   Flex,
//   HStack,
//   VStack,
//   Icon,
//   useColorModeValue,
//   Link,
//   Drawer,
//   DrawerContent,
//   Text,
//   useDisclosure,
//   BoxProps,
//   FlexProps,
//   Menu,
//   MenuButton,
//   MenuDivider,
//   MenuItem,
//   MenuList,
// } from '@chakra-ui/react';
// import {
//   FiHome,
//   FiTrendingUp,
//   FiCompass,
//   FiStar,
//   FiSettings,
//   FiMenu,
//   FiBell,
//   FiChevronDown,
//   FiUser,
//   FiCalendar,
//   FiHash,
// } from 'react-icons/fi';
// import {
//   IoStorefrontOutline
// } from 'react-icons/io5';
// import { IconType } from 'react-icons';
// import { ReactText } from 'react';


// interface LinkItemProps {
//   name: string;
//   icon: IconType;
//   children?: Array<LinkItemProps>;
//   href: string
// }

// const LinkItems: Array<LinkItemProps> = [
//   { 
//     name: 'Home', 
//     icon: FiHome, 
//     href: '/home'  
//   },
//   { 
//     name: 'User', 
//     icon: FiUser,  
//     href: '/userList'
//   },
//   { 
//     name: 'Product', 
//     icon: IoStorefrontOutline,  
//     href: '/productList'
//    },
//   { 
//     name: 'Events', 
//     icon: FiCalendar, 
//     href: '/login' , 
//     children: [
//       {
//         name: 'Vendor Registration',
//         icon: FiHash,
//         href: '/registrationhistory'
//       },
//   ]},
//   { 
//     name: 'Settings', 
//     icon: FiSettings,
//     href: '/login' 
//     },
// ];


// export default function Sidebar({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   return (
//     <Box minH="100vh" >
//       <SidebarContent
//         onClose={() => onClose}
//         display={{ base: 'none', md: 'block' }}
//       />
//       <Drawer
//         autoFocus={false}
//         isOpen={isOpen}
//         placement="left"
//         onClose={onClose}
//         returnFocusOnClose={false}
//         onOverlayClick={onClose}
//         size="full">
//         <DrawerContent>
//           <SidebarContent onClose={onClose} />
//         </DrawerContent>
//       </Drawer>
//       {/* mobilenav */}
//       <MobileNav onOpen={onOpen} />
//       <Box ml={{ base: 0, md: 60 }} p="4">
//         {children}
//       </Box>
//     </Box>
//   );
// }

// interface SidebarProps extends BoxProps {
//   onClose: () => void;
// }
// const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
//   return (
//     <Box
//       transition="3s ease"
//       // bg={useColorModeValue('white', 'gray.900')}
//       bg={useColorModeValue('gray.100', 'gray.900')}
//       borderRight="1px"
//       borderRightColor={useColorModeValue('gray.200', 'gray.700')}
//       w={{ base: 'full', md: 60 }}
//       pos="fixed"
//       h="full"
//       {...rest}>
//       <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
//         <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
//           Logo
//         </Text>
//         <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
//       </Flex>
//       {LinkItems.map((link) => (
//       <Box key={link.name}>
//         <Link href={link.href}>
//           <NavItem icon={link.icon}>{link.name}</NavItem>
//         </Link>
//         {link.children && (
//           <Flex align="start" ml={8} flexDirection="column">
//             {link.children.map((child) => (
//               <Link key={child.name} href={child.href}>
//                 {child.name}
//               </Link>
//             ))}
//           </Flex>
//         )}
//       </Box>
//     ))}
//     </Box>
//   );
// };


// interface NavItemProps extends FlexProps {
//   icon: IconType;
//   children: ReactText;
// };

// const NavItem = ({ icon, children }: { icon: IconType; children: string }) => (
//   <Flex align="center" p={2}>
//     {icon && <Box as={icon} mr={2} />}
//     <Text>{children}</Text>
//   </Flex>
// );

// interface MobileProps extends FlexProps {
//   onOpen: () => void;
// }
// const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
//   return (
//     <Flex
//       ml={{ base: 0, md: 60 }}
//       px={{ base: 4, md: 4 }}
//       height="20"
//       alignItems="center"
//       bg={useColorModeValue('gray.100', 'gray.900')}
//       borderBottomWidth="1px"
//       borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
//       justifyContent={{ base: 'space-between', md: 'flex-end' }}
//       {...rest}>
//       <IconButton
//         display={{ base: 'flex', md: 'none' }}
//         onClick={onOpen}
//         variant="outline"
//         aria-label="open menu"
//         icon={<FiMenu />}
//       />

//       <Text
//         display={{ base: 'flex', md: 'none' }}
//         fontSize="2xl"
//         fontFamily="monospace"
//         fontWeight="bold">
//         Logo
//       </Text>

//       <HStack spacing={{ base: '0', md: '6' }}>
//         <IconButton
//           size="lg"
//           variant="ghost"
//           aria-label="open menu"
//           icon={<FiBell />}
//         />
//         <Flex alignItems={'center'}>
//           <Menu>
//             <MenuButton
//               py={2}
//               transition="all 0.3s"
//               _focus={{ boxShadow: 'none' }}>
//               <HStack>
//                 <Avatar
//                   size={'sm'}
//                   src={
//                     'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
//                   }
//                 />
//                 <VStack
//                   display={{ base: 'none', md: 'flex' }}
//                   alignItems="flex-start"
//                   spacing="1px"
//                   ml="2">
//                   <Text fontSize="sm">Justina Clark</Text>
//                   <Text fontSize="xs" color="gray.600">
//                     Admin
//                   </Text>
//                 </VStack>
//                 <Box display={{ base: 'none', md: 'flex' }}>
//                   <FiChevronDown />
//                 </Box>
//               </HStack>
//             </MenuButton>
//             <MenuList
//               bg={useColorModeValue('white', 'gray.900')}
//               borderColor={useColorModeValue('gray.200', 'gray.700')}>
//               <MenuItem>Profile</MenuItem>
//               <MenuItem>Settings</MenuItem>
//               <MenuItem>Billing</MenuItem>
//               <MenuDivider />
//               <MenuItem>Sign out</MenuItem>
//             </MenuList>
//           </Menu>
//         </Flex>
//       </HStack>
//     </Flex>
//   );
// };