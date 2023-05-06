import React from 'react'
import { 
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'

const ModalNew = ({ children, isOpen, onClose, id }) => {

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered id={id}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ubah {id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>  
          { children }
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='teal' mr={3}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ModalNew