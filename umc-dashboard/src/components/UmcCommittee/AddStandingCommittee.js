import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddStandingCommittee = () => {
  const [heading, setHeading] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "heading") setHeading(value);
    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!heading.trim()) {
      setError("Member Name is required.");
      return;
    }

    try {
      await api.post("/standing-committee", { heading });
      navigate("/umc-committee");
    } catch (error) {
      console.error("Error submitting standing committee data:", error);
    }
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/umc-committee">UMC Committee</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Standing Committee
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Standing Committee</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
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

export default AddStandingCommittee;
