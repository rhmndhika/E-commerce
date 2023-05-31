import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/apiCall';
import { Link } from "react-router-dom";
import { publicRequest } from '../../useFetch';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Login() {

  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isOpenModalInfo, 
    onOpen: onOpenModalInfo, 
    onClose: onCloseModalInfo 
  } = useDisclosure();
  const [ emailReset, setEmailReset ] = useState('');
  const [ errMessage, setErrMessage ] = useState('');
  const [ linkInfo, setLinkInfo ] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login(dispatch, { username, password }, toast);
  }

  const handleInitiateReset = async (e) => {
    e.preventDefault();

    try {
      const response = await publicRequest.post('/initiate-password-reset', { email: emailReset }).then((res) => {
        alert("Please Reset Password With This Link : " + res?.data)
        // onOpenModalInfo();
        setErrMessage('Password reset email sent');
      })

    } catch (error) {
      console.log(error);
        setErrMessage(error.response?.data.message);
    }
  };
  
  return (
    <>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleInitiateReset}>
          <ModalBody pb={6}>
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              id="email"
              value={emailReset}
              onChange={(e) => setEmailReset(e.target.value)}
              required
            />
          {errMessage && <Text mt="10px">{errMessage}</Text>}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} type='submit'>
              Send Reset Email
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
          </form>
        </ModalContent>
    </Modal>
    <Modal isOpen={isOpenModalInfo} onClose={onCloseModalInfo}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseModalInfo}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
    </Modal> 
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <form onSubmit={handleLogin}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Username</FormLabel>
              <Input type="text" onChange={(e) => {
            setUsername(e.target.value)}} isRequired required/>
            </FormControl>
            {/* <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" onChange={(e) => {
            setPassword(e.target.value)}} isRequired required />
            </FormControl> */}
            <FormControl id="password" isRequired pb={5}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Link to="/register" color={'blue.400'}>
                  Create Account
                </Link>
                <Link onClick={onOpen} color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                type='submit'
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </form>
      </Stack>
    </Flex>
    </>
  );
}
