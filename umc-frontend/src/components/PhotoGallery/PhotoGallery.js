import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import "./PhotoGallery.css";
import img1 from "../../assets/images/Gallery/PhotoGallery/Temples/temple1.png";
import img2 from "../../assets/images/Gallery/PhotoGallery/Temples/temple2.png";
import img3 from "../../assets/images/Gallery/PhotoGallery/Temples/temple3.png";
import img4 from "../../assets/images/Gallery/PhotoGallery/Temples/temple4.png";
import img5 from "../../assets/images/Gallery/PhotoGallery/Temples/temple5.png";
import img6 from "../../assets/images/Gallery/PhotoGallery/Temples/temple6.png";
import img7 from "../../assets/images/Gallery/PhotoGallery/Temples/temple7.png";
import img8 from "../../assets/images/Gallery/PhotoGallery/Temples/temple8.png";
import img9 from "../../assets/images/Gallery/PhotoGallery/Marathi/lang1.png";
import img10 from "../../assets/images/Gallery/PhotoGallery/Marathi/lang2.png";
import img11 from "../../assets/images/Gallery/PhotoGallery/Marathi/lang3.png";
import img12 from "../../assets/images/Gallery/PhotoGallery/Marathi/lang4.png";
import img13 from "../../assets/images/Gallery/PhotoGallery/Marathi/lang5.png";
import img14 from "../../assets/images/Gallery/PhotoGallery/Marathi/lang6.png";
import img15 from "../../assets/images/Gallery/PhotoGallery/Marathi/lang7.png";
import img16 from "../../assets/images/Gallery/PhotoGallery/Marathi/lang8.png";
import img17 from "../../assets/images/Gallery/PhotoGallery/Har_Ghar_tiranga/1.jpeg";
import img18 from "../../assets/images/Gallery/PhotoGallery/Har_Ghar_tiranga/2.jpeg";
import img19 from "../../assets/images/Gallery/PhotoGallery/Har_Ghar_tiranga/3.jpeg";
import img20 from "../../assets/images/Gallery/PhotoGallery/Har_Ghar_tiranga/4.jpeg";
import img21 from "../../assets/images/Gallery/PhotoGallery/Har_Ghar_tiranga/5.jpeg";
import img22 from "../../assets/images/Gallery/PhotoGallery/Har_Ghar_tiranga/6.jpeg";
import img23 from "../../assets/images/Gallery/PhotoGallery/Har_Ghar_tiranga/7.jpeg";
import img24 from "../../assets/images/Gallery/PhotoGallery/Har_Ghar_tiranga/8.jpeg";

const PhotoGallery = () => {
  const temples = [img1, img2, img3, img4, img5, img6, img7, img8];
  const languages = [img9, img10, img11, img12, img13, img14, img15, img16];
  const harghartiranga = [img17, img18, img19, img20, img21, img22, img23, img24];

  useEffect(() => {
    GLightbox({ selector: ".glightbox" });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="history-header-image"></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-2 mb-5" id="photo-gallery-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Gallery
            </Link>
            <span className="breadcrumb-item active1">Photo Gallery</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Photo</span>
            <span className="highlighted-text"> Gallery</span>
          </h2>

          {/* Temple Photos*/}
          <div className="mt-4 image-section-div">
            <h3 className="text-orange">
              Temple <span className="text-black">Photos</span>
              <span className="divider"></span>
            </h3>
            <hr />
            <div className="row g-3">
              {temples.map((temple, index) => (
                <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={index}>
                  <a href={temple} className="glightbox" data-gallery="temples">
                    <img
                      src={temple}
                      alt={`Temple-${index + 1}`}
                      className="img-styling-photo rounded"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Marathi Language Day */}
          <div className="mt-5 image-section-div">
            <h3 className="text-orange">
              Marathi <span className="text-black">Language Day</span>
              <span className="divider"></span>
            </h3>
            <hr />
            <div className="row g-3">
              {languages.map((language, index) => (
                <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={index}>
                  <a
                    href={language}
                    className="glightbox"
                    data-gallery="languages"
                  >
                    <img
                      src={language}
                      alt={`Language-${index + 1}`}
                      className="img-styling-photo rounded"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Har Ghar Tiranga */}
          <div className="mt-5 image-section-div">
            <h3 className="text-orange">
              Har Ghar <span className="text-black">Tiranga</span>
              <span className="divider"></span>
            </h3>
            <hr />
            <div className="row g-3">
              {harghartiranga.map((language, index) => (
                <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={index}>
                  <a
                    href={language}
                    className="glightbox"
                    data-gallery="languages"
                  >
                    <img
                      src={language}
                      alt={`Language-${index + 1}`}
                      className="img-styling-photo rounded"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PhotoGallery;
