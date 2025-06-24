import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { Link } from "react-router-dom";

const AddDataTable4 = () => {
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    language_code: "",
  });
  const [errors, setErrors] = useState({ heading: "", description: "", language_code: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.heading) {
      newErrors.heading = "Title is required.";
    }
    if (!formData.description) {
      newErrors.description = "Description is required.";
    }
    if (!formData.language_code) {
      newErrors.language_code = "Language selection is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSubmit = { ...formData, type: "Table 4" };

    try {
      const response = await api.post("/location-info", dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setFormData({ heading: "", description: "", language_code: "" });
        setErrors({ heading: "", description: "", language_code: "" });
        toast.success("Table 4 data added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/location");
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
          error.response?.data?.message || "Error adding table 3 data:",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error adding table 3 data:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">About UMC</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/location">Location</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Table 4 Data
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Table 4 Data</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          name="language_code"
                          className={`form-control ${errors.language_code ? "is-invalid" : ""
                            }`}
                          value={formData.language_code}
                          onChange={handleChange}
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language_code && <div className="invalid-feedback">{errors.language_code}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Title <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          name="heading"
                          className={`form-control ${errors.heading ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Title"
                          value={formData.heading}
                          onChange={handleChange}
                        />
                        {errors.heading && (
                          <small className="text-danger">{errors.heading}</small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <textarea
                          name="description"
                          className={`form-control ${errors.description ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="2"
                        />
                        {errors.description && (
                          <small className="text-danger">
                            {errors.description}
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
      <ToastContainer />
    </div>
  );
};

export default AddDataTable4;
