import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { toast, ToastContainer } from "react-toastify";

const AddAgenda = () => {
  const [Department_Name, setDepartmentName] = useState("");
  const [Agenda_No_Date, setResolutionsNoDate] = useState("");
  const [Schedule_Date_of_Meeting, setScheduleDateOfMeeting] = useState("");
  const [Adjournment_Notice, setAdjournmentNotice] = useState("");
  const [pdf_link, setPdfLink] = useState("");
  const [errors, setErrors] = useState({});
  const [language, setLanguage] = useState("");

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
    if (!Department_Name) {
      validationErrors.Department_Name = "Department Name is required.";
    }

    if (!Agenda_No_Date) {
      validationErrors.Agenda_No_Date = "Agenda No/Date is required.";
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

    const formattedDate = formatDate(Schedule_Date_of_Meeting);

    try {
      //eslint-disable-next-line
      const response = await api.post("/agenda_data", {
        Department_Name,
        Agenda_No_Date,
        Schedule_Date_of_Meeting: formattedDate,
        Adjournment_Notice,
        pdf_link,
        language_code: language,

      });
      if (response.status === 200 || response.status === 201) {
        setLanguage("");
        setDepartmentName("");
        setResolutionsNoDate("");
        setScheduleDateOfMeeting("");
        setAdjournmentNotice("");
        setPdfLink("");
        toast.success("UMC Agenda added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/agenda");
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
          error.response?.data?.message || "Failed to add umc agenda. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error adding umc agenda:", error);
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
              <Link to="/agenda">UMC Agenda</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add UMC Agenda
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add UMC Agenda</h4>
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
                        Department Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.Department_Name ? "is-invalid" : ""
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
                        Agenda No/Date <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.Agenda_No_Date ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Agenda No/Date"
                          value={Agenda_No_Date}
                          onChange={(e) => {
                            setResolutionsNoDate(e.target.value);
                            if (errors.Agenda_No_Date) {
                              setErrors({ ...errors, Agenda_No_Date: "" });
                            }
                          }}
                        />
                        {errors.Agenda_No_Date && (
                          <div className="invalid-feedback">
                            {errors.Agenda_No_Date}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Schedule Date of Meeting <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon col-md-4">
                        <Flatpickr
                          id="startDatePicker"
                          className={`form-control ${errors.Schedule_Date_of_Meeting ? "is-invalid" : ""
                            }`}
                          placeholder="Select Schedule Date of Meeting"
                          value={Schedule_Date_of_Meeting}
                          onChange={(date) => {
                            setScheduleDateOfMeeting(date[0]);
                            if (Schedule_Date_of_Meeting) {
                              setErrors({ ...errors, Schedule_Date_of_Meeting: "" });
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
                        {errors.Schedule_Date_of_Meeting && (
                          <small className="invalid-feedback">
                            {errors.Schedule_Date_of_Meeting}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Adjournment Notice <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <textarea
                          className={`form-control form-control-md ${errors.Adjournment_Notice ? "is-invalid" : ""
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
      <ToastContainer />
    </div>
  );
};

export default AddAgenda;