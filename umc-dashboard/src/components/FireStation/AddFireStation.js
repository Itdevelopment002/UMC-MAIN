import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
// eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFireStation = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    heading: "",
    address: "",
    phoneNo: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    heading: "",
    address: "",
    phoneNo: "",
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
    if (!formData.heading) {
      newErrors.heading = "Heading is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.phoneNo) {
      newErrors.phoneNo = "Phone number is required";
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
    formDataToSend.append("heading", formData.heading);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phoneNo", formData.phoneNo);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await api.post("/fire-stations", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Fire station added successfully!");

        setFormData({
          heading: "",
          address: "",
          phoneNo: "",
          image: null,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        navigate("/fire-station");
      }
    } catch (error) {
      console.error("Error adding fire station:", error);
      toast.error("Error adding fire station. Please try again.");
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">City Profile</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/fire-station">Fire Station</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Fire Station
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Fire Station</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Heading <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${
                            errors.heading ? "is-invalid" : ""
                          }`}
                          placeholder=""
                          name="heading"
                          value={formData.heading}
                          onChange={handleChange}
                        />
                        {errors.heading && (
                          <small className="text-danger">
                            {errors.heading}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Address <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${
                            errors.address ? "is-invalid" : ""
                          }`}
                          placeholder=""
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                        {errors.address && (
                          <small className="text-danger">
                            {errors.address}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Phone No. <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className={`form-control  ${
                            errors.phoneNo ? "is-invalid" : ""
                          }`}
                          placeholder=""
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleChange}
                        />
                        {errors.phoneNo && (
                          <small className="text-danger">
                            {errors.phoneNo}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Upload Fire Station Image
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-5">
                        <div className="input-group">
                          <input
                            type="file"
                            className={`form-control col-md-12 col-xs-12 userfile  ${
                              errors.image ? "is-invalid" : ""
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

export default AddFireStation;
