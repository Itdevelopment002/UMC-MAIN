import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";

const AddWardOffice = () => {
  const [formData, setFormData] = useState({
    ward_name: "",
    officer_name: "",
    address: "",
    email: "",
    mobile: "",
    landline: "",
    ward_no: "",
    areas: "",
    map_url: "",
    language_code: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        validationErrors[key] = `${key.replace("_", " ")} is required.`;
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await api.post("/ward-offices", formData);
      if (response.status === 200 || response.status === 201) {
        setFormData({
          ward_name: "",
          officer_name: "",
          address: "",
          email: "",
          mobile: "",
          landline: "",
          ward_no: "",
          areas: "",
          map_url: "",
          language_code: "",
        });
        toast.success("Ward office added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/ward-office");
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
          error.response?.data?.message || "Failed to add ward office. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error adding ward office:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Corporation</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/ward-office">Ward Offices</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Ward Office
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Ward Office</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.language_code ? "is-invalid" : ""
                            }`}
                          name="language_code"
                          value={formData.language_code}
                          onChange={handleChange}
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language_code && (
                          <div className="invalid-feedback">
                            {errors.language_code}
                          </div>
                        )}
                      </div>
                    </div>

                    {[
                      { label: "Ward Name", name: "ward_name" },
                      { label: "Officer Name", name: "officer_name" },
                      { label: "Office Address", name: "address" },
                      { label: "Email Address", name: "email", type: "text" },
                      { label: "Mobile No.", name: "mobile", type: "text" },
                      { label: "Landline No.", name: "landline", type: "text" },
                      { label: "Ward No", name: "ward_no" },
                      { label: "Areas", name: "areas" },
                      { label: "Iframe Src", name: "map_url" },
                    ].map(({ label, name, type = "text" }) => (
                      <div className="form-group row mt-3" key={name}>
                        <label className="col-form-label col-md-2">
                          {label} <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-4">
                          <input
                            type={type}
                            className={`form-control form-control-md ${errors[name] ? "is-invalid" : ""
                              }`}
                            placeholder={`Enter ${label}`}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                          />
                          {errors[name] && (
                            <div className="invalid-feedback">
                              {errors[name]}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

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

export default AddWardOffice;