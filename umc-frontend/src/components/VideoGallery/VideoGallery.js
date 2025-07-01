import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./VideoGallery.css";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import api, { baseURL } from "../api";

const VideoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState({});
  const [bgImage, setBgImage] = useState("");
  const [currentIndices, setCurrentIndices] = useState({});
  const { i18n, t } = useTranslation();

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");
      const selectedBanner = response.data.find(banner => banner.banner_name === "Video-Gallery");
      if (selectedBanner) {
        setBgImage(`${baseURL}${selectedBanner.file_path}`);
      }
    } catch (error) {
      console.error("Error fetching header image:", error);
    }
  };

  useEffect(() => {
    api.get(`/video-categories?lang=${i18n.language}`)
      .then((response) => {
        setCategories(response.data.reverse());
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, [i18n.language]);

  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach((category) => {
        api.get(`/category-videos/${category.id}`)
          .then((response) => {
            setVideos((prevVideos) => ({
              ...prevVideos,
              [category.id]: [...response.data].reverse().map(video => video.video_url),
            }));
            setCurrentIndices((prevIndices) => ({
              ...prevIndices,
              [category.id]: 0,
            }));
          })
          .catch((error) => console.error("Error fetching videos:", error));
      });
    }
  }, [categories]);


  useEffect(() => {
    fetchHeaderImage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNext = (categoryId) => {
    setCurrentIndices((prevIndices) => {
      const totalVideos = videos[categoryId]?.length || 0;
      const newIndex = prevIndices[categoryId] + 8;
      return {
        ...prevIndices,
        [categoryId]: newIndex < totalVideos ? newIndex : prevIndices[categoryId],
      };
    });
  };

  const handlePrevious = (categoryId) => {
    setCurrentIndices((prevIndices) => {
      const newIndex = prevIndices[categoryId] - 8;
      return {
        ...prevIndices,
        [categoryId]: newIndex >= 0 ? newIndex : 0,
      };
    });
  };

  return (
    <>
      <div
        className="history-header-image"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-2 mb-5" id="video-gallery-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">{t("breadcrumbHome")}</Link>
            <span className="breadcrumb-item text-decoration-none">{t("gallery.breadcrumb")}</span>
            <span className="breadcrumb-item active1">{t("gallery.video")} {t("gallery.gallery")}</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">{t("gallery.video")}</span>
            <span className="highlighted-text"> {t("gallery.gallery")}</span>
          </h2>
          {categories.map((category) => (
            <div className="mt-4 image-section-div" key={category.id}>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <h3 className="text-orange">{category.name}</h3>
                {videos[category.id] && videos[category.id].length > 8 && (
                  <div className="slider-controls">
                    <button onClick={() => handlePrevious(category.id)} className="gallery-custom-btn">
                      <MdKeyboardArrowLeft size={20} />
                    </button>
                    <button onClick={() => handleNext(category.id)} className="gallery-custom-btn">
                      <MdKeyboardArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>
              <hr />
              <div className="row g-3">
                {videos[category.id] && videos[category.id]
                  .slice(currentIndices[category.id], currentIndices[category.id] + 8)
                  .map((video, index) => (
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
