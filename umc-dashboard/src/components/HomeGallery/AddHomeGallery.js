import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AddHomeGallery = () => {
  const [photoName, setPhotoName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!photoName.trim()) {
      newErrors.photoName = "Photo gallery name is required";
    }
    if (!selectedFile) {
      newErrors.selectedFile = "Photo gallery image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("photoName", photoName);

    try {
      //eslint-disable-next-line
      const response = await api.post("/home-gallerys", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPhotoName("");
      setSelectedFile(null);
      document.getElementById("image").value = "";

      navigate("/home-gallery");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/home-gallery">Home Gallery</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Home Gallery
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Home Gallery</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Photo Gallery Name{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.photoName ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Photo Gallery Name"
                          value={photoName}
                          onChange={(e) => {
                            setPhotoName(e.target.value);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              photoName: "",
                            }));
                          }}
                        />
                        {errors.photoName && (
                          <div className="invalid-feedback">
                            {errors.photoName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-2">
                        Photo Gallery Image{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            className={`form-control form-control-md col-md-12 col-xs-12 userfile ${errors.selectedFile ? "is-invalid" : ""
                              }`}
                            onChange={(e) => {
                              handleFileChange(e);
                              if (e.target.files[0]) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  selectedFile: "",
                                }));
                              }
                            }}
                          />
                          {errors.selectedFile && (
                            <div className="invalid-feedback">
                              {errors.selectedFile}
                            </div>
                          )}
                        </div>
                        <small className="text-muted">📌 Note: Only image files are allowed (JPG, PNG, etc.).</small>
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
    </>
  );
};

export default AddHomeGallery;
