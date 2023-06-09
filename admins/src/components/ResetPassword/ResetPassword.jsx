import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { publicRequest } from '../../useFetch';
import { Button, Container, Flex, FormControl, FormLabel, Input, Text, Box, useColorModeValue, Stack } from '@chakra-ui/react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      setResetToken(token);
    } else {
      // Handle case when reset token is missing or invalid
      navigate('/signin'); // Navigate to the forgot password page
    }
  }, [location, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await publicRequest.post('/reset-password', { resetToken, newPassword });

      if (response.status === 200) {
        setMessage('Password reset successfully');
        setTimeout(() => {
          navigate("/", { replace : true });
        }, 1000)
      }
    } catch (error) {
      console.log(error);
      setMessage('Failed to reset password');
    }
  };

  return (
    <>
    <Container display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      {errorMessage && <Text>{errorMessage}</Text>}
      <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
          <Flex flexDirection="column" alignItems="center">
            <Text as="b">Reset Password</Text>

            <form onSubmit={handleResetPassword} style={{ width: "300px" }}>
              <FormControl mt="10px">
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  isRequired
                />
              </FormControl>
              <Button mt="10px" type="submit">Reset Password</Button>
            </form>

            {message && <p>{message}</p>}
          </Flex>
          </Stack>
        </Box>
    </Container>
    </>
  );
};

export default ResetPassword;
