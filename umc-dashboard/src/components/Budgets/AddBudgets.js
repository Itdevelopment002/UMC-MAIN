import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddPolicies = () => {
  const [heading, setHeading] = useState("");
  const [link, setLink] = useState("");
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};

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
      //eslint-disable-next-line
      const response = await api.post("/budgets_data", {
        heading: heading,
        link: link,
        year: year,
      });
      setHeading("");
      setLink("");
      setYear("");
      navigate("/budgets");
    } catch (error) {
      console.error("Error adding budget data:", error);
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
              <Link to="/budgets">Budget</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Budget
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Budget</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Year <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${
                            errors.year ? "is-invalid" : ""
                          }`}
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);
                            if (errors.year) {
                              setErrors({ ...errors, year: "" });
                            }
                          }}
                        >
                          <option style={{backgroundColor:'#FBE9ED', color:'#E3435A'}} value="" disabled>Select Year</option>
                          <option value="2020-2021">2020-2021</option>
                          <option value="2019-2020">2019-2020</option>
                          <option value="2018-2019">2018-2019</option>
                          <option value="2017-2018">2017-2018</option>
                          <option value="2015-2016">2015-2016</option>
                          <option value="2014-2015">2014-2015</option>
                        </select>
                        {errors.year && (
                          <div className="invalid-feedback">{errors.year}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.heading ? "is-invalid" : ""
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
                          className={`form-control form-control-md ${
                            errors.link ? "is-invalid" : ""
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

export default AddPolicies;
