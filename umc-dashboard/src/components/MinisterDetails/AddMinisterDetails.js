import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
// eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMinisterDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    bgcolor: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    designation: "",
    bgcolor: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.designation) {
      newErrors.designation = "Designation is required";
    }
    if (!formData.bgcolor) {
      newErrors.bgcolor = "Bgcolor is required";
    }
    if (!formData.image) {
      newErrors.image = "Image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("designation", formData.designation);
    formDataToSend.append("bgcolor", formData.bgcolor);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await api.post("/minister-details", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Minister added successfully!");

        setFormData({
          name: "",
          designation: "",
          bgcolor: "",
          image: null,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        navigate("/minister");
      }
    } catch (error) {
      console.error("Error adding minister:", error);
      toast.error("Error adding minister. Please try again.");
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/minister">Ministers</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Minister
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Minister</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Minister Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${errors.name ? "is-invalid" : ""
                            }`}
                          placeholder=""
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <small className="text-danger">
                            {errors.name}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Designation <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${errors.designation ? "is-invalid" : ""
                            }`}
                          placeholder=""
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                        />
                        {errors.designation && (
                          <small className="text-danger">
                            {errors.designation}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Background Color <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${errors.bgcolor ? "is-invalid" : ""
                            }`}
                          placeholder=""
                          name="bgcolor"
                          value={formData.bgcolor}
                          onChange={handleChange}
                        />
                        {errors.bgcolor && (
                          <small className="text-danger">
                            {errors.bgcolor}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Upload Minister Image
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <div className="input-group">
                          <input
                            type="file"
                            className={`form-control col-md-12 col-xs-12 userfile  ${errors.image ? "is-invalid" : ""
                              }`}
                            name="image"
                            onChange={handleChange}
                            ref={fileInputRef}
                          />
                        </div>
                        {errors.image && (
                          <small className="text-danger">{errors.image}</small>
                        )}
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary"
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

export default AddMinisterDetails;
