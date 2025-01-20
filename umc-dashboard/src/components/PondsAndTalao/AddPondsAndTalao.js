import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const AddPondsAndTalao = () => {
  const [pondsName, setPondsName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pondsName.trim()) {
      setErrorMessage("Talao name is required.");
      return;
    } else {
      setErrorMessage("");
    }

    try {
      setLoading(true);
      const response = await api.post(
        "/ponds-talao",
        { name: pondsName },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        navigate("/ponds-talao");
      } else {
        setErrorMessage("Failed to add ponds. Please try again.");
      }
    } catch (error) {
      console.error("Error while adding ponds:", error);
      setErrorMessage("Error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }

    setPondsName("");
  };

  const handleInputChange = (e) => {
    setPondsName(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/home">City Profile</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/ponds-talao">Ponds and Talao</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Add Ponds and Talao
          </li>
        </ol>
        <div className="row">
          <div className="col-lg-12">
            <div className="card-box">
              <div className="card-block">
                <h4 className="page-title">Add Ponds and Talao</h4>
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3">
                      Talao Name <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-5">
                      <input
                        type="text"
                        className={`form-control ${
                          errorMessage ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Talao Name"
                        value={pondsName}
                        onChange={handleInputChange}
                        aria-label="Talao Name"
                      />
                      {errorMessage && (
                        <small className="text-danger">{errorMessage}</small>
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
  );
};

export default AddPondsAndTalao;
