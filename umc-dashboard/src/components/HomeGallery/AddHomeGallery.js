import React, { useState, useRef } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getImageValidationError } from "../../validation/ImageValidation";

const AddHomeGallery = () => {
  const [photoName, setPhotoName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const errorMessage = getImageValidationError(file);

      if (errorMessage) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setErrors({ ...errors, selectedFile: errorMessage });
        return;
      }

      setSelectedFile(file);
      setErrors({ ...errors, selectedFile: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!photoName.trim()) {
      newErrors.photoName = "Photo gallery name is required";
    }
    if (!selectedFile) {
      newErrors.selectedFile = "Photo gallery image is required";
    } else {
      const imageError = getImageValidationError(selectedFile);
      if (imageError) {
        newErrors.selectedFile = imageError;
      }
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
      const response = await api.post("/home-gallerys", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200 || response.status === 201) {
        setPhotoName("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("Home gallery added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/home-gallery");
          }
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        Array.isArray(error.response.data.errors)
      ) {
        error.response.data.errors.forEach((err) => {
          const message = typeof err === "string" ? err : err.message || "Validation error";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add home gallery data. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error adding home gallery data:", error);
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
                            ref={fileInputRef}
                            accept=".jpg,.jpeg,.png"
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
                        <small className="text-muted">
                          📌 Note: Max image size: 2 MB.
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
      <ToastContainer />
    </>
  );
};

export default AddHomeGallery;