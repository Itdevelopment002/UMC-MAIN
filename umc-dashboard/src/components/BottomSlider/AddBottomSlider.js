import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddBottomSlider = () => {
  const [websitelink, setLink] = useState("");
  const [websitelogo, setLogo] = useState(null);
  const [errors, setErrors] = useState({ websitelink: "", websitelogo: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!websitelink.trim()) {
      newErrors.websitelink = "Website link is required.";
    }
    if (!websitelogo) {
      newErrors.websitelogo = "Website logo is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (!websitelink || !websitelogo) {
      alert("Please provide both the website link and logo.");
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
        navigate("/bottom-slider", { replace: true });
      } else {
        alert("Failed to add website link. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading website link:", error);
      if (error.response) {
        alert(
          `Error: ${
            error.response.data.message || "Failed to upload the website link."
          }`
        );
      } else {
        alert("Error: Unable to connect to the server.");
      }
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
                    <div className="col-sm-4 col-3">
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
                          className={`form-control ${
                            errors.websitelink ? "is-invalid" : ""
                          }`}
                          placeholder="Enter website link"
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
                      <label className="col-form-label col-lg-2">
                        Slider Image
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="userfile"
                            name="websitelogo"
                            className={`form-control col-md-12 col-xs-12 ${
                              errors.websitelogo ? "is-invalid" : ""
                            }`}
                            onChange={(e) => {
                              setLogo(e.target.files[0]);
                              if (errors.websitelogo) {
                                setErrors({ ...errors, websitelogo: "" });
                              }
                            }}
                          />
                          {errors.websitelogo && (
                            <div className="invalid-feedback">
                              {errors.websitelogo}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary"
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

export default AddBottomSlider;
