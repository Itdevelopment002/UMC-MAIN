import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const AddMinisterDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    language_code: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    designation: "",
    language_code: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      if (file) {
        if (!file.type.startsWith("image/")) {

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }

        setFormData({ ...formData, image: file });
        setErrors({ ...errors, image: "" });
      }
    } else {
      setFormData({ ...formData, [name]: value });

      if (value) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Minister Name is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.language_code) newErrors.language_code = "Language selection is required";
    if (!formData.image) newErrors.image = "Minister Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("designation", formData.designation);
    formDataToSend.append("language_code", formData.language_code);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await api.post("/minister-details", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("Minister added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setFormData({
          name: "",
          designation: "",
          language_code: "",
          image: null,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        navigate("/minister");
      }
    } catch (error) {
      toast.error("Failed to add minister. Try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error adding minister:", error);
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
              <Link to="/minister">Ministers</Link>
            </li>
            <li className="breadcrumb-item active">Add Minister</li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Minister</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control ${errors.language_code ? "is-invalid" : ""}`}
                          name="language_code"
                          value={formData.language_code}
                          onChange={handleChange}
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language_code && (
                          <small className="text-danger">{errors.language_code}</small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Minister Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          placeholder="Enter Minister Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {errors.name && <small className="text-danger">{errors.name}</small>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Designation <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                          placeholder="Enter Minister Designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                        />
                        {errors.designation && (
                          <small className="text-danger">{errors.designation}</small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Minister Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group">
                          <input
                            type="file"
                            className={`form-control ${errors.image ? "is-invalid" : ""}`}
                            name="image"
                            onChange={handleChange}
                            ref={fileInputRef}
                          />
                        </div>
                        {errors.image && <small className="text-danger">{errors.image}</small>}
                        <small className="text-muted">📌 Note: Only image files are allowed (JPG, PNG, etc.).</small>
                      </div>
                    </div>
                    <input type="submit" className="btn btn-primary btn-sm" value="Submit" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddMinisterDetails;
