import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddRts = () => {
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ description: "" });

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!description) {
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

    if (!description) {
      return;
    }

    try {
      await api.post("/development-plan-desc", {
        description,
      });
      setDescription("");
      setErrors({ description: "" });
      navigate("/development-plan");
    } catch (error) {
      console.error("Error adding Development Plan:", error);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/development-plan">Development Plan</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Development Plan Description
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">
                        Add Development Plan Description
                      </h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          placeholder=""
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
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

export default AddRts;
