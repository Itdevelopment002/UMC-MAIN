import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
// eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddContactInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    language: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    designation: "",
    language: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Contact Title is required";
    }
    if (!formData.language) {
      newErrors.language = "Language Selection is required";
    }
    if (!formData.designation) {
      newErrors.designation = "Contact Description is required";
    }
    if (!formData.image) {
      newErrors.image = "Contact Icon is required";
    }
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
    formDataToSend.append("language_code", formData.language);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await api.post("/contacts-info", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200 || response.status === 201) {
        setFormData({
          name: "",
          designation: "",
          language: "",
          image: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("Contact Info added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/footer");
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
          error.response?.data?.message || "Failed to adding contact info. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error adding contact info:", error);
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
              <Link to="/footer">Footer</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Contact Info
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Contact Info</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2 col-lg-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <select
                          className={`form-control  ${errors.language ? "is-invalid" : ""
                            }`}
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-2">
                        Contact Title <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${errors.name ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Contact Title"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <small className="text-danger">
                            {errors.name}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-2">
                        Contact Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${errors.designation ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Contact Description"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                        />
                        {errors.designation && (
                          <small className="text-danger">
                            {errors.designation}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2 col-md-2">
                        Contact Icon
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <div className="input-group">
                          <input
                            type="file"
                            className={`form-control col-md-12 col-xs-12 userfile  ${errors.image ? "is-invalid" : ""
                              }`}
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            ref={fileInputRef}
                          />
                        </div>
                        {errors.image && (
                          <small className="text-danger">{errors.image}</small>
                        )}
                        <small className="text-muted">📌 Note: Only image files are allowed (JPG, PNG, etc.).</small>
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

export default AddContactInfo;
