import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddWards = () => {
  const [wardNo, setWardNo] = useState("");
  const [wardName, setWardName] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};

    if (!wardNo) {
      validationErrors.wardNo = "Ward No. is required.";
    }

    if (!wardName) {
      validationErrors.wardName = "Ward Name is required.";
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
      const response = await api.post("/wards", {
        ward_no: wardNo,
        ward_name: wardName,
      });
      setWardNo("");
      setWardName("");
      navigate("/wards");
    } catch (err) {
      console.error("Error adding ward:", err);
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
              <Link to="/wards">Wards</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Wards
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Wards</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Ward No. <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.wardNo ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Ward No."
                          value={wardNo}
                          onChange={(e) => {
                            setWardNo(e.target.value);
                            if (errors.wardNo) {
                              setErrors({ ...errors, wardNo: "" });
                            }
                          }}
                        />
                        {errors.wardNo && (
                          <div className="invalid-feedback">
                            {errors.wardNo}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-form-label col-md-2">
                        Ward Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${
                            errors.wardName ? "is-invalid" : ""
                          }`}
                          placeholder="Enter Ward Name"
                          value={wardName}
                          onChange={(e) => {
                            setWardName(e.target.value);
                            if (errors.wardName) {
                              setErrors({ ...errors, wardName: "" });
                            }
                          }}
                        />
                        {errors.wardName && (
                          <div className="invalid-feedback">
                            {errors.wardName}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWards;
