import React, { useState } from "react";
import api from "../api";
//eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Link } from "react-router-dom";

const AddCirculars = () => {
  const [description, setDescription] = useState("");
  const [number, setNumber] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({
    description: "",
    number: "",
    publishDate: "",
    link: "",
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
    if (!description) {
      newErrors.description = "Circular Title is required.";
    }
    if (!number) {
      newErrors.number = "Circular Number is required.";
    }
    if (!publishDate) {
      newErrors.publishDate = "Circular Date is required.";
    }
    if (!link) {
      newErrors.link = "Circular Link is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedDate = formatDate(publishDate);

    const videoData = {
      description,
      number,
      publishDate: formattedDate,
      link,
    };

    try {
      await api.post("/circular-info", videoData);
      toast.success("Circular added successfully!");
      setDescription("");
      setNumber("");
      setLink("");
      setErrors({ description: "", number: "", publishDate: "", link: "" });
      setPublishDate("");

      navigate("/circulars");
    } catch (error) {
      toast.error("Failed to add recruitment data. Please try again.");
    }
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/circulars">Circulars</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Circular
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Circular</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Circular Title{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Circular Title"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
                        />
                        {errors.description && (
                          <small className="text-danger">
                            {errors.description}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Circular Number{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.number ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Circular Number"
                          value={number}
                          onChange={(e) => {
                            setNumber(e.target.value);
                            if (errors.number) {
                              setErrors({ ...errors, number: "" });
                            }
                          }}
                        />
                        {errors.number && (
                          <small className="text-danger">
                            {errors.number}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Circular Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon col-md-4">
                        <Flatpickr
                          id="startDatePicker"
                          className={`form-control ${
                            errors.publishDate ? "is-invalid" : ""
                          }`}
                          placeholder="Select Circular Date"
                          value={publishDate}
                          onChange={(date) => {
                            setPublishDate(date[0]);
                            if (errors.publishDate) {
                              setErrors({ ...errors, publishDate: "" });
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
                        {errors.publishDate && (
                          <small className="text-danger">
                            {errors.publishDate}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Circular Link{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.link ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Circular Link"
                          value={link}
                          onChange={(e) => {
                            setLink(e.target.value);
                            if (errors.link) {
                              setErrors({ ...errors, link: "" });
                            }
                          }}
                        />
                        {errors.link && (
                          <small className="text-danger">
                            {errors.link}
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
      </div>
    </>
  );
};

export default AddCirculars;
