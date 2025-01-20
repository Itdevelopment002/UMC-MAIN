import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddCo = () => {
  const [formData, setFormData] = useState({
    coName: "",
    designation: "",
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
    if (!formData.coName.trim()) {
      newErrors.coName = "CO Name is required.";
    }
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.coImage) {
      newErrors.coImage = "CO Image is required.";
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
    data.append("coName", formData.coName);
    data.append("designation", formData.designation);
    data.append("email", formData.email);
    if (formData.coImage) {
      data.append("coImage", formData.coImage);
    }

    try {
      const response = await api.post("/ceos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        navigate("/history");
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
              <Link to="#.">About KBMC</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/history">History</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add CO
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add CO</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        CO Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.coName ? "is-invalid" : ""
                          }`}
                          name="coName"
                          value={formData.coName}
                          onChange={handleChange}
                          placeholder="Enter CO name"
                        />
                        {errors.coName && (
                          <div className="invalid-feedback">
                            {errors.coName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Designation <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.designation ? "is-invalid" : ""
                          }`}
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          placeholder="Enter designation"
                        />
                        {errors.designation && (
                          <div className="invalid-feedback">
                            {errors.designation}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Email Id <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="email"
                          className={`form-control form-control-md ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row my-3">
                      <label className="col-form-label col-md-2">
                        Upload CO Image <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="userfile"
                          name="coImage"
                          className={`form-control form-control-md ${
                            errors.coImage ? "is-invalid" : ""
                          }`}
                          onChange={handleFileChange}
                        />
                        {errors.coImage && (
                          <div className="invalid-feedback">
                            {errors.coImage}
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

export default AddCo;
