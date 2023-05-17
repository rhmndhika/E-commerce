import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; 
import { updateUser } from "../../../redux/apiCall";
import Sidebar from "../../../components/Sidebar/Sidebar.tsx";
import "./User.css";
import { FiHome, FiPhone, FiSend, FiUser } from "react-icons/fi";
import { IoLocation, IoMailOutline } from "react-icons/io5";
import { RiContactsLine, RiGenderlessFill} from "react-icons/ri";
import { CalendarIcon, PhoneIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Avatar, 
    Divider, 
    Flex,
    Text,
    HStack,
    Icon,
    FormControl,
    FormLabel,
    Input,
    Container,
    Select,
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Stack,
    Center,
    AvatarBadge,
    IconButton,
} from "@chakra-ui/react";
import moment from "moment";
import { userRequest } from "../../../useFetch";
import { GrUserAdmin } from "react-icons/gr";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { HiOutlineCake } from "react-icons/hi";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../../firebase";

export default function User() {

  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const [ inputs, setInputs ] = useState({});
  const [ inputsProfile, setInputsProfile ] = useState({});
  const [ user, setUser ] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ file, setFile ] = useState(null);
 
    //   const users = useSelector((state) => state.user.userList.find((item) => item._id === userId));
  const users = useSelector((state) => state.user.currentUser);


  const handleInput = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleInputProfile = (e) => {
    setInputsProfile((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  console.log(inputsProfile)

 
  const handleUpdate = (e) => {
    e.preventDefault();

    const user = { ...inputs };
    updateUser(dispatch, user, userId).then(() => {
        toast({
            title: 'Account updated.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
    })
    setTimeout(window.location.reload(), 2000);
  }

  useEffect(() => {
    const getUserById = async () => {
        try{
            const response = await userRequest.get(`/profile/${userId}`);
            setUser(response.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserById();
}, [userId])

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
            const updatedProfile = { ...inputsProfile, img: downloadURL };
          try{
            userRequest.put(`/profile/update/${userId}`, {
                updatedProfile
            }).then((res) => {
                toast({
                    title: 'User Profile Updated',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            //   setIsLoading(false);
            //   toast.success('Profile photo has been uploaded, refreshing the page', {
            //     position: "top-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: false,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            //     });
            //   setTimeout(() => {
            //     window.location.reload();
            //   }, 1500)
            })
          } catch (err) {
            // toast.success(err.response.data, {
            //   position: "top-right",
            //   autoClose: 3000,
            //   hideProgressBar: false,
            //   closeOnClick: true,
            //   pauseOnHover: false,
            //   draggable: true,
            //   progress: undefined,
            //   theme: "light",
            //   });
            console.log(err)
          } 
        });
      }
    );
  }




  return (
    <>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Profile Edit</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex flexDirection="column">
            <FormControl id="userName">
                <FormLabel>User Icon</FormLabel>
                <Stack direction={['column', 'row']} spacing={6}>
                    <Center>
                    <Avatar size="xl" src={user[0]?.img}>
                        <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="red"
                        aria-label="remove Image"
                        icon={<SmallCloseIcon />}
                        />
                    </Avatar>
                    </Center>
                    <Center w="full">
                    <Input type="file" id="file" variant={"unstyled"} padding="5px"
                    onChange={(e) => setFile(e.target.files[0])} />
                    </Center>
                </Stack>
            </FormControl>
            <FormControl id="userName" mt="10px">
                <FormLabel>Fullname</FormLabel>
                <Input
                    placeholder="Fullname"
                    _placeholder={{ color: 'gray.500' }}
                    type="text"
                    name="fullname" 
                    onChange={handleInputProfile}
                />
            </FormControl>
            <FormControl id="email" mt="10px">
                <FormLabel>Email address</FormLabel>
                <Input
                    placeholder="your-email@example.com"
                    _placeholder={{ color: 'gray.500' }}
                    type="email"
                    name="email" 
                    onChange={handleInputProfile}
                />
            </FormControl>
            <FormControl id="dateOfBirth" mt="10px">
                <FormLabel>Date Of Birth</FormLabel>
                <Input
                    placeholder="29-10-2001"
                    _placeholder={{ color: 'gray.500' }}
                    type="date"
                    name="dateOfBirth" 
                    onChange={handleInputProfile}
                />
            </FormControl>
            <FormControl mt="10px">
              <FormLabel>Gender</FormLabel>
              <Select name="gender" onChange={handleInputProfile}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormControl>
            <FormControl id="phoneNumber" mt="10px">
                <FormLabel>Phone Number</FormLabel>
                <Input
                    placeholder="08xxxx"
                    _placeholder={{ color: 'gray.500' }}
                    type="tel"
                    name="phoneNumber" 
                    onChange={handleInputProfile}
                />
            </FormControl>
                {/* <Stack spacing={6} direction={['column', 'row']}>
                <Button
                    bg={'red.400'}
                    color={'white'}
                    w="full"
                    _hover={{
                    bg: 'red.500',
                    }}>
                    Cancel
                </Button>
                <Button
                    bg={'blue.400'}
                    color={'white'}
                    w="full"
                    _hover={{
                    bg: 'blue.500',
                    }}>
                    Submit
                </Button>
                </Stack> */}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme='green' onClick={handleClick}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    <Sidebar>
        <Flex>
            <Text fontSize="2xl" as="b">User Profile</Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="center" width="100%" mt="20px" gap="10px" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
            <Flex  width="50%" padding="20px" shadow="lg">
                { users && 
                <Flex flexDirection="column">
                    <Flex gap="10px">
                        <Avatar src={user[0]?.img} fallbackSrc='https://via.placeholder.com/150' />
                        <Flex flexDirection="column" alignItems="center" mt="10px">
                            <Text fontWeight="600">{user[0]?.fullname}</Text>
                            {/* <Text fontWeight="300">{users._id}</Text> */}
                        </Flex>
                        <hr></hr>
                    </Flex>
                    <Text mt="10px" fontSize="sm" textColor="red" cursor="pointer" onClick={onOpen}>Edit User Profile</Text>
                    <Flex mt="20px" flexDirection="column">
                        <Flex flexDirection="column">
                            <Text fontWeight="300">Account Details</Text>
                            <HStack spacing={2} mt="20px">
                                <Icon as={RiContactsLine} boxSize={6} />
                                <Text>{user[0]?.userId._id}</Text>
                            </HStack>
                            <HStack spacing={2} mt="20px">
                                <Icon as={GrUserAdmin} boxSize={6} />
                                {user[0]?.userId.isAdmin === true ?
                                    <Text>Admin</Text>
                                    :
                                    <Text>User</Text>
                                }
                            </HStack>
                            <HStack spacing={2} mt="20px">
                                <Icon as={CalendarIcon} boxSize={6} />
                                <Text>{moment(user[0]?.userId.createdAt).format('MMMM Do YYYY')}</Text>
                            </HStack>
                        </Flex>
                        <Flex flexDirection="column" mt="20px">
                            <Text fontWeight="300">Contact Details</Text>
                            <HStack spacing={2} mt="20px">
                                {user[0]?.gender === "Male" ?
                                <>
                                <Icon as={BsGenderMale} boxSize={6} /> 
                                <Text>Male</Text>
                                </>
                                :
                                <>
                                <Icon as={BsGenderFemale} boxSize={6} /> 
                                <Text>Female</Text>
                                </>
                                }
                            </HStack>
                            <HStack spacing={2} mt="20px">
                                <Icon as={FiPhone} boxSize={6} />
                                <Text>+62 {user[0]?.phoneNumber}</Text>
                            </HStack>
                            <HStack spacing={2} mt="20px">
                                <Icon as={IoMailOutline} boxSize={6} />
                                <Text>{user[0]?.email}</Text>
                            </HStack>
                            <HStack spacing={2} mt="20px">
                                <Icon as={HiOutlineCake} boxSize={6} />
                                <Text>{moment(user[0]?.dateOfBirth).format('MMMM Do YYYY')}</Text>
                            </HStack>
                            <HStack spacing={2} mt="20px">
                                {user[0]?.company ? 
                                <>
                                <Icon as={IoMailOutline} boxSize={6} />
                                <Text>{user[0]?.company}</Text>
                                </>
                                :
                                null
                                }
                            </HStack>
                        </Flex>
                    </Flex>     
                </Flex>
                }
            </Flex>

            <Flex flexDirection="column" width="50%" shadow="lg" padding="20px">
                <Text as="b">Edit User</Text>
                <Flex flexDirection="column" mt="10px">
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input type="text" name="username" placeholder={user[0]?.userId.username} onChange={handleInput} />
                    </FormControl>

                    <FormControl mt="10px">
                        <FormLabel>Email</FormLabel>
                        <Input type="email" name="email" placeholder={user[0]?.userId.email}  onChange={handleInput} />
                    </FormControl>

                    <FormControl mt="10px">
                        <FormLabel>Password</FormLabel>
                        <Input type="password" name="password" placeholder='Password...' onChange={handleInput} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Admin</FormLabel>
                        <Select name="isAdmin" onChange={handleInput}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </Select>
                    </FormControl>
                </Flex>
                <Flex alignItems="flex-end" flexGrow="1">
                 <Button width="100%" mt="10px" colorScheme="green" onClick={handleUpdate}>Update</Button>
                </Flex>
            </Flex> 
        </Flex>
    </Sidebar>
    </>
  );
}
