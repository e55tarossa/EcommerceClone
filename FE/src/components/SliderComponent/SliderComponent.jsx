import React from 'react'
import { Image } from 'antd';
import Slider from "react-slick"
import { WrapperSliderStyle } from './style';

const SliderComponent = () => {
    const ImageSlide = [
        "https://salt.tikicdn.com/cache/w1080/ts/tikimsp/a1/8c/6e/b6df35ecd0028fd8840e0bca26e52268.png.webp",
        "https://salt.tikicdn.com/cache/w1080/ts/tikimsp/36/00/c1/3956c899131584eb277d6c39956206ff.png.webp",
        "https://salt.tikicdn.com/cache/w1080/ts/tikimsp/a4/1a/fa/b9616b5c38c66fd40cd7ea1a5798c036.jpg.webp"
    ]
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000
    };
    return (
        <WrapperSliderStyle {...settings}>
            {ImageSlide.map((image) => {
                return (
                    <Image key={image} src={image} alt="slider" preview={false} width="100%" height="274px"/>
                )
            })}
        </WrapperSliderStyle>
    )
}

export default SliderComponent