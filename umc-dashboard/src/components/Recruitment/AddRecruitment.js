import React, { useState } from "react";
import api from "../api";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const AddRecruitment = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [language, setLanguage] = useState("");
  const [errors, setErrors] = useState({
    heading: "",
    description: "",
    link: "",
    issueDate: "",
    language: "",
  });
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!heading) {
      newErrors.heading = "Job Heading is required.";
    }
    if (!language) {
      newErrors.language = "Language Selection is required.";
    }
    if (!description) {
      newErrors.description = "Job Description is required.";
    }
    if (!link) {
      newErrors.link = "Job Link is required.";
    }
    if (!issueDate) {
      newErrors.issueDate = "Issue Date is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedDate = formatDate(issueDate);

    const videoData = {
      heading,
      description,
      link,
      issue_date: formattedDate,
      language_code: language,
    };

    try {
      await api.post("/recruitment", videoData);
      setDescription("");
      setHeading("");
      setLink("");
      setIssueDate("");
      setLanguage("");
      setErrors({ heading: "", description: "", link: "", issueDate: "", language: "" });
      navigate("/recruitment");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle both formats of error response
        const errorMessages = error.response.data.errors ||
          (error.response.data.message ? [error.response.data] : []);

        errorMessages.forEach((err) => {
          toast.error(err.message || err, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error("Failed to add recruitment. Try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Error adding recruitment data:", error);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/recruitment">Recruitment</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Recruitment
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Recruitment</h4>
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
                        Job Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control ${errors.heading ? "is-invalid" : ""
                            }`}
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select Job Heading
                          </option>
                          <option value="Contract Basis Recruitment">
                            Contract Basis Recruitment
                          </option>
                          <option value="Old Recruitment">
                            Old Recruitment
                          </option>
                        </select>
                        {errors.heading && (
                          <small className="invalid-feedback">
                            {errors.heading}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Job Description{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.description ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Job Description"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
                        />
                        {errors.description && (
                          <small className="invalid-feedback">
                            {errors.description}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Job Link{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.link ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Job Link"
                          value={link}
                          onChange={(e) => {
                            setLink(e.target.value);
                            if (errors.link) {
                              setErrors({ ...errors, link: "" });
                            }
                          }}
                        />
                        {errors.link && (
                          <small className="invalid-feedback">
                            {errors.link}
                          </small>
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
                      className="btn btn-primary btn-sm"
                      value="Submit"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default AddRecruitment;
