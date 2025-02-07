import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import "./PhotoGallery.css";
import api, { baseURL } from "../api";

const PhotoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState({});
  const [bgImage, setBgImage] = useState("");
  const [currentIndices, setCurrentIndices] = useState({});

  useEffect(() => {
    fetchHeaderImage();
  }, []);

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let selectedBanner = response.data.find(banner => banner.banner_name === "Photo-Gallery");

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
    api.get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach((category) => {
        api.get(`/category-images/${category.id}`)
          .then((response) => {
            setImages((prevImages) => ({
              ...prevImages,
              [category.id]: response.data.map(image => `${baseURL}${image.image_url}`),
            }));
            setCurrentIndices((prevIndices) => ({
              ...prevIndices,
              [category.id]: 0,
            }));
          })
          .catch((error) => console.error("Error fetching images:", error));
      });
    }
  }, [categories]);

  useEffect(() => {
    GLightbox({ selector: ".glightbox" });
  }, [images]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNext = (categoryId) => {
    setCurrentIndices((prevIndices) => {
      const totalImages = images[categoryId]?.length || 0;
      const newIndex = prevIndices[categoryId] + 8;
  
      return {
        ...prevIndices,
        [categoryId]: newIndex < totalImages ? newIndex : prevIndices[categoryId],
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
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>

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
          {categories.map((category) => (
            <div className="mt-4 image-section-div" key={category.id}>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <h3 className="text-orange">
                  {category.name} <span className="text-black"></span>
                  <span className="divider"></span>
                </h3>
                {images[category.id] && images[category.id].length > 8 && (
                  <div className="slider-controls">
                    <button onClick={() => handlePrevious(category.id)} className="gallery-custom-btn">
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button onClick={() => handleNext(category.id)} className="gallery-custom-btn">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>

                )}
              </div>

              <hr />
              <div className="row g-3">
                {images[category.id] && images[category.id].slice(currentIndices[category.id], currentIndices[category.id] + 8).map((image, index) => (
                  <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={index}>
                    <a href={image} className="glightbox" data-gallery={category.name}>
                      <img
                        src={image}
                        alt={`${category.name}-${index + 1}`}
                        className="img-styling-photo rounded"
                      />
                    </a>
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

export default PhotoGallery;