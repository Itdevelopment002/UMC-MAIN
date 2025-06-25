import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const AddContact = () => {
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    language: "",
    contactIcon: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, contactIcon: e.target.files[0] });
    setErrors({ ...errors, contactIcon: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required.";
    }

    if (!formData.language.trim()) {
      newErrors.language = "Language selection is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.contactIcon) {
      newErrors.contactIcon = "Contact Icon is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    data.append("heading", formData.heading);
    data.append("description", formData.description);
    data.append("language_code", formData.language);
    if (formData.contactIcon) {
      data.append("contactIcon", formData.contactIcon);
    }

    try {
      const response = await api.post("/contact-info", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200 || response.status === 201) {
        setFormData({
          heading: "",
          description: "",
          language: "",
          contactIcon: null,
        })
        toast.success("Contact Info added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/contact-us");
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
          error.response?.data?.message || "Failed to add contact info. Try again.",
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
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/contact-us">Contact Us</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Contact Information
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Contact Information</h4>
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
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
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
                        Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.heading ? "is-invalid" : ""
                            }`}
                          name="heading"
                          value={formData.heading}
                          onChange={handleChange}
                          placeholder="Enter Heading"
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
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.description ? "is-invalid" : ""
                            }`}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter Description"
                        />
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row my-3">
                      <label className="col-form-label col-md-2 col-lg-2">
                        Contact Icon <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="userfile"
                          accept="image/*"
                          name="contactIcon"
                          className={`form-control form-control-md ${errors.contactIcon ? "is-invalid" : ""
                            }`}
                          onChange={handleFileChange}
                        />
                        {errors.contactIcon && (
                          <div className="invalid-feedback">
                            {errors.contactIcon}
                          </div>
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddContact;
