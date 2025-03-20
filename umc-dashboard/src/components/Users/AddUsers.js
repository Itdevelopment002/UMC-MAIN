import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Link } from "react-router-dom";
import './AddUsers.css'

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

  const checkUsernameExists = () => {
    if (!username) return;
    const userExists = users.some((user) => user.username === username);
    setErrors((prev) => ({
      ...prev,
      username: userExists ? "Username already exists." : "",
    }));
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
    if (!username) newErrors.username = "Username is required.";
    if (!fullname) newErrors.fullname = "Full name is required.";
    if (!role) newErrors.role = "Role is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (password !== cnfpassword) {
      newErrors.cnfpassword = "Passwords do not match.";
    }
    if (role === "Admin" && selectedPermission.length === 0) {
      newErrors.selectedPermission = "Permission must be selected.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
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
                    {errors.username && <small className="text-danger">{errors.username}</small>}
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
                    {errors.fullname && <small className="invalid-feedback">{errors.fullname}</small>}
                  </div>

                  <div className="form-group">
                    <label>
                      Email <span className="text-danger">*</span>
                    </label>
                    <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="Enter Email" value={email} onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }} />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>

                  <div className="form-group">
                    <label>User Image</label>
                    <input
                      type="file"
                      className={`form-control ${errors.image ? "is-invalid" : ""}`}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {errors.image && <small className="text-danger">{errors.image}</small>}
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
                    <select className={`form-control ${errors.role ? "is-invalid" : ""}`} value={role} onChange={handleRoleChange}>
                      <option value="" disabled>Select Role</option>
                      <option value="Superadmin">Superadmin</option>
                      <option value="Admin">Admin</option>
                    </select>
                    {errors.role && <small className="text-danger">{errors.role}</small>}
                  </div>

                  {role === "Admin" && (
                    <div className="dropdown custom-dropdown">
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
                      {errors.selectedPermission && <span>{errors.selectedPermission}</span>}
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
                      {errors.password && <small className="text-danger">{errors.password}</small>}
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
                      {errors.cnfpassword && <small className="text-danger">{errors.cnfpassword}</small>}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-sm btn-primary">Submit</button>
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