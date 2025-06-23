import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddCommissionerDesc = () => {
  const [formData, setFormData] = useState({
    description: "",
    language_code: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = "Commissioner Description is required.";
    if (!formData.language_code.trim()) newErrors.language_code = "Language Selection is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.post("/commissioner-desc", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/commissioner");
      }
    } catch (error) {
      console.error("Error submitting description:", error);
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
              <Link to="/commissioner">Commissioner</Link>
            </li>
            <li className="breadcrumb-item active">Add Commissioner Description</li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <h4 className="page-title">Add Commissioner Details</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Select Language <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <select
                        className={`form-control ${errors.language_code ? "is-invalid" : ""}`}
                        name="language_code"
                        value={formData.language_code}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select Language</option>
                        <option value="en">English</option>
                        <option value="mr">Marathi</option>
                      </select>
                      {errors.language_code && (
                        <div className="invalid-feedback">{errors.language_code}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Commissioner Description <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <textarea
                        rows={3}
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Commissioner Description"
                      />
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-4">
                      <button type="submit" className="btn btn-sm btn-primary">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCommissionerDesc;