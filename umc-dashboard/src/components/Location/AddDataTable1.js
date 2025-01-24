import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Link } from "react-router-dom";

const AddDataTable1 = () => {
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
  });
  const [errors, setErrors] = useState({ heading: "", description: "" });
  const navigate = useNavigate();

  // Handle input field changes
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSubmit = { ...formData, type: "Table 1" };

    try {
      const response = await api.post("/location-info", dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setFormData({ heading: "", description: "" });
        setErrors({ heading: "", description: "" });
        navigate("/location");
      } else {
        console.error("Failed to add table 1 data");
      }
    } catch (error) {
      console.error("Error adding table 1 data:", error);
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
              Add Table 1 Data
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Table 1 Data</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Title <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          name="heading"
                          className={`form-control ${
                            errors.heading ? "is-invalid" : ""
                          }`}
                          placeholder="Enter heading"
                          value={formData.heading}
                          onChange={handleChange}
                        />
                        {errors.heading && (
                          <small className="text-danger">
                            {errors.heading}
                          </small>
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
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          placeholder="Enter description"
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
    </div>
  );
};

export default AddDataTable1;
