import React, { useState } from "react";
import api from "../api";
//eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AddRecruitment = () => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({
    heading: "",
    description: "",
    link: "",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!heading) {
      newErrors.heading = "Job Heading is required.";
    }
    if (!description) {
      newErrors.description = "Job Description is required.";
    }
    if (!link) {
      newErrors.link = "Job Link is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const videoData = {
      heading,
      description,
      link,
    };

    try {
      await api.post("/recruitment", videoData);
      toast.success("Recruitment added successfully!");
      setDescription("");
      setErrors({ heading: "", description: "", link: "" });
      navigate("/recruitment");
    } catch (error) {
      toast.error("Failed to add recruitment data. Please try again.");
    }
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/recruitment">Recruitment</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Recruitment
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Recruitment</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Job Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control ${errors.heading ? "is-invalid" : ""
                            }`}
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select Job Heading
                          </option>
                          <option value="Contract Basis Recruitment">
                            Contract Basis Recruitment
                          </option>
                          <option value="Old Recruitment">
                            Old Recruitment
                          </option>
                        </select>
                        {errors.heading && (
                          <small className="invalid-feedback">
                            {errors.heading}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Job Description{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.description ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Job Description"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
                        />
                        {errors.description && (
                          <small className="invalid-feedback">
                            {errors.description}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Job Link{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${errors.link ? "is-invalid" : ""
                            }`}
                          placeholder="Enter Job Link"
                          value={link}
                          onChange={(e) => {
                            setLink(e.target.value);
                            if (errors.link) {
                              setErrors({ ...errors, link: "" });
                            }
                          }}
                        />
                        {errors.link && (
                          <small className="invalid-feedback">
                            {errors.link}
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
    </>
  );
};

export default AddRecruitment;
