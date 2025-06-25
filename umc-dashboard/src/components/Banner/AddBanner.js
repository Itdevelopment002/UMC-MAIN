import React, { useState, useRef } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getImageValidationError } from "../../validation/ImageValidation";

const AddBanner = () => {
  const [bannerName, setBannerName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const errorMessage = getImageValidationError(file);
    if (errorMessage) {
      setErrors({ ...errors, selectedFile: errorMessage });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setErrors({ ...errors, selectedFile: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!bannerName.trim()) {
      newErrors.bannerName = "Banner name is required.";
    }

    const imageError = getImageValidationError(selectedFile);
    if (imageError) {
      newErrors.selectedFile = imageError;
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
    formData.append("bannerName", bannerName);

    try {
      //eslint-disable-next-line
      const response = await api.post("/banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200 || response.status === 201) {
        setBannerName("");
        setSelectedFile(null);
        setErrors({});

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("Banner added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/banner");
          }
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessages = error.response.data.errors ||
          (error.response.data.message ? [error.response.data] : []);

        errorMessages.forEach((err) => {
          toast.error(err.message || err, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error("Failed to add banner. Try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Error adding banner:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/banner">Banner</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Banner
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Banner</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Banner Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.bannerName ? "is-invalid" : ""}`}
                          value={bannerName}
                          placeholder="Enter Banner Name"
                          onChange={(e) => {
                            setBannerName(e.target.value);
                            setErrors({ ...errors, bannerName: "" });
                          }}
                        />
                        {errors.bannerName && (
                          <div className="invalid-feedback">
                            {errors.bannerName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-2">
                        Banner Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept=".jpg,.jpeg,.png"
                            className={`form-control ${errors.selectedFile ? "is-invalid" : ""}`}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                          {errors.selectedFile && (
                            <div className="invalid-feedback">
                              {errors.selectedFile}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-4 offset-md-2">
                        <button type="submit" className="btn btn-primary btn-sm">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBanner;