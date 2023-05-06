import React, { useState, useEffect } from 'react'
import { 
  Avatar,
  Container,
  Flex,
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Card, 
  CardBody, 
  Image,
  Stack,
  Heading,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { userMethod } from '../useFetch';
import { useParams } from 'react-router';
import ModalNew  from './ModalNew';

const Profile = () => {

  const { 
    isOpen: isOpenModalName, 
    onOpen: onOpenModalName, 
    onClose: onCloseModalName 
  } = useDisclosure();

  const { 
    isOpen: isOpenModalDate, 
    onOpen: onOpenModalDate, 
    onClose: onCloseModalDate 
  } = useDisclosure();

 

  const [ inputs, setInputs ] = useState({});
  const [ userProfile, setUserProfile ] = useState(null);
  const { id } = useParams();


  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  

  const updateUserProfile = async () => {
    try{
      const response = await userMethod.put(`/profile/update/${id}`);
      setUserProfile(response.data);
    } catch (err) {
      console.log(err);
    } 
  }

  return (
    <div>
      <ModalNew isOpen={isOpenModalName} onOpen={onOpenModalName} onClose={onCloseModalName} id="Nama">
      <Text>Kamu hanya dapat mengubah nama 1 kali lagi. Pastikan nama sudah benar.</Text>
          <FormControl mt="10px">
            <FormLabel>Nama</FormLabel>
            <Input type='name' placeholder='Rahmandhika' />
            <FormHelperText>Nama dapat dilihat oleh pengguna lainnya</FormHelperText>
          </FormControl>
      </ModalNew>

      <ModalNew isOpen={isOpenModalDate} onOpen={onOpenModalDate} onClose={onCloseModalDate} id="Tanggal">
      <Text>Kamu hanya dapat mengubah nama 1 kali lagi. Pastikan nama sudah benar.</Text>
          <FormControl mt="10px">
            <FormLabel>TANGGAL LAHIR</FormLabel>
            <Input type='date' placeholder='Rahmandhika' />
          </FormControl>
      </ModalNew>
      
    <Container maxW='1200px' mt="40px"> 
      <Flex flexDirection="row" justifyContent="center" alignItems="center" gap="20px" flexWrap="wrap">
        <Flex width="300px" flexDirection="column" gap="10px" shadow="md">
          <Flex> 
            <Flex ml="10px">
              <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
            </Flex>
            <Flex flexDirection="column" ml="10px">
              <Text>Rahmandhika</Text>
              <Text>Tersambung dengan GOJEK</Text>
            </Flex>
          </Flex>

          <Flex ml="10px">
            <Text>PROFILE</Text>
          </Flex>

          <Accordion allowMultiple defaultIndex={[0, 1]}>
          <AccordionItem isDisabled>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Kotak Masuk
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem isDisabled>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Pembelian
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        </Flex>

        <Flex width="700px" mt="-60px" flexGrow="1" gap="50px" shadow="md" flexWrap="wrap" justifyContent="center">
          <Flex padding="20px">
            <Card width="300px">
              <CardBody>
                <Image
                  src='https://images.tokopedia.net/img/cache/300/tPxBYm/2023/1/20/0c17a989-7381-454e-92f5-488ae5fe16f4.jpg'
                  fallbackSrc='https://via.placeholder.com/150'
                  alt='Green double couch with wooden legs'
                  borderRadius='lg'
                  objectFit="cover"
                  display="block"
                  ml="auto"
                  mr="auto"
                  width="100%"
                />
                <Stack mt='6' spacing='3'>
                  <Button>Upload Foto</Button>
                  <Text>
                    Besar file: maksimum 10.000.000 bytes (10 Megabytes). 
                    Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
                  </Text>
                  <Button>Ubah Password</Button>
               </Stack>
              </CardBody>
            </Card>
          </Flex>
                  
          <Flex flexDirection="column" mt="-150px" justifyContent="center" flexGrow="1">
           <Heading as='h3' size='md'>Biodata Diri</Heading>
           <Heading as='h4' size='sm' mt="20px">Ubah Biodata Diri</Heading>
            <HStack spacing="50px" mt="20px">
              <Text>Nama</Text>
              <Text>Rahmandhika</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalName} >Ubah</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Tanggal Lahir</Text>
              <Text>29 Oktober 2001</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalDate}>Ubah</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Jenis Kelamin</Text>
              <Text>Pria</Text>
              <Text color="teal" as="b" cursor="pointer">Ubah</Text>
            </HStack>

            <Heading as='h4' size='sm' mt="20px">Ubah Kontak</Heading>
            <HStack spacing="50px" mt="20px">
              <Text>Email</Text>
              <Text>Rahmandhika5@gmail.com</Text>
              <Text color="teal" as="b" cursor="pointer">Ubah</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Nomor HP</Text>
              <Text>081280410775</Text>
              <Text color="teal" as="b" cursor="pointer">Ubah</Text>
            </HStack>
          </Flex>
         </Flex>  
        </Flex>      
    </Container>
    </div>
  )
}

export default Profile