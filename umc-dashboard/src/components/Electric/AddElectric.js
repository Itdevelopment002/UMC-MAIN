import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddElectric = () => {
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    mobileNo: "",
    vendorName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Please enter a valid 10-digit mobile number.";
    }
    if (!formData.vendorName.trim()) {
      newErrors.vendorName = "Vendor name is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line
      const response = await api.post("/electric", formData);
      navigate("/electric");
    } catch (err) {
      console.error("Error:", err);
      setErrors({ global: "Failed to add electric item. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">City Profile</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/electric">Electric</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Electric
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Electric</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${
                            errors.heading ? "is-invalid" : ""
                          }`}
                          name="heading"
                          value={formData.heading}
                          onChange={handleChange}
                          placeholder="Enter heading"
                        />
                        {errors.heading && (
                          <div className="text-danger mt-1">
                            {errors.heading}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter description"
                        />
                        {errors.description && (
                          <div className="text-danger mt-1">
                            {errors.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Mobile No. <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${
                            errors.mobileNo ? "is-invalid" : ""
                          }`}
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                        />
                        {errors.mobileNo && (
                          <div className="text-danger mt-1">
                            {errors.mobileNo}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Vendor Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${
                            errors.vendorName ? "is-invalid" : ""
                          }`}
                          name="vendorName"
                          value={formData.vendorName}
                          onChange={handleChange}
                          placeholder="Enter vendor name"
                        />
                        {errors.vendorName && (
                          <div className="text-danger mt-1">
                            {errors.vendorName}
                          </div>
                        )}
                      </div>
                    </div>

                    {errors.global && (
                      <div className="text-danger mb-3">{errors.global}</div>
                    )}

                    <div className="form-group row">
                      <div className="col-md-5">
                        <button
                          type="submit"
                          className="btn btn-primary btn-md"
                          disabled={loading}
                        >
                          {loading ? "Submitting..." : "Submit"}
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
    </>
  );
};

export default AddElectric;
