import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddeNews = () => {
  const [info, setInfo] = useState("");
  const [issue_date, setIssueDate] = useState("");
  const [pdf_link, setPdfLink] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};

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

    try {
      //eslint-disable-next-line
      const response = await api.post("/enews_data", {
        info,
        issue_date,
        pdf_link,
      });
      setInfo("");
      setIssueDate("");
      setPdfLink("");
      navigate("/enews-letter");
    } catch (error) {
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
                        Information <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <textarea
                          rows={2}
                          className={`form-control form-control-md ${
                            errors.info ? "is-invalid" : ""
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

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Issue Date <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="date"
                          className={`form-control form-control-md ${
                            errors.issue_date ? "is-invalid" : ""
                          }`}
                          value={issue_date}
                          onChange={(e) => {
                            setIssueDate(e.target.value);
                            if (errors.issue_date) {
                              setErrors({ ...errors, issue_date: "" });
                            }
                          }}
                        />
                        {errors.issue_date && (
                          <div className="invalid-feedback">
                            {errors.issue_date}
                          </div>
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
                          className={`form-control form-control-md ${
                            errors.pdf_link ? "is-invalid" : ""
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
    </div>
  );
};

export default AddeNews;
