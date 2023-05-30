import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from '../../../components/Sidebar/Sidebar.tsx'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
  HStack,
  Flex,
  TableContainer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Avatar,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormHelperText,
  Textarea,
  FormLabel,
  Input,
  Select,
  Image
} from '@chakra-ui/react';
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import moment from 'moment'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../../firebase";
import { publicRequest, userRequest } from "../../../useFetch.js";

const CategoryList = () => {

  const toast = useToast();
  const cancelRef = React.useRef();
  const dispatch = useDispatch();
  const tokenUserId = Cookies.get('userId');
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ categoryList, setCategoryList ] = useState([]);
  const [ paginatedData, setPaginatedData ] = useState([]);
  const [ selectedId, setSelectedId ] = useState(null);  
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);    
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ inputs, setInputs ] = useState({
    cat: ""
  });
  const [ file, setFile ] = useState(null);


  const itemsPerPage = 5;

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleClick = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const StorageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(StorageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
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
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const category = { ...inputs, img: downloadURL };
          userRequest.post("/categories/create", category).then((res) => {
            toast({
              title: 'Creating New Category.',
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
            setTimeout(() => window.location.reload(), 2000);
          }).catch((err) => {
            console.log(err)
            toast({
              title: err.response.data,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          });
        });
      }
    );
  };
  
  const handleDelete = async () => {
    try {
      await userRequest.delete(`/categories/delete/${selectedId}`).then((res) => {
        toast({
          title: res.data,
          status: 'success',
          duration: 9000,
          isClosable: true,
      })
      setIsDialogOpen(false);
      setTimeout(window.location.reload(), 2000);
      })
    } catch (err) {
      console.log(err);
      toast({
        title: err.response.data ,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedId(null);
    setIsDialogOpen(false);
  };


  useEffect(() => {
    handlePageChange(currentPage);
  }, [currentPage, categoryList]);

  useEffect(() => {
    const getCategoryList = async () => {
      try{
        const response = await publicRequest.get("/categories/all");
        setCategoryList(response.data);
        setPaginatedData(response.data);
      } catch (err) {
        console.log(err);
       } 
    }
    getCategoryList();
  }, [tokenUserId])

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, categoryList?.length);
    setPaginatedData(categoryList?.slice(startIndex, endIndex));
  }, [currentPage, categoryList]);

  const totalPages = Math.ceil(categoryList?.length / itemsPerPage);

  const handlePageChange = (page) => {
      setCurrentPage(page);
  };

  useEffect(() => {
    handlePageChange(currentPage);
  }, [currentPage, categoryList]);

  return (
    <>
     <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column">
             <FormControl mt="10px" isRequired>
                <FormLabel>Image</FormLabel>
                  <Input
                    type="file"
                    id="file"
                    variant={"unstyled"}
                    padding="5px"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
              </FormControl>  
              <FormControl id="cat" mt="10px" isRequired> 
                <FormLabel>Category Name</FormLabel>
                  <Input
                    type="text"
                    name="cat"
                    onChange={handleChange}
                  />
                 <FormHelperText as="i" ml="5px">Category Name is for display.</FormHelperText>
              </FormControl> 
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            {(Object.values(inputs).some((value) => value === null || value === undefined || value === "")) ? 
            <Button colorScheme="green" isDisabled>Create</Button>
            :
            <Button colorScheme='green' onClick={handleClick}>
              Create
            </Button>
            }
          </ModalFooter>
        </ModalContent>
    </Modal>
    <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
    <Sidebar>
     <Flex width="100%" padding="10px" justifyContent="flex-end" flexWrap="wrap"> 
        <Flex>
          <Button colorScheme="telegram" onClick={onOpen}>Create Category</Button>
        </Flex>
      </Flex>
      <Box p={4} width="100%">
        <TableContainer>
        <Table variant="simple" className="admin-table">
          <TableCaption>Products List</TableCaption>
          <Thead>
            <Tr>
              <Th>#</Th> 
              <Th>ID</Th>
              <Th>Category Image</Th>
              <Th>Category Name</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData?.map((item, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index + 1; // Calculate the actual index
            return (
              <Tr key={item._id}>
                <Td>{actualIndex}</Td> 
                <Td>{item._id}</Td>
                <Td>
                  <Image 
                    boxSize='100px' 
                    objectFit='cover'
                    alt={item._id}
                    src={item.img} />
                </Td>
                <Td>{item.cat}</Td>
                <Td>
                  <Link to={`/category/detail/${item._id}`}> 
                    <Button size="xs" colorScheme="teal" mr={2} width="60px">
                        Edit
                    </Button>
                  </Link>
                  <Button size="xs" colorScheme="red" width="60px" onClick={() => {
                    handleOpenDialog(item._id)
                  }}>
                    Delete
                  </Button>
                </Td>
              </Tr>
              )
            })}
          </Tbody>
        </Table>
        </TableContainer>
      </Box>

      {totalPages > 1 && (
        <HStack justify="center" mt={4}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              variant={currentPage === index + 1 ? 'solid' : 'outline'}
              colorScheme="teal"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </HStack>
      )}
    </Sidebar>
    </>
  )
}

export default CategoryList