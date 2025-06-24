import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer} from "react-toastify";

const AddDeptPdfs = () => {
  const [heading, setHeading] = useState("");
  const [link, setLink] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [department, setDepartment] = useState("");
  const [language, setLanguage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userData = token ? jwtDecode(token) : null;


  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!department) {
      validationErrors.department = "Department Name is required.";
    }

    if (!language) {
      validationErrors.language = "Language selection is required";
    }

    if (!issueDate) {
      validationErrors.issueDate = "Issue Date is required.";
    }

    if (!heading) {
      validationErrors.heading = "Pdf Heading is required.";
    }

    if (!link) {
      validationErrors.link = "Pdf Link is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department-info");
      const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
      if (userData?.role === "Superadmin") {
        setDepartments(sortedData);
      } else {
        const userPermissions = userData?.permission?.split(",").map(perm => perm.trim());
        const filteredData = sortedData.filter(item => userPermissions.includes(item.heading));
        setDepartments(filteredData);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    //eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedDate = formatDate(issueDate);

    try {
      //eslint-disable-next-line
      const response = await api.post("/department-pdfs", {
        department: department,
        heading: heading,
        link: link,
        issue_date: formattedDate,
        language_code: language,
      });
      setDepartment("");
      setHeading("");
      setLink("");
      setIssueDate("");
      setLanguage("");
      navigate("/department-information");
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
          error.response?.data?.message || "Failed to add pdf. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error adding pdf:", error);
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
              <Link to="/department-information">Department Information</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Department Pdfs
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Department Pdfs</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.language ? "is-invalid" : ""
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
                        Department Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control ${errors.department ? "is-invalid" : ""}`}
                          name="department"
                          value={department}
                          onChange={(e) => {
                            setDepartment(e.target.value);
                            setErrors((prev) => ({ ...prev, department: "" }));
                          }}
                        >
                          <option value="" disabled>
                            Select Department Name
                          </option>
                          {departments.map((department) => (
                            <option value={department.heading} key={department.id}>
                              {department.heading}
                            </option>
                          ))}
                        </select>
                        {errors.department && (
                          <div className="invalid-feedback">{errors.department}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Pdf Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.heading ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Pdf Heading"
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
                        />
                        {errors.heading && (
                          <div className="invalid-feedback">
                            {errors.heading}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Pdf Link <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.link ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Pdf Link"
                          value={link}
                          onChange={(e) => {
                            setLink(e.target.value);
                            if (errors.link) {
                              setErrors({ ...errors, link: "" });
                            }
                          }}
                        />
                        {errors.link && (
                          <div className="invalid-feedback">
                            {errors.link}
                          </div>
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

export default AddDeptPdfs;
