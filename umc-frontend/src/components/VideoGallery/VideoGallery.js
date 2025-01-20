import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./VideoGallery.css";
import video1 from "../../assets/images/Gallery/VideoGallery/video1.png";
import video2 from "../../assets/images/Gallery/VideoGallery/video2.png";
import video3 from "../../assets/images/Gallery/VideoGallery/video3.png";
import video4 from "../../assets/images/Gallery/VideoGallery/video4.png";
import video5 from "../../assets/images/Gallery/VideoGallery/video5.png";
import video6 from "../../assets/images/Gallery/VideoGallery/video6.png";
import video7 from "../../assets/images/Gallery/VideoGallery/video7.png";
import video8 from "../../assets/images/Gallery/VideoGallery/video8.png";
import video9 from "../../assets/images/Gallery/VideoGallery/video9.png";
import video10 from "../../assets/images/Gallery/VideoGallery/video10.png";
import video11 from "../../assets/images/Gallery/VideoGallery/video11.png";
import video12 from "../../assets/images/Gallery/VideoGallery/video12.png";
import video13 from "../../assets/images/Gallery/VideoGallery/video13.png";
import video14 from "../../assets/images/Gallery/VideoGallery/video14.png";
import video15 from "../../assets/images/Gallery/VideoGallery/video15.png";
import video16 from "../../assets/images/Gallery/VideoGallery/video16.png";

const VideoGallery = () => {
  const videos1 = [video1, video2, video3, video4, video5, video6, video7, video8];

  const videos2 = [video9, video10, video11, video12, video13, video14, video15, video16];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="history-header-image"></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-2 mb-5" id="video-gallery-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              Home
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              Gallery
            </Link>
            <span className="breadcrumb-item active1">Video Gallery</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">Video</span>
            <span className="highlighted-text"> Gallery</span>
          </h2>
          <div className="mt-4 image-section-div">
            <h3 className="text-orange">
              Video <span className="text-black">Heading</span>
              <span className="divider"></span>
            </h3>
            <hr />
            <div className="row g-3">
              {videos1.map((video, index) => (
                <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={index}>
                  <img
                    src={video}
                    alt={`Video1-${index + 1}`}
                    className="img-styling-photo rounded"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 image-section-div">
            <h3 className="text-orange">
              Video <span className="text-black">Heading</span>
              <span className="divider"></span>
            </h3>
            <hr />
            <div className="row g-3">
              {videos2.map((video, index) => (
                <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={index}>
                  <img
                    src={video}
                    alt={`Video2-${index + 1}`}
                    className="img-styling-photo rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoGallery;
