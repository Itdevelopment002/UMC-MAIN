import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Link } from "react-router-dom";

const AddTermsAndConditions = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ heading: "", description: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!heading) {
      newErrors.heading = "Heading is required.";
    }
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

    const formData = {
      heading,
      description,
    };

    try {
      const response = await api.post("/terms-and-conditions", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setHeading("");
        setDescription("");
        setErrors({ heading: "", description: "" });
        navigate("/terms-and-conditions");
      }
    } catch (error) {
      console.error("Error adding terms & conditions:", error);
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
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Terms & Conditions
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Terms & Conditions</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.heading ? "is-invalid" : ""
                          }`}
                          placeholder="Enter heading"
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
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
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          placeholder="Enter description"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
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

export default AddTermsAndConditions;
