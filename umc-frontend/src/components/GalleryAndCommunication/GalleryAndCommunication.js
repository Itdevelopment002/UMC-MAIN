import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./GalleryAndCommunication.css";
import img1 from "../../assets/images/Gallery/gallary-image6.png";
import img2 from "../../assets/images/Gallery/gallery-image2.png";
import img3 from "../../assets/images/Gallery/gallery-image3.png";
import img4 from "../../assets/images/Gallery/gallery-image4.png";
import img5 from "../../assets/images/Gallery/gallery-image5.png";
import img6 from "../../assets/images/Gallery/gallery-image1.png";
import img7 from "../../assets/images/Gallery/communication-1.png";
import img8 from "../../assets/images/Gallery/communication-2.png";
import ambulanceIcon from "../../assets/images/Gallery/ambulance 1.png";
import swargarathIcon from "../../assets/images/Gallery/school-bus 1.png";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

const GalleryAndCommunication = () => {
  const galleryImages = [img1, img2, img3, img4, img5, img6];

  useEffect(() => {
    GLightbox({
      selector: ".glightbox",
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="container-fluid font-fam mt-4 mb-4" id="image-com-section">
      <div className="row ">
        <div className="col-lg-8 ">
          <div className="citigen">
            <div className="vertical-line"></div>
            <div className="title-container">
              <h2 className="section-title">
                Photo <span className="subtitle">Gallery</span>
              </h2>
            </div>
            <Link to="/photo-gallery" className="view-all-link">View All</Link>
          </div>

          <div className="row">
            {galleryImages.map((image, index) => (
              <div className="col-6 col-sm-6 col-md-4 mb-3" key={index}>
                <div className="card border-0">
                  <Link to={image} className="glightbox">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="image-style-2 rounded-2"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4 citizen-communication-div">
          <div className="citigen">
            <div className="vertical-line"></div>
            <div className="d-flex">
              <h2 className="section-title">
                Citizen <span className="subtitle">Communication</span>
              </h2>
            </div>
          </div>
          <div
            className="card card-2 px-3 p-2"
            style={{ background: "#E2F3FD" }}
          >
            <Link to="https://pgportal.gov.in/cpgoffice/" target="_blank" className="text-decoration-none custom-communication-effect">
              <div className="mb-0">
                <div className="d-flex align-items-center px-2">
                  <img
                    src={img7}
                    alt="Government of India"
                    className="image-style-com-2 me-3"
                  />
                  <div>
                    <h6 className="mb-1 h6-styling-gallery">Government of India</h6>
                    <small className="text-styling-small">PG Portal</small>
                  </div>
                </div>
              </div>
            </Link>
            <hr
              style={{
                backgroundColor: "#832E37",
                height: "2px",
                border: "none",
              }}
            />
            <Link to="https://grievances.maharashtra.gov.in/en" target="_blank" className="text-decoration-none custom-communication-effect">
              <div className="mb-1">
                <div className="d-flex align-items-center px-2">
                  <img
                    src={img8}
                    alt="Maharashtra State"
                    className="image-style-com-2 me-3"
                  />
                  <div>
                    <h6 className="mb-1 h6-styling-gallery">Maharashtra State</h6>
                    <small className="text-styling-small">Grievance Registration</small>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="contact-section mt-3">
            <div className="d-flex align-items-center mb-1 px-2">
              <Link to="tel:9607977404" className="contact-link">
                <img
                  src={ambulanceIcon}
                  alt="Ambulance"
                  className="communication-contact-icon me-2"
                />
                <span className="communication-contact-text">Ambulance - 9607977404</span>
              </Link>
            </div>
            <hr
              style={{
                backgroundColor: "#0000004D",
                height: "1px",
                border: "none",
                padding: '0px',
                margin: '0px'
              }}
            />
            <div className="d-flex align-items-center px-2">
              <Link to="tel:9607977456" className="contact-link">
                <img
                  src={swargarathIcon}
                  alt="Swargarath"
                  className="communication-contact-icon me-2"
                />
                <span className="communication-contact-text">Swargarath - 9607977456</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GalleryAndCommunication;
