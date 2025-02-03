import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./VideoGallery.css";
import api, { baseURL } from "../api"

const VideoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState({});
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    fetchHeaderImage();
  }, []);
  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let selectedBanner = response.data.find(banner => banner.banner_name === "Video-Gallery");

        if (selectedBanner) {
          setBgImage(`${baseURL}${selectedBanner.file_path}`);
        } else {
          console.error("Banner with specified name not found.");
        }
      } else {
        console.error("No banner image found.");
      }
    } catch (error) {
      console.error("Error fetching header image:", error);
    }
  };

  useEffect(() => {
    api.get("/video-categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach((category) => {
        api.get(`/category-videos/${category.id}`)
          .then((response) => {
            setVideos((prevVideos) => ({
              ...prevVideos,
              [category.id]: response.data.map(video => video.video_url),
            }));
          })
          .catch((error) => console.error("Error fetching videos:", error));
      });
    }
  }, [categories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div
        className="history-header-image"
        style={{
          backgroundImage: `url(${bgImage})`,

        }}
      ></div>

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
          {categories.map((category) => (
            <div className="mt-4 image-section-div" key={category.id}>
              <h3 className="text-orange">
                {category.name} <span className="text-black"></span>
                <span className="divider"></span>
              </h3>
              <hr />
              <div className="row g-3">
                {videos[category.id] && videos[category.id].map((video, index) => (
                  <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={index}>
                    <iframe
                      src={video}
                      title={`Video-${category.id}-${index + 1}`}
                      className="img-styling-photo rounded"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoGallery;
