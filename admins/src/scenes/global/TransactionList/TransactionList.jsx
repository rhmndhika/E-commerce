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
    Select,
    Badge
  } from '@chakra-ui/react';
import { publicRequest, userRequest } from "../../../useFetch";
import Cookies from 'js-cookie';
import moment from 'moment'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../../firebase";

const TransactionList = () => {

    const toast = useToast();
    const cancelRef = React.useRef();
    const dispatch = useDispatch();
    const [ productList, setProductList ] = useState([]);
    const [ orderHistory, setOrderHistory ] = useState([]);
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
        const getOrderHistory = async () => {
            try{
                const response = await userRequest.get("/order/all")
                setOrderHistory(response.data);
                setPaginatedData(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        getOrderHistory();
    }, [tokenUserId])

    console.log(orderHistory)

      // const handleClick = (e) => {
      //   e.preventDefault();
      //   const fileName = new Date().getTime() + file.name;
      //   const storage = getStorage(app);
      //   const StorageRef = ref(storage, fileName);
      //   const uploadTask = uploadBytesResumable(StorageRef, file);
    
      //   uploadTask.on(
      //     "state_changed",
      //     (snapshot) => {
      //       const progress =
      //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //       console.log("Upload is " + progress + "% done");
      //       switch (snapshot.state) {
      //         case "paused":
      //           console.log("Upload is paused");
      //           break;
      //         case "running":
      //           console.log("Upload is running");
      //           break;
      //         default:
      //       }
      //     },
      //     (error) => {
      //     },
      //     () => {
      //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      //         const product = { ...inputs, img: downloadURL };
      //         addProduct(dispatch, product).then(() => {
      //           toast({
      //             title: 'Creating New Product.',
      //             status: 'success',
      //             duration: 9000,
      //             isClosable: true,
      //           });
      //           setTimeout(() => window.location.reload(), 2000);
      //         })
      //       });
      //     }
      //   );
      // }

      const handleSearch = () => {
        const filteredData = orderHistory.filter((item) =>
          item._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.userId.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setPaginatedData(filteredData);
        setCurrentPage(1); // Reset to the first page after search
      };
      
  
     const clearSearch = () => {
      setSearchQuery("");
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, orderHistory?.length);
      setPaginatedData(orderHistory?.slice(startIndex, endIndex));
      setCurrentPage(1); // Reset to the first page after clearing search
    };

  return (
    <>
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
      <Flex width="100%" padding="10px" justifyContent="flex-end"> 
        <Flex>
        <Input
          width="240px"
          placeholder="Search by invoice / username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Flex>
          <Button colorScheme="telegram" width="100px" ml="3px" onClick={handleSearch}>Search</Button>
          <Button colorScheme="telegram" width="100px" ml="3px" onClick={clearSearch}>Clear</Button>
        </Flex>
        </Flex>

        <Flex>
          
        </Flex>
      </Flex>
      <Box p={4} width="100%">
        <TableContainer>
        <Table variant="simple" className="admin-table">
          <TableCaption>Transactions List</TableCaption>
          <Thead>
            <Tr>
              <Th>#</Th> 
              <Th>Invoice ID</Th>
              <Th>Customer</Th>
              <Th>Amount</Th>
              <Th>Date Ordered</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData?.map((item, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index + 1; // Calculate the actual index
            return (
              <Tr key={item._id}>
                <Td>{actualIndex}</Td> 
                <Link to={`/user/order/${item._id}/invoice`}>
                  <Td color="green">{item._id}</Td>
                </Link>
                <Td>{item.userId.username}</Td>
                <Td>$ {item.amount}</Td>
                <Td>{moment(item.createdAt).format('MMMM Do YYYY')}</Td>
                { item.status === "pending" ? 
                <Td>
                    <Badge color="#2a7ade">
                    {item.status}
                    </Badge>
                </Td>
                :
                <Td>
                    <Badge>
                    {item.status}
                    </Badge>
                 </Td>
                }
                <Td>
                  <Link to={`/transaction/detail/${item._id}`}> 
                    <Button size="xs" colorScheme="teal" mr={2} width="60px">
                        Details
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

export default TransactionList