import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURL } from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './AddUsers.css'

const Users = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [permissionDropdownOpen, setPermissionDropdownOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedUserForPasswordChange, setSelectedUserForPasswordChange] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    notCommon: true,
    notContextual: true
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department-info");
      setDepartments(response.data.sort((a, b) => a.heading.localeCompare(b.heading)));
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const [editData, setEditData] = useState({
    role: "",
    fullname: "",
    permission: [],
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [currentUsers]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api
      .get("/users")
      .then((response) => {
        const usersWithPermissionArray = response.data.map((user) => ({
          ...user,
          permission: Array.isArray(user.permission)
            ? user.permission
            : typeof user.permission === "string"
              ? user.permission.split(",").map((perm) => perm.trim())
              : [],
        }));
        setUsers(usersWithPermissionArray);
      })
      .catch((error) => {
        console.error("Error fetching user details!", error);
        toast.error("Failed to load user details.");
      });
  };

  const handleChangePasswordModalOpen = (user) => {
    setSelectedUserForPasswordChange(user);
    setShowChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setSelectedUserForPasswordChange(null);
    setNewPassword("");
  };

  const commonPasswords = [
    'password', '123456', '12345678', '1234', 'qwerty', '12345',
    'dragon', 'baseball', 'football', 'letmein', 'monkey'
  ];

  useEffect(() => {
    if (newPassword) {
      checkPasswordStrength(newPassword);
    }
  }, [newPassword]);

  const checkPasswordStrength = (pwd) => {
    const hasMinLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[@$!%*?&]/.test(pwd);
    const isNotCommon = !commonPasswords.includes(pwd.toLowerCase());
    const isNotContextual = selectedUserForPasswordChange &&
      !pwd.toLowerCase().includes(selectedUserForPasswordChange.fullname.toLowerCase()) &&
      !pwd.toLowerCase().includes(selectedUserForPasswordChange.email.split('@')[0].toLowerCase());

    setPasswordStrength({
      length: hasMinLength,
      upper: hasUpper,
      lower: hasLower,
      number: hasNumber,
      special: hasSpecial,
      notCommon: isNotCommon,
      notContextual: isNotContextual
    });
  };

  const getPasswordStrength = () => {
    const { length, upper, lower, number, special, notCommon, notContextual } = passwordStrength;

    if (!length || !upper || !lower || !number || !special || !notCommon || !notContextual) {
      return { message: "❌ Weak password - doesn't meet all requirements", color: "danger" };
    }

    return { message: "✅ Strong password - meets all requirements", color: "success" };
  };

  const validatePassword = () => {
    const { length, upper, lower, number, special, notCommon, notContextual } = passwordStrength;
    return length && upper && lower && number && special && notCommon && notContextual;
  };

  const renderPasswordRequirements = () => {
    const { length, upper, lower, number, special, notCommon, notContextual } = passwordStrength;

    return (
      <div className="password-requirements mt-2">
        <small>Password must meet these requirements:</small>
        <ul className="list-unstyled">
          <li className={length ? "text-success" : "text-danger"}>
            {length ? "✓" : "✗"} At least 8 characters
          </li>
          <li className={upper ? "text-success" : "text-danger"}>
            {upper ? "✓" : "✗"} At least one uppercase letter
          </li>
          <li className={lower ? "text-success" : "text-danger"}>
            {lower ? "✓" : "✗"} At least one lowercase letter
          </li>
          <li className={number ? "text-success" : "text-danger"}>
            {number ? "✓" : "✗"} At least one number
          </li>
          <li className={special ? "text-success" : "text-danger"}>
            {special ? "✓" : "✗"} At least one special character (@$!%*?&)
          </li>
          <li className={notCommon ? "text-success" : "text-danger"}>
            {notCommon ? "✓" : "✗"} Not a common password
          </li>
          <li className={notContextual ? "text-success" : "text-danger"}>
            {notContextual ? "✓" : "✗"} Doesn't contain user's name or email
          </li>
        </ul>
      </div>
    );
  };


  const handleChangePasswordSubmit = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (!validatePassword()) {
      toast.error("Password doesn't meet all requirements.");
      return;
    }

    try {
      await api.post(`/edit-users/${selectedUserForPasswordChange.id}/update-password`, {
        newPassword,
      });
      toast.success("Password updated successfully!");
      handleCloseChangePasswordModal();
    } catch (error) {
      console.error("Error updating password:", error);

      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Invalid password update request.");
      } else {
        toast.error("Failed to update password.");
      }
    }
  };


  const handlePermissionChange = (e, permission) => {
    if (e.target.checked) {
      setEditData((prevData) => ({
        ...prevData,
        permission: [...prevData.permission, permission],
      }));
    } else {
      setEditData((prevData) => ({
        ...prevData,
        permission: prevData.permission.filter((perm) => perm !== permission),
      }));
    }
  };

  const handleDeleteModalOpen = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = (user) => {
    setEditData({
      ...user,
      permission: user.permission,
    });
    setShowEditModal(true);
  };

  const handleDelete = () => {
    api
      .post(`/delete-users/${selectedUser.id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
        toast.success("User is deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting user!", error);
        toast.error("Failed to delete user.");
      });
  };

  const handleEditSubmit = async () => {
    const payload = {
      fullname: editData.fullname,
      email: editData.email,
      role: editData.role,
      permission: editData.permission.join(","),
      status: editData.status,
      password: editData.password,
    };

    try {
      await api.post(`/edit-users/${editData.id}`, payload);
      fetchUsers();
      setShowEditModal(false);
      toast.success("User is updated successfully!");
    } catch (error) {
      console.error("Error updating user!", error);
      toast.error("Failed to update user.");
    }
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({
      role: "",
      fullname: "",
      permission: [],
      status: "",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Users
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Users</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-users"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add User
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th className="text-center">Sr. No.</th>
                          <th>Username</th>
                          <th>Full name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.map((user, index) => (
                          <tr key={user.id}>
                            <td className="text-center">{indexOfFirstItem + index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => handleEditModalOpen(user)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteModalOpen(user)}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-warning btn-sm m-t-10"
                                onClick={() => handleChangePasswordModalOpen(user)}
                              >
                                Change Password
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <ul className="pagination mt-4">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {currentPage > 2 && (
                    <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(1)}>
                        1
                      </button>
                    </li>
                  )}
                  {currentPage > 3 && (
                    <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(2)}>
                        2
                      </button>
                    </li>
                  )}
                  {currentPage > 4 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page >= currentPage - 1 && page <= currentPage + 1
                    )
                    .map((page) => (
                      <li
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                        key={page}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                  {currentPage < totalPages - 3 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {currentPage < totalPages - 2 && (
                    <li
                      className={`page-item ${currentPage === totalPages - 1 ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages - 1)}
                      >
                        {totalPages - 1}
                      </button>
                    </li>
                  )}
                  {currentPage < totalPages - 1 && (
                    <li
                      className={`page-item ${currentPage === totalPages ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  )}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {showDeleteModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this user?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseDeleteModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEditModal && (
            <div className="modal fade show d-block"
              style={{
                overflowY: "auto",
                maxHeight: "100vh",
                scrollbarWidth: "none",
              }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit User</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.fullname}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              fullname: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          className="form-control"
                          value={editData.role}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              role: e.target.value,
                              permission: e.target.value === "Superadmin" ? ["All"] : [],
                            })
                          }
                        >
                          <option value="Superadmin">Superadmin</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Permission</label>
                        {editData.role === "Superadmin" ? (
                          <input type="text" className="form-control" value="All" disabled />
                        ) : (
                          <div className="dropdown custom-dropdown">
                            <button
                              type="button"
                              className="btn w-100 text-start d-flex justify-content-between align-items-center"
                              onClick={() => setPermissionDropdownOpen(!permissionDropdownOpen)}
                            >
                              <span className="selected-options text-truncate" title={editData.permission.join(", ")}>
                                {editData.permission.length > 0 ? editData.permission.join(", ") : "Select Permissions"}
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
                                      checked={editData.permission.includes(dept.heading)}
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
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          className="form-control"
                          value={editData.status}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Deactive">Deactive</option>
                        </select>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseEditModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleEditSubmit}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showChangePasswordModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Change Password for {selectedUserForPasswordChange?.fullname}</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>New Password</label>
                        <div className="input-group position-relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-md"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            style={{ paddingRight: "35px" }}
                          />
                          <span
                            className="position-absolute end-0 translate-middle-y me-2"
                            style={{ cursor: "pointer", right: "10px", top: "12px" }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        {newPassword && (
                          <small className={`text-${getPasswordStrength().color}`}>
                            {getPasswordStrength().message}
                          </small>
                        )}
                        {newPassword && renderPasswordRequirements()}
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseChangePasswordModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleChangePasswordSubmit}
                      disabled={!newPassword || !validatePassword()}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Users;