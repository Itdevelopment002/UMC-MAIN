import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddWardCommittee = () => {
  const [ward, setWard] = useState("");
  const [heading, setHeading] = useState("");
  const [language, setLanguage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};
    if (!language) {
      validationErrors.language = "Language selection is required";
    }
    
    if (!heading) {
      validationErrors.heading = "Member Name is required.";
    }

    if (!ward) {
      validationErrors.ward = "Ward Name is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      //eslint-disable-next-line
      const response = await api.post("/ward-committee", {
        ward: ward,
        heading: heading,
        language_code: language,
      });
      setHeading("");
      setWard("");
      setLanguage("");
      navigate("/umc-committee");
    } catch (error) {
      console.error("Error adding information:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Corporation</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/umc-committee">UMC Committee</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Ward Committee
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Ward Committee</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.language ? "is-invalid" : ""}`}
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
                        Ward Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.ward ? "is-invalid" : ""}`}
                          value={ward}
                          onChange={(e) => {
                            setWard(e.target.value);
                            if (errors.ward) {
                              setErrors({ ...errors, ward: "" });
                            }
                          }}
                        >
                          <option value="" disabled>Select Ward Name</option>
                          <option value="Ward Committee A">Ward Committee A</option>
                          <option value="Ward Committee B">Ward Committee B</option>
                          <option value="Ward Committee C">Ward Committee C</option>
                          <option value="Ward Committee D">Ward Committee D</option>
                        </select>
                        {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Member Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          className={`form-control form-control-md ${errors.heading ? "is-invalid" : ""}`}
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
                          placeholder="Enter Member name"
                        />
                        {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
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

export default AddWardCommittee;
