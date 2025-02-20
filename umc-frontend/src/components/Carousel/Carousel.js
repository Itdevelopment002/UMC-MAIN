import React, { useState, useEffect } from "react";
import "./Carousel.css";
import AOS from "aos";
import "aos/dist/aos.css";
import api, { baseURL } from "../api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useTranslation } from "react-i18next";

const Carousel = () => {
  useEffect(() => {
    AOS.init({ duration: 350, delay: 100, once: true });
  }, []);

  const backgroundColors = ["#ddecf5", "#E0F8F2", "#EEECFF", "#FAEDED"];
  const [sliders, setSliders] = useState([]);
  const [ministers, setMinisters] = useState([]);
  const { i18n, t } = useTranslation();

  const fetchSliders = async () => {
    try {
      const response = await api.get("/sliders");
      setSliders(response.data);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  const fetchMinisters = async () => {
    try {
      const response = await api.get(`/minister-details?lang=${i18n.language}`);
      setMinisters(response.data);
    } catch (error) {
      console.error("Error fetching ministers:", error);
    }
  };

  useEffect(() => {
    fetchSliders();
    fetchMinisters();
  }, [i18n.language]);

  return (
    <div className="container-fluid">
      <div className="row home-carousel-section">
        <div className="col-md-12 col-lg-12 col-xl-5 col-xxl-3 col-12 custom-profile-card1">
          <div className="row">
            {ministers.map((minister, index) => (
              <div key={minister.id} className="col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-12">
                <div data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                  <ProfileCard
                    name={minister.name}
                    position={minister.designation}
                    image={`${baseURL}/${minister.image_path}`}
                    bgColor={backgroundColors[index % backgroundColors.length]}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-12 col-lg-12 col-xl-7 col-xxl-9 col-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            effect="fade"
            speed={1000}
            className="carousel-image-slider mt-2"
          >
            {sliders.map((slide, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`${baseURL}/${slide.image_path}`}
                  alt={slide.slider_name || "Slide"}
                  className="img image-4 rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ name, position, image, bgColor }) => {
  return (
    <div className="custom-profile-card" style={{ backgroundColor: bgColor }}>
      <div className="align-items-center custom-flex">
        <img src={image} alt={name} className="me-3 image" />
        <div>
          <h6 className="mb-0 name-color">{name}</h6>
          <p className="mb-0 text-muted small position-custom">{position}</p>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
