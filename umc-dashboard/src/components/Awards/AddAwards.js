import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddAwards = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!heading.trim()) {
      newErrors.heading = "Heading is required.";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const response = await api.post(
        "/awards",
        {
          heading,
          description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 201) {
        throw new Error("Failed to add award");
      }
      setHeading("");
      setDescription("");
      setErrors({});
      navigate("/awards");
    } catch (error) {
      console.error("Error:", error);
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
              <Link to="/awards">Awards</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Awards
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Awards</h4>
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
                          className={`form-control form-control-md ${
                            errors.heading ? "is-invalid" : ""
                          }`}
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors((prev) => ({ ...prev, heading: "" }));
                            }
                          }}
                          placeholder="Enter award heading"
                        />
                        {errors.heading && (
                          <div className="invalid-feedback">
                            {errors.heading}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <textarea
                          className={`form-control form-control-md ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors((prev) => ({
                                ...prev,
                                description: "",
                              }));
                            }
                          }}
                          placeholder="Enter a brief description"
                          rows="3"
                          style={{ resize: "none" }}
                        />
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description}
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

export default AddAwards;
