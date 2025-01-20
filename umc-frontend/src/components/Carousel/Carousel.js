// import React, { useState, useEffect } from "react";
// import "./Carousel.css";
// import slide1 from "../../assets/images/banner/img2.png";
// import slide2 from "../../assets/images/banner/img3.jpg";
// import slide3 from "../../assets/images/banner/img4.jpeg";
// import slide4 from "../../assets/images/banner/img1.jpeg";
// import cmImage1 from "../../assets/images/banner/cm 1 (1).png";
// import cmImage2 from "../../assets/images/banner/dcm1 1.png";
// import cmImage3 from "../../assets/images/banner/dcm2 1.png";
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import api, { baseURL } from "../api";

// const Carousel = () => {
//   useEffect(() => {
//     AOS.init({
//       duration: 350,
//       delay: 100,
//       once: true,
//     });
//   }, []);

//   const [sliders, setSliders] = useState([]);
//   const [ministers, setMinisters] = useState([]);

//   const fetchSliders = async () => {
//     try {
//       const response = await api.get("/sliders");
//       setSliders(response.data);
//     } catch (error) {
//       console.error("Error fetching sliders:", error);
//     }
//   };

// const fetchMinisters = async () => {
//   try {
//     const response = await api.get("/minister-details");
//     setMinisters(response.data);
//   } catch (error) {
//     console.error("Error fetching ministers:", error);
//   }
// };

//   useEffect(()=>{
//     fetchSliders();
//     fetchMinisters();
//   })

//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handleSlideChange = (index) => {
//     setCurrentSlide(index);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % sliders.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [sliders.length]);

//   return (
//     <div className="container-fluid">
//       <div className="row home-carousel-section">
//         <div className=" col-md-12 col-lg-4 col-xl-4 col-xxl-3 col-12 custom-profile-card1 ">

//           <div data-aos="fade-right">
//             <ProfileCard
//               name="Shri. Devendra Fadnavis"
//               position="Hon'ble Chief Minister of Maharashtra"
//               image={cmImage1}
//               bgColor='#E0F8F2'
//             />
//           </div>
//           <div data-aos="fade-left">
//             <ProfileCard
//               name="Shri. Eknath Shinde"
//               position="Hon'ble Deputy Chief Minister of Maharashtra"
//               image={cmImage2}
//               bgColor="#EEECFF"
//             />
//           </div>
//           <div data-aos="fade-right">
//             <ProfileCard
//               name="Shri. Ajit Pawar"
//               position="Hon'ble Deputy Chief Minister of Maharashtra"
//               image={cmImage3}
//               bgColor="#FAEDED"
//             />
//           </div>
//         </div>

//         <div className="col-md-12 col-lg-8 col-xl-8 col-xxl-9 col-12">
//           <div className="carousel-image-slider position-relative">
//             {sliders.length > 0 && (
//               <img
//                 src={`${baseURL}/${sliders[currentSlide]?.file_path}`}
//                 alt={sliders[currentSlide]?.slider_name || "Slide"}
//                 className="img-fluid rounded"
//               />
//             )}
//             <div className="dot-container">
//               {sliders.map((slide, index) => (
//                 <span
//                   key={slide.id}
//                   className={`dot ${currentSlide === index ? "active" : ""}`}
//                   onClick={() => handleSlideChange(index)}
//                 ></span>
//               ))}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// const ProfileCard = ({ name, position, image, bgColor }) => {
//   return (
//     <div className='custom-profile-card' style={{ backgroundColor: bgColor }} >
//       <div className="d-flex align-items-center" >
//         <img
//           src={image}
//           alt={name}
//           className="me-3 image"
//         />
//         <div>
//           <h6 className="mb-0 name-color">{name}</h6>
//           <p className="mb-0 text-muted small position-custom">{position}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Carousel;

import React, { useState, useEffect } from "react";
import "./Carousel.css";
import cmImage1 from "../../assets/images/banner/cm 1 (1).png";
import cmImage2 from "../../assets/images/banner/dcm1 1.png";
import cmImage3 from "../../assets/images/banner/dcm2 1.png";
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
            <ProfileCard
              name={minister.name}
              position={minister.designation}
              image={`${baseURL}/${minister.image_path}`}
              bgColor={minister.bgcolor}
            />
          ))
          }
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

            {/* Dots Navigation */}
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
