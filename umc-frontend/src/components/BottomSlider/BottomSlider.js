import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./BottomSlider.css";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-next-arrow" onClick={onClick}>
      <FaChevronRight size={15} />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-prev-arrow" onClick={onClick}>
      <FaChevronLeft size={15} />
    </div>
  );
};

const BottomSlider = () => {
  const [sliders, setSliders] = useState([]);


  const fetchSliders = async ()=> {
    try{
      const response = await api.get("/bottom-sliders");
      setSliders(response.data);
    } catch(error){
      console.error("Error fetching sliders", error)
    }
  }

  useEffect(()=>{
    fetchSliders();
  },[]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 868,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          className: "slider-padding",
        },
      },
    ],
  };

  return (
    <section className="client-logo-slider my-3 mx-5">
      <div className="content-box">
        <div className="inner-box">
          <Slider {...settings}>
            {sliders.map((logo, index) => (
              <div key={index} className="logo-slide">
                <Link to={logo.websitelink} target="_blank" rel="noopener noreferrer">
                  <img src={`${baseURL}${logo.websitelogo}`} alt={logo.id} />
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default BottomSlider;
