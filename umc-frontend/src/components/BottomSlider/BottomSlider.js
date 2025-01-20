import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./BottomSlider.css";
import { Link } from "react-router-dom";

import logo1 from "../../assets/images/bottom-slider/logo1.png";
import logo2 from "../../assets/images/bottom-slider/logo2.png";
import logo3 from "../../assets/images/bottom-slider/logo3.png";
import logo4 from "../../assets/images/bottom-slider/logo4.png";
import logo5 from "../../assets/images/bottom-slider/logo5.png";
import logo6 from "../../assets/images/bottom-slider/logo6.png";
import logo7 from "../../assets/images/bottom-slider/logo7.png";
import logo8 from "../../assets/images/bottom-slider/logo8.png";
import logo9 from "../../assets/images/bottom-slider/logo9.png";
import logo10 from "../../assets/images/bottom-slider/logo10.png";

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
  const logos = [
    { src: logo1, alt: "Logo 1", link: "https://www.mygov.in/" },
    { src: logo2, alt: "Logo 2", link: "https://pmnrf.gov.in/en/" },
    { src: logo3, alt: "Logo 3", link: "https://www.mahapolice.gov.in/" },
    { src: logo4, alt: "Logo 4", link: "https://trafficpolicemumbai.maharashtra.gov.in/" },
    { src: logo5, alt: "Logo 5", link: "http://mahaprisons.gov.in/Site/Home/Index.aspx" },
    { src: logo6, alt: "Logo 6", link: "https://igrmaharashtra.gov.in/" },
    { src: logo7, alt: "Logo 7", link: "https://pmaymis.gov.in/" },
    { src: logo8, alt: "Logo 8", link: "https://www.india.gov.in/" },
    { src: logo9, alt: "Logo 9", link: "https://www.digitalindia.gov.in/" },
    { src: logo10, alt: "Logo 10", link: "https://acbmaharashtra.gov.in/" },

  ];

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
            {logos.map((logo, index) => (
              <div key={index} className="logo-slide">
                <Link to={logo.link} target="_blank" rel="noopener noreferrer">
                  <img src={logo.src} alt={logo.alt} />
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
