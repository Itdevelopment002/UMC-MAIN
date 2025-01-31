import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import "./PhotoGallery.css";
import api, { baseURL } from "../api";

const PhotoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState({});

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
          {categories.map((category) => (
            <div className="mt-4 image-section-div" key={category.id}>
              <h3 className="text-orange">
                {category.name} <span className="text-black"></span>
                <span className="divider"></span>
              </h3>
              <hr />
              <div className="row g-3">
                {images[category.id] && images[category.id].map((image, index) => (
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
