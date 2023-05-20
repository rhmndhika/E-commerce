import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProduct } from "../../../redux/apiCall"
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
    Select
  } from '@chakra-ui/react';
import { publicRequest, userRequest } from "../../../useFetch";
import Cookies from 'js-cookie';
import moment from 'moment'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../../firebase";

export default function ProductList  ()  {

    const toast = useToast();
    const cancelRef = React.useRef();
    const dispatch = useDispatch();
    const [ productList, setProductList ] = useState([]);
    const tokenUserId = Cookies.get('userId');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ paginatedData, setPaginatedData ] = useState([]);
    const [ selectedId, setSelectedId ] = useState(null);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ inputs, setInputs ] = useState({
      title: "",
      desc: "",
      categories: null,
      materials: "",
      materialsDesc: "",
      price: "",
      inStock: null
    });
    const [ file, setFile ] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const itemsPerPage = 5;

    const handleChange = (e) => {
      setInputs((prev) => {
        return { ...prev, [e.target.name]: e.target.value }
      })
    }

    
    const handleDelete = () => {
        // Perform the delete operation for the selected ID here
        deleteProduct(dispatch, selectedId).then((res) => {
            toast({
                title: 'Product has been deleted',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            setTimeout(window.location.reload(), 2000);
        })
        setIsDialogOpen(false);
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
    }, [currentPage, productList, searchQuery]);

    useEffect(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, productList?.length);
      setPaginatedData(productList?.slice(startIndex, endIndex));
    }, [currentPage, productList]);
    
    const totalPages = Math.ceil(productList?.length / itemsPerPage);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
      handlePageChange(currentPage);
    }, [currentPage, productList, searchQuery]);
    
    
    useEffect(() => {
      const getProductList = async () => {
        try{
          const response = await publicRequest.get("/product/all");
          setProductList(response.data);
          setPaginatedData(response.data);
        } catch (err) {
          console.log(err);
         } 
      }
      getProductList();
    }, [tokenUserId])

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
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const product = { ...inputs, img: downloadURL };
              addProduct(dispatch, product).then(() => {
                toast({
                  title: 'Creating New Product.',
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                });
                setTimeout(() => window.location.reload(), 2000);
              })
            });
          }
        );
      }

      const handleSearch = () => {
        const filteredData = productList.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setPaginatedData(filteredData);
        setCurrentPage(1); // Reset to the first page after search
      };

     const clearSearch = () => {
      setSearchQuery("");
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, productList?.length);
      setPaginatedData(productList?.slice(startIndex, endIndex));
      setCurrentPage(1); // Reset to the first page after clearing search
    };


  return (
    <>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Product</ModalHeader>
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
              <FormControl id="title" mt="10px" isRequired>
                <FormLabel>Product Title</FormLabel>
                  <Input
                    placeholder="Nike Jordan"
                    type="text"
                    name="title"
                    onChange={handleChange}
                  />
              </FormControl>
              <FormControl id="desc" mt="10px" isRequired>
                <FormLabel>Description</FormLabel>
                  <Textarea  
                    placeholder="Best shoe in the world"
                    name="desc"
                    onChange={handleChange} 
                  />
              </FormControl>
              <FormControl id="price" mt="10px" isRequired> 
                <FormLabel>Price</FormLabel>
                  <Input
                    placeholder="10000"
                    type="number"
                    name="price"
                    onChange={handleChange}
                  />
                 <FormHelperText as="i" ml="5px">Price are in dollars.</FormHelperText>
              </FormControl>
              <FormControl id="categores" mt="10px" isRequired>
                <FormLabel>Categories</FormLabel>
                  <Input
                    placeholder="Shoes"
                    type="text"
                    name="categories"
                    onChange={handleChange}
                  />
              </FormControl>
                <FormControl id="materials" mt="10px">
                    <FormLabel>Materials</FormLabel>
                    <Input
                        placeholder="Knit"
                        type="text"
                        name="materials"
                        onChange={handleChange}
                    />
                </FormControl>
              <FormControl id="materialsDesc" mt="10px" isRequired>
                <FormLabel>Materials Desc</FormLabel>
                  <Textarea 
                    placeholder="a strong, coarse unbleached cloth made from hemp, flax, cotton, or a similar yarn, used to make items such as sails and tents and as a surface for oil painting."
                    name="materialsDesc"
                    onChange={handleChange}
                  />
              </FormControl>
              <FormControl mt="10px" isRequired>
                  <FormLabel>In Stock</FormLabel>
                  <Select name="inStock" onChange={handleChange}>
                      <option value="true">True</option>
                      <option value="false">False</option>
                  </Select>
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
      <Flex width="100%" padding="10px" justifyContent="space-between" flexWrap="wrap"> 
        <Flex>
        <Input
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Flex>
          <Button colorScheme="telegram" width="100px" ml="3px" onClick={handleSearch}>Search</Button>
          <Button colorScheme="telegram" width="100px" ml="3px" onClick={clearSearch}>Clear</Button>
        </Flex>
        </Flex>

        <Flex>
          <Button onClick={onOpen} colorScheme="telegram">Add Product</Button>
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
              <Th>Product</Th>
              <Th>Stock</Th>
              <Th>Price</Th>
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
                    <Flex>
                        <Avatar size='md' src={item.img} />
                        <Text margin="12px 0 0 10px">
                            {item.title}
                        </Text>
                    </Flex>
                </Td>
                { item.inStock === true ?
                <Td>Available</Td> :
                <Td>Empty</Td>
                }
                <Td>$ {item.price}</Td>
                <Td>
                  <Link to={`/single/product/${item._id}`}> 
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