import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const AddAsstCommissionerDesc = () => {
  const [formData, setFormData] = useState({
    description: "",
    language_code: "",
    commissioner_name: ""
  });

  const [commissioners, setCommissioners] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommissioners = async () => {
      try {
        const response = await api.get("/asst-commissioner-details");
        setCommissioners(response.data);
      } catch (error) {
        console.error("Error fetching commissioners:", error);
      }
    };
    fetchCommissioners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = "Commissioner Description is required.";
    if (!formData.language_code.trim()) newErrors.language_code = "Language Selection is required.";
    if (!formData.commissioner_name.trim()) newErrors.commissioner_name = "Commissioner Selection is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.post("/asst-commissioner-desc", {
        description: formData.description,
        language_code: formData.language_code,
        commissioner_name: formData.commissioner_name
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Commissioner Description added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/assistant-commissioner");
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
          error.response?.data?.message || "Error submitting description:",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error submitting description:", error);
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
              <Link to="/assistant-commissioner">Assistant Commissioner</Link>
            </li>
            <li className="breadcrumb-item active">Add Assistant Commissioner Description</li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <h4 className="page-title">Add Assistant Commissioner Details</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Select Language <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <select
                        className={`form-control ${errors.language_code ? "is-invalid" : ""}`}
                        name="language_code"
                        value={formData.language_code}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select Language</option>
                        <option value="en">English</option>
                        <option value="mr">Marathi</option>
                      </select>
                      {errors.language_code && (
                        <div className="invalid-feedback">{errors.language_code}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Select Commissioner <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <select
                        className={`form-control ${errors.commissioner_name ? "is-invalid" : ""}`}
                        name="commissioner_name"
                        value={formData.commissioner_name}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select Commissioner</option>
                        {commissioners.map((commissioner) => (
                          <option key={commissioner.id} value={commissioner.coName}>
                            {commissioner.coName}
                          </option>
                        ))}
                      </select>
                      {errors.commissioner_name && (
                        <div className="invalid-feedback">{errors.commissioner_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Commissioner Description <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <textarea
                        rows={3}
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Commissioner Description"
                      />
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-4">
                      <button type="submit" className="btn btn-sm btn-primary">
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
      <ToastContainer />
    </div>
  );
};

export default AddAsstCommissionerDesc;