import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const AddSlider = () => {
  const [sliderName, setSliderName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, selectedFile: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!sliderName.trim()) {
      newErrors.sliderName = "Slider name is required.";
    }

    if (!selectedFile) {
      newErrors.selectedFile = "Image file is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("sliderName", sliderName);

    try {
      // eslint-disable-next-line
      const response = await api.post("/sliders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSliderName("");
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
              <Link to="/home">Home</Link>
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
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Slider</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Slider Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.sliderName ? "is-invalid" : ""
                          }`}
                          value={sliderName}
                          onChange={(e) => {
                            setSliderName(e.target.value);
                            setErrors((prev) => ({ ...prev, sliderName: "" }));
                          }}
                        />
                        {errors.sliderName && (
                          <div className="invalid-feedback">
                            {errors.sliderName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Upload Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            className={`form-control ${
                              errors.selectedFile ? "is-invalid" : ""
                            }`}
                            onChange={handleFileChange}
                          />
                          {errors.selectedFile && (
                            <div className="invalid-feedback">
                              {errors.selectedFile}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Upload"
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
