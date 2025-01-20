import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 

const AddUsers = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/public_disclosure");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required.";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    )
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.department) newErrors.department = "Department is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      //eslint-disable-next-line
      const response = await api.post("/users", {
        username: formData.username,
        password: formData.password,
        department: formData.department,
      });
      setSuccess(true);
      setErrors({});
      navigate("/user");
    } catch (error) {
      console.error("There was an error adding the user:", error);
      setErrors({ api: "Error adding user. Please try again." });
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
            <li className="breadcrumb-item active" aria-current="page">
              <Link to="/user">User</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add User
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add User</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>User Name</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.username ? "is-invalid" : ""
                            }`}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                          />
                          {errors.username && (
                            <small className="text-danger">
                              {errors.username}
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Type of Department</label>
                          <select
                            className={`form-control ${
                              errors.department ? "is-invalid" : ""
                            }`}
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                          >
                            <option value="" disabled>
                              Select Department
                            </option>
                            <option value="Admin">
                              Admin
                            </option>
                            {departments.map((department) => (
                              <option
                                value={department.department_name}
                                key={department.id}
                              >
                                {department.department_name}
                              </option>
                            ))}
                          </select>
                          {errors.department && (
                            <small className="text-danger">
                              {errors.department}
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Password</label>
                          <div className="input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`form-control ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <span
                              className="input-group-text"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ cursor: "pointer" }}
                            >
                              {showPassword ? (
                                <AiOutlineEyeInvisible />
                              ) : (
                                <AiOutlineEye />
                              )}
                            </span>
                          </div>
                          {errors.password && (
                            <small className="text-danger">
                              {errors.password}
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Confirm Password</label>
                          <div className="input-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className={`form-control ${
                                errors.confirmPassword ? "is-invalid" : ""
                              }`}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                            />
                            <span
                              className="input-group-text"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              {showConfirmPassword ? (
                                <AiOutlineEyeInvisible />
                              ) : (
                                <AiOutlineEye />
                              )}
                            </span>
                          </div>
                          {errors.confirmPassword && (
                            <small className="text-danger">
                              {errors.confirmPassword}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Submit"
                    />
                    {success && (
                      <p className="text-success">User added successfully!</p>
                    )}
                    {errors.api && <p className="text-danger">{errors.api}</p>}
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

export default AddUsers;
