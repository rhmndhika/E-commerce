import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select
} from '@chakra-ui/react';
import { userMethod } from '../useFetch'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Welcome() {

  const user = useSelector((state) => state.user.currentUser);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ show, setShow ] = useState(false);
  const [ inputs, setInputs ] = useState({
    fullname: "",
    dateOfBirth: "",
    gender: "",
    available: ""
  });

  const [ file, setFile ] = useState(null);
  const [ userProfile, setUserProfile ] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }


  const handleClick = async (e) => {
    e.preventDefault();
    try{
        await userMethod.post("profile/create", {
          userId : user._id,
          fullname : inputs.fullname,
          dateOfBirth : inputs.dateOfBirth,
          gender : inputs.gender,
          available: inputs.available,
          company : inputs.company,
        });
        setShow(true);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
    } catch (err) {
        console.log(err);
    } 
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
  }, [user._id])



  return (
    <>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered> 
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Nama</FormLabel>
              <Input name="fullname" type='name' placeholder='Nama' onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Tanggal Lahir</FormLabel>
              <Input name="dateOfBirth" type='date' placeholder='Tanggal Lahir' onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Select name="gender" placeholder='Jenis Kelamin' onChange={handleChange}>
                <option value='Laki-laki'>Laki-laki</option>
                <option value='Perempuan'>Perempuan</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Untuk Perusahaan ?</FormLabel>
              <Select name="available" placeholder='Pilih..' onChange={handleChange}>
                <option value='Yes'>Ya</option>
                <option value='No'>Tidak</option>
              </Select>
            </FormControl>
            
            { inputs.available === "Yes"  ?
            <FormControl isRequired>
              <FormLabel>Perusahaan</FormLabel>
              <Input name="company" type='text' placeholder='Perusahaan' onChange={handleChange} />
            </FormControl>
            :
            null
            }
          </ModalBody>

          <ModalFooter>
            { Object.values(inputs).some((value) => value === null || value === undefined || value === "") ? 
            <Button type="submit" colorScheme='teal' mr={3} isDisabled>
              Save
            </Button>
            :
            <>
            { show ?
              <Button type="submit" colorScheme='teal' mr={3} onClick={handleClick} isLoading loadingText='Saving'>
                Save
              </Button>
              :
              <Button type="submit" colorScheme='teal' mr={3} onClick={handleClick}>
                Save
              </Button>
            }
            </>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Welcome to <br />
            <Text as={'span'} color={'green.400'}>
            Bumi Baureksa Pratama
            </Text>
          </Heading>
          <Text color={'gray.500'}>
          PT Bumi Baureksa Pratama (PT BBP) is Producers of Speciality Chemicals. Our success is primarily based on customising client
          requirements to create true commercial value for the client.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            { userProfile === null || userProfile.length <= 0  ?
            <Button
              colorScheme={'green'}
              bg={'green.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'green.500',
              }}
              onClick={onOpen}>
              Create Profile
            </Button>
            :
            <Button
              colorScheme={'green'}
              bg={'green.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'green.500',
              }}
              as="a"
              href="/">
              Continue
            </Button>
            }
            <Button  variant={'link'} colorScheme={'blue'} size={'sm'}>
              Learn more
            </Button>
            <Box>
              <Icon
                as={Arrow}
                color={useColorModeValue('gray.800', 'gray.300')}
                w={71}
                position={'absolute'}
                right={-71}
                top={'10px'}
              />
              { userProfile === null ||  userProfile.length <= 0 ?
              <Text
                fontSize={'lg'}
                fontFamily={'Caveat'}
                position={'absolute'}
                right={'-125px'}
                top={'-15px'}
                transform={'rotate(10deg)'}>
                Create Profile First 
              </Text>
              :
              <Text
                fontSize={'lg'}
                fontFamily={'Caveat'}
                position={'absolute'}
                right={'-125px'}
                top={'-15px'}
                transform={'rotate(10deg)'}>
                Go to Homepage
              </Text>
              }
            </Box>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
});