import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { getImageValidationError } from "../../validation/ImageValidation";

const AddSlider = () => {
  const [sliderName, setSliderName] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const error = getImageValidationError(file);

    if (error) {
      setErrors((prev) => ({ ...prev, selectedFile: error }));
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
      setErrors((prev) => ({ ...prev, selectedFile: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!sliderName.trim()) {
      newErrors.sliderName = "Slider name is required.";
    }

    if (!languageCode) {
      newErrors.languageCode = "Language selection is required.";
    }

    if (!selectedFile) {
      newErrors.selectedFile = "Slider image is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("sliderName", sliderName);
    formData.append("languageCode", languageCode);

    try {
      await api.post("/sliders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSliderName("");
      setLanguageCode("");
      setSelectedFile(null);
      document.getElementById("image").value = "";
      navigate("/slider");
    } catch (error) {
      console.error("Error uploading file:", error);
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
              <Link to="/slider">Slider</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Slider
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Slider</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control ${errors.languageCode ? "is-invalid" : ""}`}
                          name="languageCode"
                          value={languageCode}
                          onChange={(e) => {
                            setLanguageCode(e.target.value);
                            setErrors((prev) => ({ ...prev, languageCode: "" }));
                          }}
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.languageCode && (
                          <div className="invalid-feedback">{errors.languageCode}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-3">
                        Slider Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          placeholder="Enter Slider Name"
                          className={`form-control form-control-md ${errors.sliderName ? "is-invalid" : ""
                            }`}
                          value={sliderName}
                          onChange={(e) => {
                            setSliderName(e.target.value);
                            setErrors((prev) => ({ ...prev, sliderName: "" }));
                          }}
                        />
                        {errors.sliderName && (
                          <div className="invalid-feedback">{errors.sliderName}</div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-3">
                        Slider Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            className={`form-control form-control-md ${errors.selectedFile ? "is-invalid" : ""
                              }`}
                            onChange={handleFileChange}
                          />
                          {errors.selectedFile && (
                            <div className="invalid-feedback">{errors.selectedFile}</div>
                          )}
                        </div>
                        <small className="text-muted">
                          📌 Note: Image resolution must be <b>2018 x 787</b> pixels.
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

export default AddSlider;
