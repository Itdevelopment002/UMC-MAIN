import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddTenders = () => {
  const [departments, setDepartments] = useState([]);
  const [heading, setHeading] = useState("");
  const [department, setDepartment] = useState("");
  const [link, setLink] = useState("");
  const [language, setLanguage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department-info");
      const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
      setDepartments(sortedData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const validateForm = () => {
    const validationErrors = {};

    if (!language) {
      validationErrors.language = "Language selection is required";
    }

    if (!heading) {
      validationErrors.heading = "Tender Heading is required.";
    }

    if (!department) {
      validationErrors.department = "Department Name is required.";
    }

    if (!link) {
      validationErrors.link = "Tender Link is required.";
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
      const response = await api.post("/tenders-quotations", {
        heading: heading,
        department: department,
        link: link,
        language_code: language,
      });
      setHeading("");
      setDepartment("");
      setLink("");
      setLanguage("");
      navigate("/tenders-quotations");
    } catch (error) {
      console.error("Error adding tender data:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Citizen Services</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/tenders-quotations">Tenders and Quotations</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Tenders and Quotations
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Tenders and Quotations</h4>
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
                        Tender Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.heading ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Tender heading"
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
                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Tender Link <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.link ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Tender Link"
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

export default AddTenders;
