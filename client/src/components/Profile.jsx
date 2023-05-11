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
  Select,
  Skeleton
} from '@chakra-ui/react'
import { userMethod } from '../useFetch';
import { useParams } from 'react-router';
import moment from 'moment';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase"
import { Link } from 'react-router-dom';

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

  const { 
    isOpen: isOpenModalGender, 
    onOpen: onOpenModalGender, 
    onClose: onCloseModalGender 
  } = useDisclosure();

  const { 
    isOpen: isOpenModalEmail, 
    onOpen: onOpenModalEmail, 
    onClose: onCloseModalEmail 
  } = useDisclosure();

  const { 
    isOpen: isOpenModalNumber, 
    onOpen: onOpenModalNumber, 
    onClose: onCloseModalNumber 
  } = useDisclosure();

  
  const [ inputs, setInputs ] = useState({});
  const [ file, setFile ] = useState(null);
  const [ userProfile, setUserProfile ] = useState([]);
  const { id } = useParams();


  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  
  const updateUserProfile = async () => {
    try{
      await userMethod.put(`/profile/update/${id}`, inputs);
    } catch (err) {
      console.log(err);
    } 
  }

  useEffect(() => {
    const getUserProfile = async () => {
        try{
            const response = await userMethod.get(`/profile/${id}`);
            setUserProfile(response.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserProfile();
  }, [])

  const handleClick = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const StorageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(StorageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          try{
            userMethod.put(`/profile/update/${id}`, {
              img: downloadURL
            });
          } catch (err) {
            console.log(err);
          } 
        });
      }
    );
  }


  return (
    <div>
    {/* Modal Update Nama */}
    <Modal closeOnOverlayClick={false} isOpen={isOpenModalName} onClose={onCloseModalName} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ubah Nama</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Nama</FormLabel>
              <Input name="fullname" type='text' placeholder='Rahmandhika' onChange={handleChange} />
              <FormHelperText>Nama dapat dilihat oleh pengguna lainnya</FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    {/* Modal Update Tanggal Lahir */}
    <Modal closeOnOverlayClick={false} isOpen={isOpenModalDate} onClose={onCloseModalDate} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ubah Tanggal Lahir</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Nama</FormLabel>
              <Input name="dateOfBirth" type='date' placeholder='29-10-2001' onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
     {/* Modal Update Jenis Kelamin */}
     <Modal closeOnOverlayClick={false} isOpen={isOpenModalGender} onClose={onCloseModalGender} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ubah Jenis Kelamin</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Jenis Kelamin</FormLabel>
              <Select name="gender" onChange={handleChange}>
                <option>Pria</option>
                <option>Wanita</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
     {/* Modal Update Email */}
     <Modal closeOnOverlayClick={false} isOpen={isOpenModalEmail} onClose={onCloseModalEmail} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ubah Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Email</FormLabel>
                <Input name="email" type='email' placeholder='email@email.com' onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    {/* Modal Update Handphone */}
    <Modal closeOnOverlayClick={false} isOpen={isOpenModalNumber} onClose={onCloseModalNumber} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ubah Nomor HP</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Nomor HP</FormLabel>
                <Input name="phoneNumber" type='tel' placeholder='0xxxxxxxxxxxx' onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    { userProfile.map((profile) => {
      return (
    <Container maxW='1200px' mt="40px"> 
      <Flex flexDirection="row" justifyContent="center" alignItems="center" gap="20px" flexWrap="wrap">
        <Flex width="300px" flexDirection="column" gap="10px" shadow="md">
          <Flex> 
            <Flex ml="10px">
              <Avatar name={userProfile.username} src={profile.img} />
            </Flex>
            <Flex flexDirection="column" ml="10px" mt="10px">
              <Text>{profile.fullname}</Text>
            </Flex>
          </Flex>

          <Accordion allowMultiple defaultIndex={[0, 1, 2, 3]}>
          <AccordionItem isDisabled={true} defaultIsOpen={true}>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Kotak Masuk
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box>
                <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Chat</Text>
              </Box>
            </AccordionPanel>
            <AccordionPanel pb={4}>
              <Box>
                <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Ulasan</Text>
              </Box>
            </AccordionPanel>
            <AccordionPanel pb={4}>
              <Box>
                <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Diskusi Produk</Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem isDisabled={true} defaultIsOpen={true}>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Pembelian
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box>
                <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Menunggu Pembayaran</Text>
              </Box>
            </AccordionPanel>
            <AccordionPanel pb={4}>
              <Box>
              <Link to={`/order/history`}>
                <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Daftar Transaksi</Text>
              </Link>
              </Box>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem isDisabled={true} defaultIsOpen={true}>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Profil Saya
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box>
                <Link to={`/user/wishlist/${id}`}>
                  <Text textDecoration="none" cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Wishlist</Text>
                </Link>
              </Box>
            </AccordionPanel>
            <AccordionPanel pb={4}>
              <Box>
                  <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Pengaturan</Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        </Flex>

        <Flex width="700px" mt="-10px" flexGrow="1" gap="50px" shadow="md" flexWrap="wrap" justifyContent="center">
          <Flex padding="20px">
            <Card width="300px">
              <CardBody>
                <Image
                  src={profile.img} 
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
                  <Text>Change Photo Profile</Text>
                  { file === null ?
                  <Input type="file" id="file" variant={"unstyled"} padding="5px"
                  onChange={(e) => setFile(e.target.files[0])} />
                  :
                  <Button onClick={handleClick}>Upload Photo</Button>
                  }
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
              <Text>{profile.fullname}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalName} >Ubah</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Tanggal Lahir</Text>
              <Text>{moment(profile.dateOfBirth).format('MMMM Do YYYY')}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalDate}>Ubah</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Jenis Kelamin</Text>
              <Text>{profile.gender}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalGender}>Ubah</Text>
            </HStack>

            <Heading as='h4' size='sm' mt="20px">Ubah Kontak</Heading>
            <HStack spacing="50px" mt="20px">
              <Text>Email</Text>
              <Text>{profile.email}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalEmail}>Ubah</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Nomor HP</Text>
              <Text>{profile.phoneNumber}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalNumber}>Ubah</Text>
            </HStack>
          </Flex>
         </Flex>    
        </Flex>   
    </Container>
      )
    })}
    </div>
  )
}

export default Profile