import React, { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar/Sidebar.tsx'
import { userRequest } from '../../../useFetch.js';
import { useParams } from 'react-router';
import Cookies from 'js-cookie';
import { 
  Flex, 
  Heading, 
  Text, 
  Center, 
  Button, 
  TableContainer, 
  Badge,
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
  Input,
  useToast,
  Image
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../../firebase";

const Category = () => {

  const tokenUserId = Cookies.get('userId');
  const { id } = useParams();
  const [ category, setCategory ] = useState({});
  const [ inputs, setInputs ] = useState({});
  const [ cat, setCat ] = useState([]);
  const [ file, setFile ] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const getUserOrder = async () => {
        try{
            const response = await userRequest.get(`/categories/details/${id}`)
            setCategory(response.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserOrder();
}, [id, tokenUserId])

const handleInput = (e) => {
  setInputs((prev) => {
    return { ...prev, [e.target.name]: e.target.value };
  });
};

const handleClick = async (e) => {
  e.preventDefault();

  if (newImageFile) {
    // Upload the new image file
    const fileName = new Date().getTime() + newImageFile.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, newImageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle upload progress
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Image upload is complete
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            // Create a new product object with the updated image URL
            const updatedProduct = { ...inputs, img: downloadURL };
            // Call the updateProduct function with the updated product

            userRequest.put(`/categories/update/${category?._id}`, updatedProduct).then((res) => {
              toast({
                title: 'Updating Category.',
                status: 'success',
                duration: 9000,
                isClosable: true,
              });
              // Reload the page after a delay
              setTimeout(() => window.location.reload(), 2000);
            })
          })
          .catch((error) => {
            // Handle error while retrieving the image URL
            console.log(error);
          });
      }
    );
  } else {
    // No new image file, update the product with other fields only
    const updatedProduct = { ...inputs };
    userRequest.put(`/categories/update/${category?._id}`, updatedProduct).then((res) => {
      toast({
        title: 'Updating Category.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      // Reload the page after a delay
      setTimeout(() => window.location.reload(), 2000);
    })
      .catch((error) => {
        // Handle error during product update
        console.log(error);
      });
  }
};

  return (
    <>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex flexDirection="column">
                <FormControl id="userName">
                    <FormLabel>Category Image</FormLabel>
                    <Flex flexDirection="column">
                        <Flex wdith="100%">
                            <Image  boxSize='200px' width="100%"objectFit='cover' src={category?.img} />
                        </Flex>
                        <Center w="full" mt="10px">
                        <Input
                            type="file"
                            id="file"
                            variant={"unstyled"}
                            padding="5px"
                            onChange={(e) => setNewImageFile(e.target.files[0])}
                            />
                        </Center>
                    </Flex>
                </FormControl>
                <FormControl id="cat" mt="10px">
                    <FormLabel>Category Name</FormLabel>
                    <Input
                        _placeholder={{ color: 'gray.500' }}
                        type="text"
                        name="cat"
                        defaultValue={category?.cat}
                        onChange={handleInput}
                    />
                </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme='green' onClick={handleClick}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    <Sidebar>
    <Flex flexDirection="column">
        <Flex flexDirection="column" padding="5px">
            <Heading as='h4' size='md'>Category Detail</Heading>
            <Flex flexDirection="row" mt="10px" gap="5px">
            <Text>ID : {category?._id}</Text>
            </Flex>
            <Text>Category Name: {category?.cat}</Text>
            <Image boxSize="300px" objectFit="cover" alt={category?._id} src={category?.img} />
        </Flex> 
    </Flex>
    <Button m="5px" onClick={onOpen}>Update Category</Button>
    </Sidebar>
    </>
  )
}

export default Category