import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const AddProjectCategory = () => {
  const [heading, setHeading] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const validationErrors = {};
    if (!heading.trim()) {
      validationErrors.heading = "Heading is required.";
    }
    if (images.length === 0) {
      validationErrors.images = "Please upload at least one image.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("heading", heading);
    images.forEach((image) => {
      formData.append("images", image); // Use "images" as the field name for multiple files
    });

    try {
      const response = await api.post("/project_images", formData, {
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
              <Link to="/project-details">Project Categories</Link>
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
                        Project Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.heading ? "is-invalid" : ""
                          }`}
                          value={heading}
                          onChange={handleHeadingChange}
                          placeholder="Enter project heading"
                        />
                        {errors.heading && (
                          <div className="text-danger mt-1">
                            {errors.heading}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Upload Images <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="images"
                            name="images"
                            className={`form-control col-md-12 col-xs-12 userfile ${
                              errors.images ? "is-invalid" : ""
                            }`}
                            multiple
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </div>
                        {errors.images && (
                          <div className="text-danger mt-1">
                            {errors.images}
                          </div>
                        )}
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