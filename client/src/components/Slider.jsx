import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Heading,
  Text,
  Container,
} from '@chakra-ui/react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import Slider from 'react-slick';
import Banner from '../assets/Imagez.jpg';
import { Link } from 'react-router-dom';

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function Carousel() {
  const [slider, setSlider] = useState([]);
  const sliderIdRef = useRef(0);
  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '40px' });

  const cards = [
    {
      title: 'Release Agent',
      text:
        "A release agent (also mold release agent, release coating, or mold release coating) is a chemical used to prevent other materials from bonding to surfaces.",
      image: Banner,
      href: '/carouselcontent1',
    },
  ];

  return (
    <Box
      position={'relative'}
      height={'500px'}
      width={'full'}
      overflow={'hidden'}
      padding="30px"
    >
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        {cards.map((card, index) => (
          <Box
            key={index}
            height={'500px'}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover" // Change the backgroundSize property
            objectFit="cover"
            backgroundImage={`url(${card.image})`}
          >
            <Container size="container.lg" height="600px" position="relative">
              <Stack
                spacing={6}
                w={'full'}
                maxW={'lg'}
                position="absolute"
                top="50%"
                transform="translate(0, -50%)"
              >
                <Link to={card.href}>
                  <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                    {card.title}
                  </Heading>
                </Link>
                <Text fontSize={{ base: 'md', lg: 'lg' }} color="black" fontWeight="bold">
                  {card.text}
                </Text>
              </Stack>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
