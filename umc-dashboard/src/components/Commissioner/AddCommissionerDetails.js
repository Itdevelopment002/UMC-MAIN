import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddCommissionerDetails = () => {
  const [formData, setFormData] = useState({
    coName: "",
    designation: "",
    qualification: "",
    address: "",
    number: "",
    email: "",
    coImage: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, coImage: e.target.files[0] });
    setErrors({ ...errors, coImage: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.coName.trim()) newErrors.coName = "CO Name is required.";
    if (!formData.designation.trim())
      newErrors.designation = "Designation is required.";
    if (!formData.qualification.trim())
      newErrors.qualification = "Qualification is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.number.trim()) newErrors.address = "Address is required.";
    // if (!formData.number.trim()) {
    //   newErrors.number = "Phone number is required.";
    // } else if (!/^\d{10}$/.test(formData.number)) {
    //   newErrors.number = "Phone number must be 10 digits.";
    // }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.coImage) newErrors.coImage = "CO Image is required.";
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
    data.append("coName", formData.coName);
    data.append("designation", formData.designation);
    data.append("qualification", formData.qualification);
    data.append("address", formData.address);
    data.append("number", formData.number);
    data.append("email", formData.email);
    if (formData.coImage) data.append("coImage", formData.coImage);

    try {
      const response = await api.post("/commissioner-details", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        navigate("/commissioner");
      }
    } catch (error) {
      console.error(error);
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
            <li className="breadcrumb-item active">Add Commissioner Details</li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <h4 className="page-title">Add Commissioner Details</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Commissioner Name <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.coName ? "is-invalid" : ""
                        }`}
                        name="coName"
                        value={formData.coName}
                        onChange={handleChange}
                        placeholder="Enter CO Name"
                      />
                      {errors.coName && (
                        <div className="invalid-feedback">{errors.coName}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Designation <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.designation ? "is-invalid" : ""
                        }`}
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Enter Designation"
                      />
                      {errors.designation && (
                        <div className="invalid-feedback">
                          {errors.designation}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                    Education Qualification <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.qualification ? "is-invalid" : ""
                        }`}
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="Enter Qualification"
                      />
                      {errors.qualification && (
                        <div className="invalid-feedback">
                          {errors.qualification}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                    Office Address <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.number ? "is-invalid" : ""
                        }`}
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="Enter Phone Number"
                      />
                      {errors.number && (
                        <div className="invalid-feedback">{errors.number}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      CO Image <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        type="file"
                        className={`form-control ${
                          errors.coImage ? "is-invalid" : ""
                        }`}
                        name="coImage"
                        onChange={handleFileChange}
                      />
                      {errors.coImage && (
                        <div className="invalid-feedback">{errors.coImage}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-4">
                      <button type="submit" className="btn btn-primary">
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

export default AddCommissionerDetails;