import React, { useState } from 'react';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    InputGroup,
    InputRightElement,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
  } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { login } from '../redux/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { setModal } from '../redux/global';
import { publicRequest, userMethod } from '../useFetch';
  
export default function SignIn() {

    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    
    const { isOpen, onOpen, onClose } = useDisclosure()   
    const [ emailReset, setEmailReset ] = useState('');
    const [ errMessage, setErrMessage ] = useState('');

    const modalValue = useSelector((state) => state.global.modal);
    const message = useSelector((state) => state.global.error);

    const notify = () => toast.success("Logging In", {
      position: toast.POSITION.TOP_RIGHT
    });
 
    const dispatch = useDispatch();
    const { isFetching, error } = useSelector(state=> state.user);

    const handleLogin = async (e) => {
      e.preventDefault();
      
      dispatch(setModal(true));
      // if (modalValue && username && password && message === "") {
      //   notify();
      // } 
      
      login(dispatch, { username, password }, notify);
    }

    const handleInitiateReset = async (e) => {
      e.preventDefault();
  
      try {
        const response = await publicRequest.post('/initiate-password-reset', { email: emailReset });
  
        if (response.status === 200) {
          setErrMessage('Password reset email sent');
        }
      } catch (error) {
        console.log(error);
          setErrMessage(error.response.data.message);
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
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <ToastContainer />
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
            <form>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="username" name="username" value={username} onChange={(e)=> {
                    setUsername(e.target.value)
                }} />
              </FormControl>
               <FormControl id="password" isRequired pb={5}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={(e) => {
                  setPassword(e.target.value)
                }} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
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
                  <Link onClick={onOpen} color={'red.400'}>Forgot Password</Link>
                  <Link href="/signup" color={'blue.400'}>SignUp</Link>
                </Stack>
                <Button
                  type='submit'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  _disabled={{
                    bg : "black.100",
                    cursor: "not-allowed"
                  }}
                  onClick={handleLogin}
                  disabled={isFetching}>
                  Sign in
                </Button>
                {error &&
                <Text color="red">{message}</Text>
                }
              </Stack>
            </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
    );
  }