import React, { useState, useContext } from 'react';
import {
  Stack,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { IsUserProfile } from '../../helper/UserProfileProvider'

const CarouselContent1 = () => {
  const [showMore, setShowMore] = useState(false);
  const { userProfileData } = useContext(IsUserProfile)

  console.log("KONTOL", userProfileData.length)

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <Flex
      w={'full'}
      h={'100vh'}
      backgroundImage={
        'url(https://raysoncorp.com/wp-content/themes/raysoncorp/assets/img/releaseagent-banner.png)'
      }
      backgroundSize={'cover'}
      backgroundPosition={'center center'}
    >
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
      >
        <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}
          >
            A release agent is a chemical used to prevent other materials from bonding to surfaces.
          </Text>
          <Stack direction={'row'}>
            <Button
              bg={'blue.400'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              as="a"
              href='/'
            >
              Back to Home
            </Button>
            <Button
              bg={'blue.400'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              onClick={handleShowMoreClick}
            >
              {showMore ? 'Close' : 'Show me more'}
            </Button>
          </Stack>
          {showMore && (
            <Text
              color={'white'}
              fontWeight={700}
              lineHeight={1.2}
            >
              <p>
                Release agents provide the critical barrier between a molding surface and the substrate, facilitating separation of the cured part from the mold.
              </p><br></br>
              <p>
                It can provide a solution in processes involving mold release for die-cast, plastic, composite, rubber, tire, polyurethane, wood composite, and concrete.
              </p><br></br>
              <p>
                Release agents may be water or solvent-based and use of either will depend on the personal preference of the molder, plant safety regulations, hazardous materials shipping costs, state, local, or domestic regulations, and/or desired drying times of the release coating.
              </p><br></br>
              <p>
                Water-based release agents will be less expensive to ship because of their inherently non-flammable nature and satisfy most plant-safety goals.
              </p><br></br>
              <p>
                Solvent-based release coatings dry almost instantly but present serious health and safety concerns. Fumes from solvent-based release agents may be hazardous without proper ventilation of the work area.
              </p><br></br>
              <p>
                Many kinds of release agents are used. They are waxes, fatty ester, silicones, and metallic soaps.
              </p>
            </Text>
          )}
        </Stack>
      </VStack>
    </Flex>
  );
};

export default CarouselContent1;
