import { Flex, Img, Text } from '@chakra-ui/react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/swiper.min.css';

const Slider = () => {

  const dataSlider = [
    {
      image : "https://fashion-slider.uiinitiative.com/images/nike.jpg",
      text : "NIKE"
    },
    {
      image : "https://fashion-slider.uiinitiative.com/images/nike.jpg",
      text : "NIKE"
    },
    {
      image : "https://fashion-slider.uiinitiative.com/images/nike.jpg",
      text : "NIKE"
    },
  ]

  return (
    <Flex>
    <Swiper
      navigation={true} modules={[Navigation]} className="mySwiper" 
      >
        {dataSlider.map((item, index) => {
          return (
          <SwiperSlide key={index}>
            <Flex alignItems="center" justifyContent="center">
              <Flex position="relative">
                  <Img width="100%" height="fit-content" objectFit="cover" src={item.image} />
              </Flex>
              <Text fontSize="150px" marginLeft="150px" position="absolute">{item.text}</Text>
            </Flex>
          </SwiperSlide>
          )
        })}
    </Swiper>
    </Flex>
  )
}

export default Slider;
