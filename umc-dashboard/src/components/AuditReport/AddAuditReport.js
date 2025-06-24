import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";

const AddAuditReport = () => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [language, setLanguage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!language) {
      validationErrors.language = "Language selection is required";
    }
    if (!name) {
      validationErrors.name = "Report Name is required.";
    }

    if (!year) {
      validationErrors.year = "Year is required.";
    }

    if (!issueDate) {
      validationErrors.issueDate = "Issue Date is required.";
    }

    if (!pdfLink) {
      validationErrors.pdfLink = "PDF Link is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedDate = formatDate(issueDate);

    try {
      //eslint-disable-next-line
      const response = await api.post("/audit-report", {
        name,
        year,
        pdf_link: pdfLink,
        issue_date: formattedDate,
        language_code: language,

      });
      setLanguage("");
      setName("");
      setYear("");
      setPdfLink("");
      setIssueDate("");
      navigate("/audit-report");
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
          error.response?.data?.message || "Failed to add audit report. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error adding audit report:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Departments</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/audit-report">Audit Report</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Audit Report
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Audit Report</h4>
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
                        Report Name <span className="text-danger">*</span>
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
                          <option style={{ backgroundColor: '#FBE9ED', color: '#E3435A' }} value="" disabled>Select Report Name</option>
                          <option value="Internal audit report">Internal Audit Report</option>
                          <option value="Local Fund Audit Report">Local Fund Audit Report</option>
                          <option value="AG Audit Report">AG Audit Report</option>
                          <option value="Monthly Accumulated Expense Report">Monthly Accumulated Expense Report</option>
                          <option value="अंतर्गत लेखापरीक्षण अहवाल">अंतर्गत लेखापरीक्षण अहवाल</option>
                          <option value="स्थानिक विधी लेखा परीक्षा अहवाल">स्थानिक विधी लेखा परीक्षा अहवाल</option>
                          <option value="महालेखापाल अहवाल">महालेखापाल अहवाल</option>
                          <option value="मासिक जमा-खर्च अहवाल">मासिक जमा-खर्च अहवाल</option>
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
                          placeholder="Enter Year (e.g., internal audit 2024)"
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
                    {["PDF Link"].map(
                      (label, index) => {
                        const stateHandlers = [
                          [pdfLink, setPdfLink],
                        ];
                        const [link, setLink] = stateHandlers[index];
                        const errorField = `pdfLink`;
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
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Issue Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon col-md-4">
                        <Flatpickr
                          id="startDatePicker"
                          className={`form-control ${errors.issueDate ? "is-invalid" : ""
                            }`}
                          placeholder="Select Issue Date"
                          value={issueDate}
                          onChange={(date) => {
                            setIssueDate(date[0]);
                            if (issueDate) {
                              setErrors({ ...errors, issueDate: "" });
                            }
                          }}
                          options={{
                            dateFormat: "d-m-Y",
                            monthSelectorType: "dropdown",
                            prevArrow:
                              '<svg><path d="M10 5L5 10L10 15"></path></svg>',
                            nextArrow:
                              '<svg><path d="M5 5L10 10L5 15"></path></svg>',
                          }}
                        />
                        {errors.issueDate && (
                          <small className="invalid-feedback">
                            {errors.issueDate}
                          </small>
                        )}
                      </div>
                    </div>
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
      <ToastContainer />
    </div>
  );
};

export default AddAuditReport;
