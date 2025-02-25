import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddBudget = () => {
  const [heading, setHeading] = useState("");
  const [link, setLink] = useState("");
  const [year, setYear] = useState("");
  const [newYear, setNewYear] = useState("");
  const [years, setYears] = useState([]);
  const [errors, setErrors] = useState({});
  const [language, setLanguage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await api.get("/budgets_data");
        const uniqueYears = [...new Set(response.data.map((item) => item.year))];
        const sortedYears = uniqueYears.sort((a, b) => {
          const yearA = parseInt(a.split("-")[0]);
          const yearB = parseInt(b.split("-")[0]);
          return yearB - yearA;
        });

        setYears(sortedYears);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    fetchYears();
  }, []);

  const validateForm = () => {
    const validationErrors = {};
    if (!language) {
      validationErrors.language = "Language selection is required";
    }
    if (!heading) {
      validationErrors.heading = "Heading is required.";
    }

    if (!link) {
      validationErrors.link = "Link is required.";
    }

    if (!year) {
      validationErrors.year = "Year is required.";
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
      await api.post("/budgets_data", { heading, link, year, language_code: language, });
      setLanguage("");

      setHeading("");
      setLink("");
      setYear("");
      navigate("/budget");
    } catch (error) {
      console.error("Error adding budget data:", error);
    }
  };

  const handleAddYear = () => {
    if (newYear && !years.includes(newYear)) {
      setYears([...years, newYear]);
      setYear(newYear);
      setNewYear("");
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
              <Link to="/budget">UMC Budget</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add UMC Budget
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add UMC Budget</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-3">
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
                        Year <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-3">
                        <select
                          className={`form-control form-control-md ${errors.year ? "is-invalid" : ""
                            }`}
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);
                            if (errors.year) {
                              setErrors({ ...errors, year: "" });
                            }
                          }}
                        >
                          <option
                            style={{ backgroundColor: "#FBE9ED", color: "#E3435A" }}
                            value=""
                            disabled
                          >
                            Select Year
                          </option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        {errors.year && (
                          <div className="invalid-feedback">{errors.year}</div>
                        )}
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          placeholder="Enter New Year"
                          value={newYear}
                          onChange={(e) => setNewYear(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={handleAddYear}
                        >
                          Add Year
                        </button>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.heading ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Heading"
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

                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        PDF Link <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.link ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Link"
                          value={link}
                          onChange={(e) => {
                            setLink(e.target.value);
                            if (errors.link) {
                              setErrors({ ...errors, link: "" });
                            }
                          }}
                        />
                        {errors.link && (
                          <div className="invalid-feedback">{errors.link}</div>
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

export default AddBudget;
