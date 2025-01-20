import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editUserData, setEditUserData] = useState({
    username: "",
    password: "",
    department: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      const sortedUsers = response.data.sort((a, b) =>
        a.department.localeCompare(b.department)
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/users${userToDelete.id}`);
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditUserData(user);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/users${userToEdit.id}`, editUserData);
      setUsers(
        users.map((user) =>
          user.id === userToEdit.id ? { ...user, ...editUserData } : user
        )
      );
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const currentPageData = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              User
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">User</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right">
                      <Link
                        to="/add-user"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add User
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive datatable">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>User Name</th>
                          <th>Password</th>
                          <th>Type of Dapartment</th>
                          <th width="20%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((user, index) => (
                            <tr key={user.id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{user.username}</td>
                              <td>{user.password}</td>
                              <td>{user.department}</td>
                              <td>
                                <button
                                  onClick={() => handleEditClick(user)}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(user)}
                                  className="btn btn-danger btn-sm m-t-10"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                              No user available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from(
                        { length: Math.ceil(users.length / itemsPerPage) },
                        (_, i) => (
                          <li
                            className={`page-item ${
                              currentPage === i + 1 ? "active" : ""
                            }`}
                            key={i}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        )
                      )}
                      <li
                        className={`page-item ${
                          currentPage === Math.ceil(users.length / itemsPerPage)
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showEditModal && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit User</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editUserData.username}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={editUserData.password}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Department</label>
                        <select
                          className="form-control"
                          value={editUserData.department}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              department: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Select Department
                          </option>
                          <option value="Admin">Admin</option>
                          {departments.map((department) => (
                            <option
                              value={department.department_name}
                              key={department.id}
                            >
                              {department.department_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleEditSave}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this user?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={handleDeleteConfirm}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
