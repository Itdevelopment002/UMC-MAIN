import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const AddProjectCategory = () => {
  const [heading, setHeading] = useState("");
  const [language, setLanguage] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!heading.trim()) {
      validationErrors.heading = "Project Heading is required.";
    }
    if (!language.trim()) {
      validationErrors.language = "Language selection is required";
    }
    if (images.length === 0) {
      validationErrors.images = "Please upload at least one image.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("language_code", language);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await api.post("/project-category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        navigate("/project-details");
      }
    } catch (error) {
      console.error("Error adding project details:", error);
    }
  };

  const handleHeadingChange = (e) => {
    setHeading(e.target.value);
    if (errors.heading) {
      setErrors((prevErrors) => ({ ...prevErrors, heading: "" }));
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (errors.language) {
      setErrors((prevErrors) => ({ ...prevErrors, language: "" }));
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validImages = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)
    );

    if (validImages.length !== selectedFiles.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: "Only JPEG, PNG, JPG, or WEBP formats are allowed.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, images: "" }));
      setImages(validImages);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Upcoming Projects</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/project-details">Project Details</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Project Category
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Category</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.language ? "is-invalid" : ""
                            }`}
                          value={language}
                          onChange={handleLanguageChange}
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Project Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.heading ? "is-invalid" : ""
                            }`}
                          value={heading}
                          onChange={handleHeadingChange}
                          placeholder="Enter Project Heading"
                        />
                        {errors.heading && (
                          <div className="invalid-feedback">
                            {errors.heading}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Project Images <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="images"
                          name="images"
                          className={`form-control col-md-12 col-xs-12 userfile ${errors.images ? "is-invalid" : ""
                            }`}
                          multiple
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                        {errors.images && (
                          <span className="invalid-feedback">
                            {errors.images}
                          </span>
                        )}
                        <small className="text-muted">
                          📌 Note: Image resolution must be <b>314 x 410</b> pixels.
                        </small>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary btn-sm"
                      value="Submit"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectCategory;