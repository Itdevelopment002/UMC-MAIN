import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const AddTreeCensus = () => {
  const [formData, setFormData] = useState({
    description: "",
    total: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.total.trim()) newErrors.total = "Total Number is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/tree-census", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Tree Census data added successfully!");
        setFormData({ description: "", total: "" });

        navigate("/tree-census");
      } else {
        toast.error("Failed to add Tree Census data.");
      }
    } catch (error) {
      console.error("Error in submission:", error);
      toast.error("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">City Profile</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/tree-census">Tree Census</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Tree Census
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <h4 className="page-title">Add Tree Census</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          aria-describedby="descriptionError"
                        />
                        {errors.description && (
                          <small id="descriptionError" className="text-danger">
                            {errors.description}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Total <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.total ? "is-invalid" : ""
                          }`}
                          name="total"
                          value={formData.total}
                          onChange={handleChange}
                          aria-describedby="totalError"
                        />
                        {errors.total && (
                          <small id="totalError" className="text-danger">
                            {errors.total}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-5">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Submitting..." : "Submit"}
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
    </>
  );
};

export default AddTreeCensus;
