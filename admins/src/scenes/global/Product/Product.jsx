import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; 
import { updateProduct } from "../../../redux/apiCall";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { userRequest } from "../../../useFetch";
import Sidebar from '../../../components/Sidebar/Sidebar.tsx'
import app from "../../../firebase";
import { Box, Button, Flex, Text, Card, Image, Stack, CardBody, Heading, 
    CardFooter,
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
    Center,
    Avatar,
    AvatarBadge,
    IconButton,
    Select,
    useToast,
    Textarea
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import Chart from "../../../components/Chart/Chart";
import Cookies from 'js-cookie';
import moment from 'moment'


export default function Product () {

    const location = useLocation();
    const dispatch = useDispatch();
    const toast = useToast();
    const productId = location.pathname.split("/")[3];
    const tokenUserId = Cookies.get('userId');
    const { id } = useParams();
    const [ productStats, setProductStats ] = useState([]);
    const [ product, setProduct ] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ inputs, setInputs ] = useState({});
    const [ cat, setCat ] = useState([]);
    const [ file, setFile ] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);

    const MONTHS = useMemo(
        () => [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        []
    );

    useEffect(() => {
        const getStats = async () => {
          try {
            const res = await userRequest.get("/order/income?pid=" + productId);
            const list = res.data.sort((a,b)=>{
                return a._id - b._id
            })
            list.map((item) =>
              setProductStats((prev) => [
                ...prev,
                { name: MONTHS[item._id - 1], Sales: item.total },
              ])
            );

          } catch (err) {
            console.log(err);
          }
        };
        getStats();
      }, [productId, MONTHS])

      useEffect(() => {
        const getProduct = async () => {
          try {
            const res = await userRequest.get(`/product/find/${productId}`);
            setProduct(res.data)
          } catch (err) {
            console.log(err);
          }
        }
        getProduct();
      }, [productId, tokenUserId]);
      

    //   const handleInput = (e) => {
    //     setInputs((prev) => {
    //       return { ...prev, [e.target.name]: e.target.value }
    //     })
    //   }

    const handleInput = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
      };
      
      

      const handleCat = (e) => {
        setCat(e.target.value.split(","));
      }

      
    //   const handleClick = (e) => {
    //     e.preventDefault();
    //     const fileName = new Date().getTime() + file.name;
    //     const storage = getStorage(app);
    //     const StorageRef = ref(storage, fileName);
    //     const uploadTask = uploadBytesResumable(StorageRef, file);
    
    //     uploadTask.on(
    //       "state_changed",
    //       (snapshot) => {
    //         const progress =
    //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log("Upload is " + progress + "% done");
    //         switch (snapshot.state) {
    //           case "paused":
    //             console.log("Upload is paused");
    //             break;
    //           case "running":
    //             console.log("Upload is running");
    //             break;
    //           default:
    //         }
    //       },
    //       (error) => {
    //         // Handle unsuccessful uploads
    //       },
    //       () => {
    //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //           const product = { ...inputs, img: downloadURL, categories: cat };
    //           updateProduct(dispatch, product, productId).then(() => {
    //             toast({
    //                 title: 'Updating Product.',
    //                 status: 'success',
    //                 duration: 9000,
    //                 isClosable: true,
    //               })
    //           })
    //           setTimeout(window.location.reload(), 2000);
    //         });
    //       }
    //     );
    //   }
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
                  const updatedProduct = { ...product, img: downloadURL, ...inputs };
                  // Call the updateProduct function with the updated product
                  updateProduct(dispatch, updatedProduct, productId)
                    .then(() => {
                      toast({
                        title: 'Updating Product.',
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
                })
                .catch((error) => {
                  // Handle error while retrieving the image URL
                  console.log(error);
                });
            }
          );
        } else {
          // No new image file, update the product with other fields only
          const updatedProduct = { ...product, ...inputs };
          updateProduct(dispatch, updatedProduct, productId)
            .then(() => {
              toast({
                title: 'Updating Product.',
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
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex flexDirection="column">
                <FormControl id="userName">
                    <FormLabel>Product Image</FormLabel>
                    <Flex flexDirection="column">
                        <Flex wdith="100%">
                            <Image  boxSize='200px' width="100%"objectFit='cover' src={product.img} />
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
                <FormControl id="title" mt="10px">
                    <FormLabel>Product Title</FormLabel>
                    <Input
                        _placeholder={{ color: 'gray.500' }}
                        type="text"
                        name="title"
                        defaultValue={product.title}
                        value={inputs.title}
                        onChange={handleInput}
                    />
                </FormControl>
                <FormControl id="desc" mt="10px">
                    <FormLabel>Description</FormLabel>
                    <Textarea  
                        name="desc"
                        defaultValue={product.desc}
                        value={inputs.desc}
                        onChange={handleInput} 
                    />
                </FormControl>
                <FormControl id="price" mt="10px">
                    <FormLabel>Price</FormLabel>
                    <Input
                        _placeholder={{ color: 'gray.500' }}
                        type="number"
                        name="price"
                        defaultValue={product.price}
                        value={inputs.price}
                        onChange={handleInput}
                    />
                </FormControl>
                <FormControl id="categores" mt="10px">
                    {/* <FormLabel>Categories</FormLabel>
                    <Input
                        _placeholder={{ color: 'gray.500' }}
                        type="text"
                        name="categories"
                        defaultValue={product.categories}
                        value={inputs.categories}
                        onChange={handleInput}
                    /> */}
                  <FormLabel>Categories</FormLabel>
                  <Select name="categories" defaultValue="Automotive" onChange={handleInput}>
                    <option value="Automotive">Automotive</option>
                    <option value="Construction">Construction</option>
                    <option value="Others">Others</option>
                  </Select>
                </FormControl>
                <FormControl id="materials" mt="10px">
                    <FormLabel>Materials</FormLabel>
                    <Input
                        _placeholder={{ color: 'gray.500' }}
                        type="text"
                        name="materials"
                        defaultValue={product.materials}
                        value={inputs.materials}
                        onChange={handleInput}
                    />
                </FormControl>
                <FormControl id="materialsDesc" mt="10px">
                    <FormLabel>Materials Desc</FormLabel>
                    <Textarea 
                        name="materialsDesc"
                        defaultValue={product.materialsDesc}
                        value={inputs.materialsDesc}
                        onChange={handleInput}
                    />
                </FormControl>
                <FormControl mt="10px">
                <FormLabel>In Stock</FormLabel>
                <Select name="inStock" onChange={handleInput}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </Select>
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
        <Flex flexDirection="column" gap="20px" flex="4">
            <Box>
                <Text fontSize="2xl" as="b">Product</Text>
                <Chart data={productStats} dataKey="Sales" title="Sales Performance"/>
            </Box>
 
            <Flex padding="20px" margin="0 20px 0 20px" shadow="lg">
            <Card
                width="100%"
                direction={{ base: 'column', sm: 'column' }}
                overflow='hidden'
                >
                <Flex padding="20px">
                    <Image
                    objectFit='cover'
                    maxW={{ base: '200px', sm: '500px' }}
                    src={product.img}
                    alt={product.img}
                    />
                </Flex>
                <Stack>
                    <CardBody>
                    <Heading size='md'>{product?.title}</Heading>

                    <Text py='2'>
                        {product?.desc}
                    </Text>

                    Category:
                    <Text ml="5px" py='2' as="b">
                      {product?.categories}
                    </Text><br></br>

                    <Text py='2' as="b">
                        {product?.materials}
                    </Text>

                    <Text py='2'>
                        {product?.materialsDesc}
                    </Text>

                    <Text py='2' as="b">
                        $ {product?.price}
                    </Text>

                    {product?.inStock === true ?
                    <Text py='2'>
                        Available
                    </Text>
                    :
                    <Text py='2'>
                        Not Available
                    </Text>
                    
                    }
                <Flex justifyContent="flex-end" alignSelf="flex-end" width="100%">
                    <Button colorScheme="green" onClick={onOpen}>Update Product</Button>
                </Flex>
            </CardBody>
                </Stack>
            </Card>
            </Flex>   
        </Flex>
    </Sidebar>
    </>
  )
}

