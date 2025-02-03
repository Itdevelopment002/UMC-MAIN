import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import api from "../api";

const AddHomeServices2 = () => {
  const [heading, setHeading] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};

    if (!heading) {
      validationErrors.heading = "Service Heading is required.";
    }

    if (!link) {
      validationErrors.link = "Service Link is required.";
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
      const response = await api.post("/home-services2", {
        heading: heading,
        link: link,
      });
      setHeading("");
      setLink("");
      navigate("/home-service2");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to add home service. Please try again.');
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
              <Link to="/home-service2">Home Service 2</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Home Service 2
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Home Service 2</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Service heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.heading ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Service Heading"
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
                        />
                        {errors.heading && (
                          <div className="invalid-feedback">
                            {errors.heading}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Service Link <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.link ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Service Link"
                          value={link}
                          onChange={(e) => {
                            setLink(e.target.value);
                            if (errors.link) {
                              setErrors({ ...errors, link: "" });
                            }
                          }}
                        />
                        {errors.link && (
                          <div className="invalid-feedback">
                            {errors.link}
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
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHomeServices2;
