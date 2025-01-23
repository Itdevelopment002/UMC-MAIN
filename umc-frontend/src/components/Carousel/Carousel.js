import React, { useState, useEffect } from "react";
import "./Carousel.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import api, { baseURL } from "../api";

const Carousel = () => {
  useEffect(() => {
    AOS.init({
      duration: 350,
      delay: 100,
      once: true,
    });
  }, []);

  const backgroundColors = ["#E0F8F2", "#EEECFF", "#FAEDED"];
  const [sliders, setSliders] = useState([]);
  const [ministers, setMinisters] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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
      const response = await api.get("/minister-details");
      setMinisters(response.data);
    } catch (error) {
      console.error("Error fetching ministers:", error);
    }
  };

  useEffect(() => {
    fetchSliders();
    fetchMinisters();
  }, []);

  useEffect(() => {
    if (sliders.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [sliders.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="container-fluid">
      <div className="row home-carousel-section">
        <div className="col-md-12 col-lg-4 col-xl-4 col-xxl-3 col-12 custom-profile-card1">
          {ministers.map((minister, index) => (
            <div
              key={minister.id}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            >
              <ProfileCard
                name={minister.name}
                position={minister.designation}
                image={`${baseURL}/${minister.image_path}`}
                bgColor={backgroundColors[index % backgroundColors.length]}
              />
            </div>
          ))}
        </div>

        <div className="col-md-12 col-lg-8 col-xl-8 col-xxl-9 col-12">
          <div className="carousel-image-slider position-relative">
            {sliders.length > 0 && (
              <img
                src={`${baseURL}/${sliders[currentSlide]?.file_path}`}
                alt={sliders[currentSlide]?.slider_name || "Slide"}
                className="img-fluid rounded"
              />
            )}

            <div className="dot-container">
              {sliders.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentSlide === index ? "active" : ""}`}
                  onClick={() => handleSlideChange(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ name, position, image, bgColor }) => {
  return (
    <div className='custom-profile-card' style={{ backgroundColor: bgColor }} >
      <div className="d-flex align-items-center">
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
