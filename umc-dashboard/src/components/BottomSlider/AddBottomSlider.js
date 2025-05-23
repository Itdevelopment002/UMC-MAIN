import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { getImageValidationError } from "../../validation/ImageValidation";

const AddBottomSlider = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [websitelink, setLink] = useState("");
  const [websitelogo, setLogo] = useState(null);
  const [errors, setErrors] = useState({ websitelink: "", websitelogo: "" });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Use our global validation function
      const errorMessage = getImageValidationError(file);
     
      if (errorMessage) {
        // Clear the file input if invalid file is selected
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Set error message
        setErrors({ ...errors, websitelogo: errorMessage });
        return;
      }

      setLogo(file);
      setErrors({ ...errors, websitelogo: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!websitelink.trim()) {
      newErrors.websitelink = "Slider Link is required.";
    }
    
    // Use our global validation function
    const imageError = getImageValidationError(websitelogo);
    if (imageError) {
      newErrors.websitelogo = imageError;
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
    formData.append("websitelink", websitelink);
    formData.append("websitelogo", websitelogo);

    try {
      const response = await api.post("/bottom-sliders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Bottom slider added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setLink("");
        setLogo(null);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        navigate("/bottom-slider", { replace: true });
      } else {
        toast.error("Failed to add slider. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error uploading Slider link:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload the slider.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/bottom-slider">Bottom Slider</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Bottom Slider
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Bottom Slider</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Slider Link{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.websitelink ? "is-invalid" : ""}`}
                          placeholder="Enter Slider Link"
                          value={websitelink}
                          onChange={(e) => {
                            setLink(e.target.value);
                            if (errors.websitelink) {
                              setErrors({ ...errors, websitelink: "" });
                            }
                          }}
                        />
                        {errors.websitelink && (
                          <div className="invalid-feedback">
                            {errors.websitelink}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-2">
                        Slider Image
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="userfile"
                            name="websitelogo"
                            accept=".jpg,.jpeg,.png"
                            className={`form-control col-md-12 col-xs-12 ${errors.websitelogo ? "is-invalid" : ""}`}
                            onChange={handleLogoChange}
                            ref={fileInputRef}
                          />
                          {errors.websitelogo && (
                            <div className="invalid-feedback">
                              {errors.websitelogo}
                            </div>
                          )}
                        </div>
                        <small className="text-muted d-block mt-1">
                          📌 Note: Image Max size: 2MB.
                        </small>
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
    </>
  );
};

export default AddBottomSlider;