import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddWard = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    office: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.office.trim()) {
      newErrors.office = "Ward Office no. is required.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Office Address is required.";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone Number is required.";
    }

    if (!formData.email) {
      newErrors.email = "Email Id is required.";
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

    try {
      const response = await api.post("/ward-info", {
        office: formData.office,
        address: formData.address,
        phone: formData.phone,
        email: formData.email
      });

      if (response.status === 201) {
        navigate("/contact-us");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
              Add Ward Information
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Ward Information</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Ward Office No. <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.office ? "is-invalid" : ""
                            }`}
                          name="office"
                          value={formData.office}
                          onChange={handleChange}
                          placeholder="Enter Ward office no."
                        />
                        {errors.office && (
                          <div className="invalid-feedback">
                            {errors.office}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Office Address <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.address ? "is-invalid" : ""
                            }`}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter Office Address"
                        />
                        {errors.address && (
                          <div className="invalid-feedback">
                            {errors.address}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.phone ? "is-invalid" : ""
                            }`}
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter Phone number"
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Email Id <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.email ? "is-invalid" : ""
                            }`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter Email Id"
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email}
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

export default AddWard;
