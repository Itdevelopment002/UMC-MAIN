import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const AddPrivateHospital = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    division: "",
    principalDoctor: "",
    address: "",
    phoneNo: "",
    mobileNo: "",
    beds: "",
    facilities: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.hospitalName)
      newErrors.hospitalName = "Hospital Name is required";
    if (!formData.division) newErrors.division = "Division is required";
    if (!formData.principalDoctor)
      newErrors.principalDoctor = "Principal Doctor Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phoneNo) newErrors.phoneNo = "Phone No is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile No is required";
    if (!formData.beds) newErrors.beds = "Number of Beds is required";
    if (!formData.facilities) newErrors.facilities = "Facilities are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const response = await api.post("/private-hospital", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setFormData({
          hospitalName: "",
          division: "",
          principalDoctor: "",
          address: "",
          phoneNo: "",
          mobileNo: "",
          beds: "",
          facilities: "",
        });
        navigate("/hospital");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
              <Link to="/private-hospital">Hospital</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Hospital
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <h4 className="page-title">Add Hospital</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form-group">
                          <label>Hospital Name</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.hospitalName ? "is-invalid" : ""
                            }`}
                            name="hospitalName"
                            value={formData.hospitalName}
                            onChange={handleChange}
                            placeholder="Enter hospital name"
                          />
                          {errors.hospitalName && (
                            <div className="invalid-feedback">
                              {errors.hospitalName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Division</label>
                          <select
                            className={`form-control ${
                              errors.division ? "is-invalid" : ""
                            }`}
                            name="division"
                            value={formData.division}
                            onChange={handleChange}
                          >
                            <option disabled value="">
                              Select division
                            </option>
                            <option value="West">West</option>
                            <option value="East">East</option>
                          </select>
                          {errors.division && (
                            <div className="invalid-feedback">
                              {errors.division}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group">
                          <label>Principal Doctor</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.principalDoctor ? "is-invalid" : ""
                            }`}
                            name="principalDoctor"
                            value={formData.principalDoctor}
                            onChange={handleChange}
                            placeholder="Enter principal doctor's name"
                          />
                          {errors.principalDoctor && (
                            <div className="invalid-feedback">
                              {errors.principalDoctor}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Address</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.address ? "is-invalid" : ""
                            }`}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                          />
                          {errors.address && (
                            <div className="invalid-feedback">
                              {errors.address}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Phone No.</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.phoneNo ? "is-invalid" : ""
                            }`}
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                          />
                          {errors.phoneNo && (
                            <div className="invalid-feedback">
                              {errors.phoneNo}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Mobile No.</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.mobileNo ? "is-invalid" : ""
                            }`}
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            placeholder="Enter mobile number"
                          />
                          {errors.mobileNo && (
                            <div className="invalid-feedback">
                              {errors.mobileNo}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>No. of Beds</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.beds ? "is-invalid" : ""
                            }`}
                            name="beds"
                            value={formData.beds}
                            onChange={handleChange}
                            placeholder="Enter number of beds"
                          />
                          {errors.beds && (
                            <div className="invalid-feedback">
                              {errors.beds}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Facilities</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.facilities ? "is-invalid" : ""
                            }`}
                            name="facilities"
                            value={formData.facilities}
                            onChange={handleChange}
                            placeholder="Enter facilities"
                          />
                          {errors.facilities && (
                            <div className="invalid-feedback">
                              {errors.facilities}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
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

export default AddPrivateHospital;
