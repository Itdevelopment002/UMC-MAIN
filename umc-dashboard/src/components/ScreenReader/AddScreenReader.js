import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Link } from "react-router-dom";

const AddScreenReader = () => {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [available, setAvailable] = useState("");
  const [language, setLanguage] = useState("");
  const [errors, setErrors] = useState({ name: "", website: "", available: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Reader name is required.";
    }

    if (!website) {
      newErrors.website = "Reader Website is required.";
    }

    if (!available) {
      newErrors.available = "Reader Availability is required.";
    }

    if (!language) {
      newErrors.language = "Language selection is required";
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
      name,
      website,
      available,
      language_code: language,
    };

    try {
      const response = await api.post("/screen-reader", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setName("");
        setWebsite("");
        setAvailable("");
        setLanguage("");
        setErrors({ name: "", website: "", available: "", language: "" });
        navigate("/screen-reader-access");
      } else {
        console.error("Failed to add screen reader data");
      }
    } catch (error) {
      console.error("Error adding screen reader data:", error);
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
              <Link to="/screen-reader-access">Screen Reader Access</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Screen Reader Access
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Screen Reader Access</h4>
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
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Reader Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.name ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Reader Name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) {
                              setErrors({ ...errors, name: "" });
                            }
                          }}
                        />
                        {errors.name && (
                          <small className="text-danger">
                            {errors.name}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Reader Website <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.website ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Reader Website"
                          value={website}
                          onChange={(e) => {
                            setWebsite(e.target.value);
                            if (errors.website) {
                              setErrors({ ...errors, website: "" });
                            }
                          }}
                        />
                        {errors.website && (
                          <small className="text-danger">
                            {errors.website}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Reader Availability <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control ${errors.available ? "is-invalid" : ""}`}
                          value={available}
                          onChange={(e) => {
                            setAvailable(e.target.value);
                            if (errors.available) {
                              setErrors({ ...errors, available: "" });
                            }
                          }}
                        >
                          <option value="" disabled>Select Availability</option>
                          <option value="Free">Free</option>
                          <option value="मुक्त">मुक्त</option>
                          <option value="Commercial">Commercial</option>
                          <option value="व्यावसायिक">व्यावसायिक</option>
                        </select>
                        {errors.available && <small className="text-danger">{errors.available}</small>}
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

export default AddScreenReader;
