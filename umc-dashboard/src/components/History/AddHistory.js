import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddHistory = () => {
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setDescription(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      await api.post("/history", { description });
      navigate("/history");
    } catch (error) {
      console.error("Error submitting description:", error);
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
              <Link to="/history">History</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add History
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add History</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                       <input
                          type="text"
                          className={`form-control form-control-md ${
                            error ? "is-invalid" : ""
                          }`}
                          name="description"
                          value={description}
                          onChange={handleChange}
                          placeholder="Enter description"
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

export default AddHistory;
