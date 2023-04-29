import React, { useEffect, useState } from 'react';
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
    InputRightElement
  } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { login } from '../redux/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
  
  export default function SignIn() {

    axios.defaults.withCredentials = true;

    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
 
    const dispatch = useDispatch();
    const { isFetching, error } = useSelector(state=> state.user);

    axios.defaults.withCredentials = true;


    const handleLogin = (e) => {
      e.preventDefault();
      login(dispatch, { username, password});
    }
    
    return (
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
              {/* <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" value={email} onChange={(e)=> {
                    setEmail(e.target.value)
                }} />
              </FormControl> */}
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
                  <Checkbox>Remember me</Checkbox>
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
                <Text color="red">Something went wrong</Text>
                }
              </Stack>
            </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }