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
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isModalLoading, setIsModalLoading ] = useState(false);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to the backend
      const response = await userMethod.post('/users/change-password', {
        email,
        newPassword,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: Unable to change password');
      console.error(error);
    }
  };


  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  
  const updateUserProfile = async () => {
    try{
      await userMethod.put(`/profile/update/${id}`, inputs).then((res) => {
        setIsModalLoading(true);
        toast.success('Updating', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        setTimeout(() => {
          setIsModalLoading(false);
          window.location.reload();
        }, 1500)
      })
    } catch (err) {
      toast.error(err.response.data, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
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
    setIsLoading(true);
  
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
            }).then((res) => {
              setIsLoading(false);
              toast.success('Profile photo has been uploaded, refreshing the page', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
              setTimeout(() => {
                window.location.reload();
              }, 1500)
            })
          } catch (err) {
            toast.error(err.response.data, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
          } 
        });
      }
    );
  }

  console.log(userProfile)


  return (
    <div>
    <ToastContainer />
    {/* Modal Update Nama */}
    <Modal closeOnOverlayClick={false} isOpen={isOpenModalName} onClose={onCloseModalName} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Your Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Name</FormLabel>
              <Input name="fullname" type='text' defaultValue={userProfile[0]?.fullname} onChange={handleChange} />
              <FormHelperText>Your name can be seen by other users</FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
          { isModalLoading ? 
            <Button
              isLoading
              loadingText='Saving'
              colorScheme='teal'
              >
              Saving
            </Button>  
            :
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Save
            </Button>
            }
          </ModalFooter>
        </ModalContent>
    </Modal>
    {/* Modal Update Tanggal Lahir */}
    <Modal closeOnOverlayClick={false} isOpen={isOpenModalDate} onClose={onCloseModalDate} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Date of Birth</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Date of Birth</FormLabel>
              <Input name="dateOfBirth" type='date' placeholder='29-10-2001' onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
          { isModalLoading ? 
            <Button
              isLoading
              loadingText='Saving'
              colorScheme='teal'
              >
              Saving
            </Button>  
            :
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Save
            </Button>
            }
          </ModalFooter>
        </ModalContent>
    </Modal>
     {/* Modal Update Jenis Kelamin */}
     <Modal closeOnOverlayClick={false} isOpen={isOpenModalGender} onClose={onCloseModalGender} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Gender</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Gender</FormLabel>
              <Select name="gender" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
          { isModalLoading ? 
            <Button
              isLoading
              loadingText='Saving'
              colorScheme='teal'
              >
              Saving
            </Button>  
            :
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Save
            </Button>
            }
          </ModalFooter>
        </ModalContent>
    </Modal>
     {/* Modal Update Email */}
     <Modal closeOnOverlayClick={false} isOpen={isOpenModalEmail} onClose={onCloseModalEmail} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Email</FormLabel>
                <Input name="email" type='email' defaultValue={userProfile[0]?.email} onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
          { isModalLoading ? 
            <Button
              isLoading
              loadingText='Saving'
              colorScheme='teal'
              >
              Saving
            </Button>  
            :
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Save
            </Button>
            }
          </ModalFooter>
        </ModalContent>
    </Modal>
    {/* Modal Update Handphone */}
    <Modal closeOnOverlayClick={false} isOpen={isOpenModalNumber} onClose={onCloseModalNumber} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Phone Number</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>  
            <FormControl mt="10px">
              <FormLabel>Phone Number</FormLabel>
                <Input name="phoneNumber" type='tel' defaultValue={userProfile[0]?.phoneNumber} onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
          { isModalLoading ? 
            <Button
              isLoading
              loadingText='Saving'
              colorScheme='teal'
              >
              Saving
            </Button>  
            :
            <Button colorScheme='teal' mr={3} onClick={updateUserProfile}>
              Save
            </Button>
            }
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
                 Inbox
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
                <Link to={`/user/reviewList/${id}`}>
                  <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Review</Text>
                </Link>
              </Box>
            </AccordionPanel>
            <AccordionPanel pb={4}>
              <Box>
                <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Product Discussion</Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem isDisabled={true} defaultIsOpen={true}>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Purchase
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box>
                <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Waiting for payment</Text>
              </Box>
            </AccordionPanel>
            <AccordionPanel pb={4}>
              <Box>
              <Link to={`/order/history`}>
                <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Order History</Text>
              </Link>
              </Box>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem isDisabled={true} defaultIsOpen={true}>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  My Profile
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
                  <Text cursor="pointer" _hover={{backgroundColor: "#EFF1F3"}}>Setting</Text>
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
                  <>
                  {isLoading ? 
                   <Button
                   isLoading
                   loadingText='Uploading'>
                   Submit
                  </Button>  
                  :
                  <Button onClick={handleClick}>Upload Photo</Button>
                  }
                  </>
                  }
                  <Text>
                  File size: 10,000,000 bytes (10 Megabytes) maximum. Allowed file extensions: .JPG .JPEG .PNG
                  </Text>
                  {/* <Button>Change Password</Button> */}
                  <div>
                  <h2>Change Password</h2>
                  {message && <p>{message}</p>}
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword">New Password:</label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit">Change Password</button>
                  </form>
                </div>
               </Stack>
              </CardBody>
            </Card>
          </Flex>
                  
          <Flex flexDirection="column" mt="-50px" justifyContent="center">
           <Heading as='h3' size='md'>Personal Data</Heading>
           <Heading as='h4' size='sm' mt="20px">Change Personal Data</Heading>
            <HStack spacing="50px" mt="20px">
              <Text>Name :</Text>
              <Text>{profile.fullname}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalName}>Change</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Date of Birth :</Text>
              <Text>{moment(profile.dateOfBirth).format('MMMM Do YYYY')}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalDate}>Change</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Gender :</Text>
              <Text>{profile.gender}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalGender}>Change</Text>
            </HStack>

            <Heading as='h4' size='sm' mt="20px">Change Contact</Heading>
            <HStack spacing="50px" mt="20px">
              <Text>Email :</Text>
              <Text>{profile.email}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalEmail}>Change</Text>
            </HStack>
            <HStack spacing="50px" mt="20px">
              <Text>Phone Number :</Text>
              <Text>+62 {profile.phoneNumber}</Text>
              <Text color="teal" as="b" cursor="pointer" onClick={onOpenModalNumber}>Change</Text>
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