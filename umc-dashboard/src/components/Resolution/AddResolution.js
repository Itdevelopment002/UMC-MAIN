import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddResolution = () => {
  const [Department_Name, setDepartmentName] = useState("");
  const [Resolutions_No_Date, setResolutionsNoDate] = useState("");
  const [Schedule_Date_of_Meeting, setScheduleDateOfMeeting] = useState("");
  const [Adjournment_Notice, setAdjournmentNotice] = useState("");
  const [pdf_link, setPdfLink] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};

    if (!Department_Name) {
      validationErrors.Department_Name = "Department Name is required.";
    }

    if (!Resolutions_No_Date) {
      validationErrors.Resolutions_No_Date = "Resolution No/Date is required.";
    }

    if (!Schedule_Date_of_Meeting) {
      validationErrors.Schedule_Date_of_Meeting = "Schedule Date of Meeting is required.";
    }

    if (!Adjournment_Notice) {
      validationErrors.Adjournment_Notice = "Adjournment Notice is required.";
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
      const response = await api.post("/resolution", {
        Department_Name,
        Resolutions_No_Date,
        Schedule_Date_of_Meeting,
        Adjournment_Notice,
        pdf_link,
      });
      setDepartmentName("");
      setResolutionsNoDate("");
      setScheduleDateOfMeeting("");
      setAdjournmentNotice("");
      setPdfLink("");
      navigate("/resolution");
    } catch (error) {
      console.error("Error adding resolution:", error);
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
              <Link to="/resolution">Resolutions</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Resolution
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Resolution</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Department Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.Department_Name ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Department Name"
                          value={Department_Name}
                          onChange={(e) => {
                            setDepartmentName(e.target.value);
                            if (errors.Department_Name) {
                              setErrors({ ...errors, Department_Name: "" });
                            }
                          }}
                        />
                        {errors.Department_Name && (
                          <div className="invalid-feedback">
                            {errors.Department_Name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Resolution No/Date <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.Resolutions_No_Date ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Resolution No/Date"
                          value={Resolutions_No_Date}
                          onChange={(e) => {
                            setResolutionsNoDate(e.target.value);
                            if (errors.Resolutions_No_Date) {
                              setErrors({ ...errors, Resolutions_No_Date: "" });
                            }
                          }}
                        />
                        {errors.Resolutions_No_Date && (
                          <div className="invalid-feedback">
                            {errors.Resolutions_No_Date}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Schedule Date of Meeting <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="date"
                          className={`form-control form-control-md ${
                            errors.Schedule_Date_of_Meeting ? "is-invalid" : ""
                          }`}
                          value={Schedule_Date_of_Meeting}
                          onChange={(e) => {
                            setScheduleDateOfMeeting(e.target.value);
                            if (errors.Schedule_Date_of_Meeting) {
                              setErrors({ ...errors, Schedule_Date_of_Meeting: "" });
                            }
                          }}
                        />
                        {errors.Schedule_Date_of_Meeting && (
                          <div className="invalid-feedback">
                            {errors.Schedule_Date_of_Meeting}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Adjournment Notice <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <textarea
                          className={`form-control form-control-md ${
                            errors.Adjournment_Notice ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Adjournment Notice"
                          value={Adjournment_Notice}
                          onChange={(e) => {
                            setAdjournmentNotice(e.target.value);
                            if (errors.Adjournment_Notice) {
                              setErrors({ ...errors, Adjournment_Notice: "" });
                            }
                          }}
                        />
                        {errors.Adjournment_Notice && (
                          <div className="invalid-feedback">
                            {errors.Adjournment_Notice}
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
                          <div className="invalid-feedback">
                            {errors.pdf_link}
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

export default AddResolution;