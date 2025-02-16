import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Link } from "react-router-dom";

const AddPrivacyPolicy = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [errors, setErrors] = useState({ heading: "", description: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!language) {
      newErrors.language = "Language selection is required";
    }
    if (!heading) {
      newErrors.heading = "Policy Heading is required.";
    }
    if (!description) {
      newErrors.description = "Policy Description is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      heading,
      description,
      language_code: language,
    };

    try {
      const response = await api.post("/privacy-policy", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setHeading("");
        setDescription("");
        setLanguage("");
        setErrors({ heading: "", description: "", language: "" });
        navigate("/privacy-policy");
      } else {
        console.error("Failed to add privacy policy");
      }
    } catch (error) {
      console.error("Error adding privacy policy:", error);
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
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Privacy Policy
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Privacy Policy</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control ${errors.language ? "is-invalid" : ""
                            }`}
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value);
                            if (errors.language) {
                              setErrors({ ...errors, language: "" });
                            }
                          }}
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
                        Policy Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.heading ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Policy heading"
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
                        />
                        {errors.heading && (
                          <small className="text-danger">
                            {errors.heading}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Policy Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <textarea
                          className={`form-control ${errors.description ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Policy description"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
                          rows="2"
                        />
                        {errors.description && (
                          <small className="text-danger">
                            {errors.description}
                          </small>
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

export default AddPrivacyPolicy;
