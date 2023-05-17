import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUserList } from "../../../redux/apiCall"
import Sidebar from '../../../components/Sidebar/Sidebar.tsx'
import "./UserList.css";
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
    AlertDialogCloseButton,
    useDisclosure,
    useToast
  } from '@chakra-ui/react';
import { userRequest } from "../../../useFetch";
import Cookies from 'js-cookie';
import moment from 'moment'

export default function UserList() {

  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.userList);
  const [ userList, setUserList ] = useState(null);
  const tokenUserId = Cookies.get('userId');
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toast = useToast();
  const cancelRef = React.useRef();

  const handleDelete = () => {
    // Perform the delete operation for the selected ID here
    deleteUser(dispatch, selectedId).then((res) => {
        toast({
            title: 'User deleted',
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
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
  }, []);

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  //   const startIndex = (page - 1) * itemsPerPage;
  //   const endIndex = Math.min(startIndex + itemsPerPage, userList?.length);
  //   setUserList(userList?.slice(startIndex, endIndex));
  // };

  // const totalPages = Math.ceil(userList?.length / itemsPerPage);
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, userList?.length);
    setPaginatedData(userList?.slice(startIndex, endIndex));
  }, [currentPage, userList]);

  const totalPages = Math.ceil(userList?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    const getUserList = async () => {
        try{
            const response = await userRequest.get("/users");
            setUserList(response.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserList();
  }, [tokenUserId])

 
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
      <Box p={4} width="100%">
        <TableContainer>
        <Table variant="simple" className="admin-table">
          <TableCaption>Users List</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Admin</Th>
              <Th>CreatedAt</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userList?.map((item) => (
              <Tr key={item._id}>
                <Td>{item._id}</Td>
                <Td>{item.username}</Td>
                <Td>{item.email}</Td>
                { item.isAdmin === true ?
                <Td>true</Td> :
                <Td>false</Td>
                }
                {/* <Td>{item.isAdmin}</Td> */}
                <Td>{moment(item.createdAt).format('MMMM Do YYYY')}</Td>
                <Td>
                  <Link to={`/user/${item._id}`}> 
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
            ))}
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
  );
}
