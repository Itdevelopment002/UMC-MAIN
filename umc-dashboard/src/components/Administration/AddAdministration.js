import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddAdministration = () => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};

    if (!name) {
      validationErrors.name = "name is required.";
    }

    if (!designation) {
      validationErrors.designation = "designation is required.";
    }
    if (!phone) {
      validationErrors.phone = "phone is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      //eslint-disable-next-line
      const response = await api.post("/administration", {
        name: name,
        designation: designation,
        phone: phone,
      });
      setName("");
      setDesignation("");
      setPhone("");
      navigate("/adminstration");
    } catch (error) {
      console.error("Error adding ward:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/adminstration">Administration</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Administration
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Administration</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.name ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) {
                              setErrors({ ...errors, name: "" });
                            }
                          }}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name}
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
                          className={`form-control form-control-md ${errors.designation ? "is-invalid" : ""
                            }`}
                          placeholder="Enter designation"
                          value={designation}
                          onChange={(e) => {
                            setDesignation(e.target.value);
                            if (errors.designation) {
                              setErrors({ ...errors, designation: "" });
                            }
                          }}
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
                        Phone No. <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.phone ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Phone"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) {
                              setErrors({ ...errors, phone: "" });
                            }
                          }}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary btn-sm mt-3"
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

export default AddAdministration;
