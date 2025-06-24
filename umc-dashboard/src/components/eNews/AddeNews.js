import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { toast, ToastContainer } from "react-toastify";

const AddeNews = () => {
  const [info, setInfo] = useState("");
  const [issue_date, setIssueDate] = useState("");
  const [pdf_link, setPdfLink] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");

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
    if (!info) {
      validationErrors.info = "Information is required.";
    }

    if (!issue_date) {
      validationErrors.issue_date = "Issue Date is required.";
    }

    if (!pdf_link) {
      validationErrors.pdf_link = "PDF Link is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedDate = formatDate(issue_date);

    try {
      //eslint-disable-next-line
      const response = await api.post("/enews_data", {
        info,
        issue_date: formattedDate,
        pdf_link,
        language_code: language,

      });
      if (response.status === 200 || response.status === 201) {
        setLanguage("");
        setInfo("");
        setIssueDate("");
        setPdfLink("");
        toast.success("E-News data added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/enews-letter");
          }
        });
      }
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
          error.response?.data?.message || "Failed to add e-news. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error adding e-news:", error);
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
              <Link to="/enews-letter">e-News Letter</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add e-News Letter
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add e-News Letter</h4>
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
                        Information <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <textarea
                          rows={2}
                          className={`form-control form-control-md ${errors.info ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Information"
                          value={info}
                          onChange={(e) => {
                            setInfo(e.target.value);
                            if (errors.info) {
                              setErrors({ ...errors, info: "" });
                            }
                          }}
                        />
                        {errors.info && (
                          <div className="invalid-feedback">{errors.info}</div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Issue Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon col-md-4">
                        <Flatpickr
                          id="startDatePicker"
                          className={`form-control ${errors.issue_date ? "is-invalid" : ""
                            }`}
                          placeholder="Select Issue Date"
                          value={issue_date}
                          onChange={(date) => {
                            setIssueDate(date[0]);
                            if (issue_date) {
                              setErrors({ ...errors, issue_date: "" });
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
                        {errors.issue_date && (
                          <small className="invalid-feedback">
                            {errors.issue_date}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        PDF Link <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.pdf_link ? "is-invalid" : ""
                            }`}
                          placeholder="Enter PDF Link"
                          value={pdf_link}
                          onChange={(e) => {
                            setPdfLink(e.target.value);
                            if (errors.pdf_link) {
                              setErrors({ ...errors, pdf_link: "" });
                            }
                          }}
                        />
                        {errors.pdf_link && (
                          <div className="invalid-feedback">{errors.pdf_link}</div>
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
      <ToastContainer />
    </div>
  );
};

export default AddeNews;
