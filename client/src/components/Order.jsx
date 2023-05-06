import React, { useState, useEffect } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Text,
    Flex,
    Button,
    Badge
} from '@chakra-ui/react'
import { userMethod } from '../useFetch'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import TimeAgo from 'react-timeago'


const Order = () => {

    const user = useSelector((state) => state.user.currentUser._id);
    const [ orderHistory, setOrderHistory ] = useState([]);


    useEffect(() => {
        const getOrderHistory = async () => {
            try{
                const response = await userMethod.get(`/order/find/${user}`)
                setOrderHistory(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        getOrderHistory();
    }, [])


  return (
    <TableContainer shadow="lg" margin="50px 15px 0 15px">
        <Table variant="simple">
            <Thead>
            <Tr>
                <Th>Order ID</Th>
                <Th>Amount</Th>
                <Th>Country</Th>
                <Th>City</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Action</Th>
            </Tr>
            </Thead>
            { orderHistory.map((order) => {
            return (
            <Tbody>
                <Tr>
                    <Td>{order._id}</Td>
                    <Td>$ {order.amount}</Td>
                    <Td>{order.address.country}</Td>
                    <Td>{order.address.city}</Td>
                    { order.status == "delivered" ?
                        <Td>  
                            <Badge colorScheme='green'>{order.status}</Badge>
                        </Td>
                        :
                        <Td>  
                            <Badge>{order.status}</Badge>
                        </Td>
                    }
                    <Td><TimeAgo date={order.createdAt} /></Td>
                    <Td>
                        <Link to={`/order/history/detail/${order._id}`}>
                            <Button colorScheme='teal'>Check Invoice</Button>
                        </Link>
                    </Td>
                </Tr>
            </Tbody>
                )
            })}
        </Table>
    </TableContainer>
  )
}

export default Order