import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [departments]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department-info");
      const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
      setDepartments(sortedData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleDeleteModalOpen = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = async (departmentId) => {
    try {
      const response = await api.get(`/department-info/${departmentId}`);
      setSelectedDepartment(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching department:", error);
      toast.error("Failed to fetch department details");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/department-info/${selectedDepartment.id}`);
      setDepartments(
        departments.filter((department) => department.id !== selectedDepartment.id)
      );
      setShowDeleteModal(false);
      toast.success("Department deleted successfully");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDepartment(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedDepartment(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    if (selectedDepartment.heading)
      formData.append("heading", selectedDepartment.heading);
    if (selectedDepartment.link)
      formData.append("link", selectedDepartment.link);
    if (selectedDepartment.mainIcon)
      formData.append("mainIcon", selectedDepartment.mainIcon);

    try {
      await api.put(`/department-info/${selectedDepartment.id}`, formData);
      fetchDepartments();
      setShowEditModal(false);
      toast.success("Department updated successfully");
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update department");
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedDepartment((prevDepartment) => ({ ...prevDepartment, [field]: file }));
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              Departments
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Departments</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-departments"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Department
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Department Name</th>
                          <th>Department Link</th>
                          <th>Department Icon</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((department, index) => (
                          <tr key={department.id}>
                            <td>{index + 1}</td>
                            <td>{department.heading}</td>
                            <td>{department.link}</td>
                            <td>
                              <Link
                                to={`${baseURL}/${department.main_icon_path}`}
                                className="glightbox"
                                data-gallery="department-images"
                              >
                                <img
                                  width="35px"
                                  src={`${baseURL}/${department.main_icon_path}`}
                                  alt={department.heading}
                                />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10 mx-1"
                                onClick={() => handleEditModalOpen(department.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteModalOpen(department)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showDeleteModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this service?</h5>
                  </div>
                  <div className="modal-footer justify-content-right">
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
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Department</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Department Nmae</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Department Name"
                          value={selectedDepartment?.heading || ""}
                          onChange={(e) =>
                            setSelectedDepartment({
                              ...selectedDepartment,
                              heading: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Department Link</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Department Link"
                          value={selectedDepartment?.link || ""}
                          onChange={(e) =>
                            setSelectedDepartment({
                              ...selectedDepartment,
                              link: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                        Department Icon
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleFileChange(e, "mainIcon")}
                        />
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
                      className="btn brn-sm btn-primary"
                      onClick={handleSaveEdit}
                    >
                      Save changes
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

export default DepartmentPage;