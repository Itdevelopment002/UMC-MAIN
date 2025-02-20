import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddMuncipalMeeting = () => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [pdfLink1, setPdfLink1] = useState("");
  const [pdfLink2, setPdfLink2] = useState("");
  const [pdfLink3, setPdfLink3] = useState("");
  const [language, setLanguage] = useState("");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};
    if (!language) {
      validationErrors.language = "Language selection is required";
    }
    if (!name) {
      validationErrors.name = "Meeting Name is required.";
    }

    if (!year) {
      validationErrors.year = "Year is required.";
    }

    if (!pdfLink1) {
      validationErrors.pdfLink1 = "PDF Link 1 is required.";
    }

    if (!pdfLink2) {
      validationErrors.pdfLink2 = "PDF Link 2 is required.";
    }

    if (!pdfLink3) {
      validationErrors.pdfLink3 = "PDF Link 3 is required.";
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
      const response = await api.post("/muncipal_meetings", {
        name,
        year,
        pdf_link1: pdfLink1,
        pdf_link2: pdfLink2,
        pdf_link3: pdfLink3,
        language_code: language,

      });
      setLanguage("");
      setName("");
      setYear("");
      setPdfLink1("");
      setPdfLink2("");
      setPdfLink3("");
      navigate("/muncipal-meeting");
    } catch (error) {
      console.error("Error adding municipal meeting data:", error);
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
              <Link to="/muncipal-meeting">Municipal Meeting</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Municipal Meeting
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Municipal Meeting</h4>
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
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                      </div>
                    </div>
                    <div className="form-group row">

                      <label className="col-form-label col-md-2">
                        Meeting Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.name ? "is-invalid" : ""
                            }`}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) {
                              setErrors({ ...errors, name: "" });
                            }
                          }}
                        >
                          <option style={{ backgroundColor: '#FBE9ED', color: '#E3435A' }} value="" disabled>Select Meeting Name</option>
                          <option value="General Body">General Body</option>
                          <option value="Special General Body">Special General Body</option>
                          <option value="Standing Committee">Standing Committee</option>
                          <option value="Tree Committee">Tree Committee</option>
                          <option value="Transport Committee">Transport Committee</option>
                          <option value="सर्वसाधारण सभा">सर्वसाधारण सभा</option>
                          <option value="विशेष सर्वसाधारण मंडळाचा">विशेष सर्वसाधारण मंडळाचा</option>
                          <option value="स्थायी समितीचा">स्थायी समितीचा</option>
                          <option value="वृक्ष समितीचा">वृक्ष समितीचा</option>
                          <option value="वाहतूक समितीचा">वाहतूक समितीचा</option>
                        </select>
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Year <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.year ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Year (e.g., general body 2024)"
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);
                            if (errors.year) {
                              setErrors({ ...errors, year: "" });
                            }
                          }}
                        />
                        {errors.year && (
                          <div className="invalid-feedback">{errors.year}</div>
                        )}
                      </div>
                    </div>
                    {["PDF Link 1", "PDF Link 2", "PDF Link 3"].map(
                      (label, index) => {
                        const stateHandlers = [
                          [pdfLink1, setPdfLink1],
                          [pdfLink2, setPdfLink2],
                          [pdfLink3, setPdfLink3],
                        ];
                        const [link, setLink] = stateHandlers[index];
                        const errorField = `pdfLink${index + 1}`;
                        return (
                          <div className="form-group row" key={label}>
                            <label className="col-form-label col-md-2">
                              {label} <span className="text-danger">*</span>
                            </label>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className={`form-control form-control-md ${errors[errorField] ? "is-invalid" : ""
                                  }`}
                                placeholder={`Enter ${label}`}
                                value={link}
                                onChange={(e) => {
                                  setLink(e.target.value);
                                  if (errors[errorField]) {
                                    setErrors({ ...errors, [errorField]: "" });
                                  }
                                }}
                              />
                              {errors[errorField] && (
                                <div className="invalid-feedback">
                                  {errors[errorField]}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                    <input
                      type="submit"
                      className="btn btn-primary btn-sm mt-3"
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

export default AddMuncipalMeeting;
