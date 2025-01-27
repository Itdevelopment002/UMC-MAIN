import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./VideoGallery.css";

const VideoGallery = () => {
  const videos1 = [
    "https://www.youtube.com/embed/oN5d86o_cKQ?si=OR0l7rzx9mVgumkB",
    "https://www.youtube.com/embed/WvrIy7ui93E?si=yK5BH6L6LUq3dfKz",
    "https://www.youtube.com/embed/gb0mQNWTDVY?si=VZuS3HrC8yoA6gwe",
    "https://www.youtube.com/embed/bbGujp_SQT8?si=4KO9tFkhjC_czZnu",
    "https://www.youtube.com/embed/PKY8qe7PfmI?si=P4jlYsfeggH5Y1fv",
    "https://www.youtube.com/embed/CVOY-266IpE?si=CbGn8_M0_gx1zsxH",
    "https://www.youtube.com/embed/B4Xrokzim1s?si=AYZzPL_95DGsWSBR",
    "https://www.youtube.com/embed/oA4PXdfGBlk?si=-LtGFw6fOPrQCvdN",
  ];

  const videos2 = [
    "https://www.youtube.com/embed/2ozw8hWZjMA?si=XPJ5seE5SNVAAhQp",
    "https://www.youtube.com/embed/Rdjwn3asrDc?si=gFf4upfyXJso58CX",
    "https://www.youtube.com/embed/rI-Od8NxUFM?si=h5MDAPCOnoHZRX-e",
    "https://www.youtube.com/embed/QWufzY3Oy3g?si=RVwxWLRemRckSpG9",
    "https://www.youtube.com/embed/UVYGy-dYWMg?si=9rTFySFndrkBuBof",
    "https://www.youtube.com/embed/pBH2CMS8A3g?si=0_chwIXpThe4E-Jt",
    "https://www.youtube.com/embed/tC_XQ-9PArU?si=Kk24aXxy5kWRnOyI",
    "https://www.youtube.com/embed/hd1O6ZjbcOM?si=6wp9YpwjG1FNp4Wf",
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  <iframe
                    src={video}
                    title={`Video1-${index + 1}`}
                    className="img-styling-photo rounded"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
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
                  <iframe
                    src={video}
                    title={`Video2-${index + 1}`}
                    className="img-styling-photo rounded"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
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
