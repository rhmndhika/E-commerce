import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

const Loading = () => (
  <Flex justify="center" align="center" height="100vh">
    <Spinner size="xl" />
  </Flex>
);

export default Loading;
