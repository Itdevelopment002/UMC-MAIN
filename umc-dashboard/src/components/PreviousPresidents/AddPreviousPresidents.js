import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const AddPreviousPresidents = () => {
  const [presidentName, setPresidentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [presidentImage, setPresidentImage] = useState("");
  const [errors, setErrors] = useState({
    presidentName: "",
    startDate: "",
    presidentImage: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    if (!presidentName) {
      formErrors.presidentName = "President's Name is required.";
    }

    if (!startDate) {
      formErrors.startDate = "Start Date is required.";
    }

    if (!presidentImage) {
      formErrors.presidentImage = "President Image is required.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formattedStartDate = startDate ? formatDate(startDate) : "";
    const formattedEndDate = endDate ? formatDate(endDate) : "";

    const formData = new FormData();
    formData.append("presidentName", presidentName);
    formData.append("startDate", formattedStartDate);
    formData.append("endDate", formattedEndDate);
    formData.append("presidentImage", presidentImage);

    try {
      //eslint-disable-next-line
      const response = await api.post("/presidents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPresidentName("");
      setStartDate("");
      setEndDate("");
      setPresidentImage(null);

      document.getElementById("userfile").value = null;
      navigate("/previous-presidents");
    } catch (error) {
      console.error(error.response?.data?.message || "Error adding president");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFileChange = (e) => {
    setPresidentImage(e.target.files[0]);
    setErrors((prev) => ({ ...prev, presidentImage: "" }));
  };

  const handleInputChange = (e, field) => {
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
    if (field === "presidentName") setPresidentName(e.target.value);
    if (field === "startDate") setStartDate(e.target.value);
    if (field === "endDate") setEndDate(e.target.value);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#.">About KBMC</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/previous-presidents">Previous Presidents</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add President
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add President</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        President Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.presidentName ? "is-invalid" : ""
                          }`}
                          placeholder="Enter president's Name"
                          value={presidentName}
                          onChange={(e) =>
                            handleInputChange(e, "presidentName")
                          }
                        />
                        {errors.presidentName && (
                          <div className="text-danger">
                            {errors.presidentName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon col-md-4">
                        <Flatpickr
                          id="startDatePicker"
                          className={`flatpickr-input form-control form-control-md ${
                            errors.startDate ? "is-invalid" : ""
                          }`}
                          placeholder="Select Start Date"
                          value={startDate}
                          onChange={(date) => {
                            setStartDate(date[0]);
                            setErrors({ ...errors, startDate: "" });
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
                        {errors.startDate && (
                          <div className="text-danger">{errors.startDate}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        End Date 
                      </label>
                      <div className="cal-icon col-md-4">
                        <Flatpickr
                          id="endDatePicker"
                          className={`flatpickr-input form-control form-control-md ${
                            errors.endDate ? "is-invalid" : ""
                          }`}
                          placeholder="Select End Date"
                          value={endDate}
                          onChange={(date) => {
                            setEndDate(date[0]);
                            setErrors({ ...errors, endDate: "" });
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
                        {errors.endDate && (
                          <div className="text-danger">{errors.endDate}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Upload President Image
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group mb-3">
                          <input
                            type="file"
                            id="userfile"
                            name="userfile"
                            className={`form-control form-control-md ${
                              errors.presidentImage ? "is-invalid" : ""
                            }`}
                            onChange={handleFileChange}
                          />
                        </div>
                        {errors.presidentImage && (
                          <div className="text-danger">
                            {errors.presidentImage}
                          </div>
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

export default AddPreviousPresidents;
