import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddWard = () => {
  const [office, setOffice] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "office") setOffice(value);
    if (name === "address") setAddress(value);
    if (name === "phone") setPhone(value);
    if (name === "email") setEmail(value);
    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!office.trim()) {
      setError("Ward Office No. is required.");
      return;
    }
    if (!address.trim()) {
      setError("address is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone Number is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email Id is required.");
      return;
    }

    try {
      await api.post("/ward-info", { office, address, phone, email });
      navigate("/contact-us");
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
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/contact-us">Contact Us</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Ward Information
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Ward Information</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Ward Office No. <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${error ? "is-invalid" : ""
                            }`}
                          name="office"
                          value={office}
                          onChange={handleChange}
                          placeholder="Enter Ward office no."
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Address <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${error ? "is-invalid" : ""
                            }`}
                          name="address"
                          value={address}
                          onChange={handleChange}
                          placeholder="Enter Address"
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${error ? "is-invalid" : ""
                            }`}
                          name="phone"
                          value={phone}
                          onChange={handleChange}
                          placeholder="Enter Phone number"
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Email Id <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${error ? "is-invalid" : ""
                            }`}
                          name="email"
                          value={email}
                          onChange={handleChange}
                          placeholder="Enter Email Id"
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

export default AddWard;
