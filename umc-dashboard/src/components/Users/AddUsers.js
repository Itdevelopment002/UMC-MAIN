import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import './AddUsers.css';

const AddUsers = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfpassword, setCnfpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();
  const [permissionDropdownOpen, setPermissionDropdownOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department-info");
      setDepartments(response.data.sort((a, b) => a.heading.localeCompare(b.heading)));
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const getPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const moderateRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (strongRegex.test(password)) {
      return { message: "✅ Strong password", color: "success" };
    } else if (moderateRegex.test(password)) {
      return { message: "⚠️ Moderate password", color: "warning" };
    } else {
      return { message: "❌ Weak password", color: "danger" };
    }
  };

  const checkUsernameExists = () => {
    if (!username) return false;
    const userExists = users.some((user) => user.username === username);
    setErrors((prev) => ({
      ...prev,
      username: userExists ? "Username already exists. Please choose a different one." : "",
    }));
    if (userExists) {
      setUsername("");
    }
    return userExists;
  };

  const checkEmailExists = () => {
    if (!email) return false;
    const emailExists = users.some((user) => user.email === email);
    setErrors((prev) => ({
      ...prev,
      email: emailExists ? "Email address already exists. Please use a different email." : "",
    }));
    if (emailExists) {
      setEmail("");
    }
    return emailExists;
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setErrors((prev) => ({ ...prev, role: "" }));

    if (selectedRole === "Superadmin") {
      setSelectedPermission(["All"]);
    } else {
      setSelectedPermission([]);
    }
  };

  const handlePermissionChange = (e, department) => {
    const isChecked = e.target.checked;
    setSelectedPermission((prev) => {
      if (isChecked) {
        return [...prev, department];
      } else {
        return prev.filter((item) => item !== department);
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!username) {
      newErrors.username = "Username is required.";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
      isValid = false;
    } else if (checkUsernameExists()) {
      isValid = false;
    }

    if (!fullname) {
      newErrors.fullname = "Full name is required.";
      isValid = false;
    } else if (fullname.length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters.";
      isValid = false;
    }

    if (!role) {
      newErrors.role = "Role is required.";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    } else if (checkEmailExists()) {
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    // Confirm password validation
    if (password !== cnfpassword) {
      newErrors.cnfpassword = "Passwords do not match.";
      isValid = false;
    }

    // Permission validation for Admin role
    if (role === "Admin" && selectedPermission.length === 0) {
      newErrors.selectedPermission = "At least one permission must be selected for Admin role.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const isValid = validateForm();
    if (!isValid) return;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullname", fullname);
    formData.append("role", role);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("permission", selectedPermission.join(","));
    if (image) formData.append("userImage", image);

    try {
      const response = await api.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        navigate("/users");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setErrors({ submit: "Failed to add user. Please try again." });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="#">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/users">Users</Link></li>
          <li className="breadcrumb-item active">Add User</li>
        </ol>
        <div className="row">
          <div className="col-lg-12">
            <div className="card-box">
              <div className="card-block">
                <h4 className="page-title">Add User</h4>

                {errors.submit && (
                  <div className="alert alert-danger">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>
                      Username <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.username ? "is-invalid" : ""}`}
                      placeholder="Enter Username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrors((prev) => ({ ...prev, username: "" }));
                      }}
                      onBlur={checkUsernameExists}
                    />
                    {errors.username && (
                      <div className="invalid-feedback d-block">
                        {errors.username}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
                      placeholder="Enter Full Name"
                      value={fullname}
                      onChange={(e) => {
                        setFullname(e.target.value);
                        setErrors((prev) => ({ ...prev, fullname: "" }));
                      }}
                    />
                    {errors.fullname && (
                      <div className="invalid-feedback d-block">
                        {errors.fullname}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      onBlur={checkEmailExists}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>User Image</label>
                    <input
                      type="file"
                      className={`form-control ${errors.image ? "is-invalid" : ""}`}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {errors.image && (
                      <div className="invalid-feedback d-block">
                        {errors.image}
                      </div>
                    )}
                  </div>

                  {previewImage && (
                    <div className="mt-2">
                      <img src={previewImage} alt="Preview" className="img-thumbnail" width="150" />
                    </div>
                  )}

                  <div className="form-group">
                    <label>
                      Role <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control ${errors.role ? "is-invalid" : ""}`}
                      value={role}
                      onChange={handleRoleChange}
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="Superadmin">Superadmin</option>
                      <option value="Admin">Admin</option>
                    </select>
                    {errors.role && (
                      <div className="invalid-feedback d-block">
                        {errors.role}
                      </div>
                    )}
                  </div>

                  {role === "Admin" && (
                    <div className="dropdown custom-dropdown mb-3">
                      <button
                        type="button"
                        className="btn w-100 text-start d-flex justify-content-between align-items-center"
                        onClick={() => setPermissionDropdownOpen(!permissionDropdownOpen)}
                      >
                        <span className="selected-options text-truncate" title={selectedPermission.join(", ")}>
                          {selectedPermission.length > 0 ? selectedPermission.join(", ") : "Select Permissions"}
                        </span>
                        <i style={{ fontSize: "10px", fontWeight: "100" }} className="fa fa-chevron-down"></i>
                      </button>

                      {permissionDropdownOpen && (
                        <div className="dropdown-menu show w-100 p-2 rounded" style={{ maxHeight: "200px", overflowY: "auto" }}>
                          {departments.map((dept, index) => (
                            <div key={index} className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                value={dept.heading}
                                checked={selectedPermission.includes(dept.heading)}
                                onChange={(e) => handlePermissionChange(e, dept.heading)}
                                id={`perm-${index}`}
                              />
                              <label className="form-check-label ms-2" htmlFor={`perm-${index}`}>
                                {dept.heading}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {errors.selectedPermission && (
                        <div className="text-danger small mt-1">
                          {errors.selectedPermission}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="form-group position-relative">
                      <label>
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, password: "" }));
                          }}
                        />
                        <span
                          className="input-group-text"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </span>
                      </div>
                      {password && (
                        <small className={`text-${getPasswordStrength(password).color}`}>
                          {getPasswordStrength(password).message}
                        </small>
                      )}
                      <small className="text-muted d-block mt-1">
                        Use at least 8 characters, including uppercase, lowercase, numbers, and special characters (@, #, $, etc.).
                      </small>
                      {errors.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-group position-relative mt-3">
                      <label>
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showCnfPassword ? "text" : "password"}
                          className={`form-control ${errors.cnfpassword ? "is-invalid" : ""}`}
                          placeholder="Confirm Password"
                          value={cnfpassword}
                          onChange={(e) => {
                            setCnfpassword(e.target.value);
                            setErrors((prev) => ({ ...prev, cnfpassword: "" }));
                          }}
                        />
                        <span
                          className="input-group-text"
                          onClick={() => setShowCnfPassword(!showCnfPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className={`fas ${showCnfPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </span>
                      </div>
                      {errors.cnfpassword && (
                        <div className="invalid-feedback d-block">
                          {errors.cnfpassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-sm btn-primary mt-3">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsers;