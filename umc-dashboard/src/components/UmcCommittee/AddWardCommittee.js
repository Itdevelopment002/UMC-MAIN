import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddWardCommittee = () => {
  const [ward, setWard] = useState("");
  const [heading, setHeading] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ward") setWard(value);
    if (name === "heading") setHeading(value);
    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ward.trim()) {
      setError("Ward Name is required.");
      return;
    }
    if (!heading.trim()) {
      setError("Member name is required.");
      return;
    }

    try {
      await api.post("/ward-committee", { ward, heading });
      navigate("/umc-committee");
    } catch (error) {
      console.error("Error submitting ward committee:", error);
    }
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Corporation</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/umc-committee">UMC Committee</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Ward Committee
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Ward Committee</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Ward Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${error ? "is-invalid" : ""}`}
                          name="ward"
                          value={ward}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Ward Name</option>
                          <option value="Ward Committee A">Ward Committee A</option>
                          <option value="Ward Committee B">Ward Committee B</option>
                          <option value="Ward Committee C">Ward Committee C</option>
                          <option value="Ward Committee D">Ward Committee D</option>
                        </select>
                        {error && <div className="invalid-feedback">{error}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Member Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${error ? "is-invalid" : ""
                            }`}
                          name="heading"
                          value={heading}
                          onChange={handleChange}
                          placeholder="Enter Member Name"
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
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

export default AddWardCommittee;
