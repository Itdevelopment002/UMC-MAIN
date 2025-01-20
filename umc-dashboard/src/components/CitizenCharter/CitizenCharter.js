import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import api, { baseURL } from "../api";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CitizenCharter = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: "", pdf: null });
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [errors, setErrors] = useState({ name: "", pdf: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const departmentsPerPage = 10;

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/citizen-charter");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Error fetching department!");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newDepartment.name) newErrors.name = "Department name is required.";
    if (!newDepartment.pdf) newErrors.pdf = "PDF file is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setNewDepartment({ name: "", pdf: null });
    setErrors({ name: "", pdf: "" });
    const pdfInput = document.getElementById("pdf");
    if (pdfInput) pdfInput.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewDepartment((prev) => ({ ...prev, pdf: file }));
    if (errors.pdf) setErrors((prevErrors) => ({ ...prevErrors, pdf: "" }));
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", newDepartment.name);
    formData.append("pdf", newDepartment.pdf);

    try {
      await api.post("/citizen-charter", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
      fetchDepartments();
      toast.success("Department added successfully!");
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Error adding department!");
    }
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedDepartmentId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteDepartment = async () => {
    try {
      await api.delete(`/citizen-charter/${selectedDepartmentId}`);
      fetchDepartments();
      setShowDeleteModal(false);
      toast.success("Department deleted successfully!");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Error deleting department!");
    }
  };

  const handleOpenEditModal = (dept) => {
    setSelectedDepartmentId(dept.id);
    setNewDepartment({ name: dept.name, pdf: null });
    setShowEditModal(true);
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newDepartment.name);
    if (newDepartment.pdf) formData.append("pdf", newDepartment.pdf);

    try {
      await api.put(`/citizen-charter/${selectedDepartmentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchDepartments();
      setShowEditModal(false);
      resetForm();
      toast.success("Department updated successfully!");
    } catch (error) {
      console.error("Error editing department:", error);
      toast.error("Error updating department!");
    }
  };

  const indexOfLastDepartment = currentPage * departmentsPerPage;
  const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
  const currentDepartments = departments.slice(
    indexOfFirstDepartment,
    indexOfLastDepartment
  );

  const totalPages = Math.ceil(departments.length / departmentsPerPage);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Citizen Charter
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <h4 className="page-title">Citizen Charter</h4>
                <hr />
                <form onSubmit={handleAddDepartment}>
                  <div className="form-group row">
                    <label className="col-form-label col-md-2">
                      Department Name <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        className={`form-control form-control-md ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        value={newDepartment.name}
                        onChange={(e) => {
                          setNewDepartment({
                            ...newDepartment,
                            name: e.target.value,
                          });
                          if (errors.name)
                            setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                      />
                      {errors.name && (
                        <small className="text-danger">{errors.name}</small>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label col-md-2">
                      Upload PDF <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-4">
                      <input
                        id="pdf"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className={`form-control form-control-md ${
                          errors.pdf ? "is-invalid" : ""
                        }`}
                      />
                      {errors.pdf && (
                        <small className="text-danger">{errors.pdf}</small>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-2">
                      <input
                        type="submit"
                        className="btn btn-primary btn-sm"
                        value="Submit"
                      />
                    </div>
                  </div>
                </form>
                <div className="table-responsive">
                  <table className="table table-bordered m-b-0">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Department Name</th>
                        <th>Uploaded PDF</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDepartments.map((dept, index) => (
                        <tr key={dept.id}>
                          <td>{indexOfFirstDepartment + index + 1}</td>
                          <td>{dept.name}</td>
                          <td>
                            <Link
                              to={`${baseURL}/${dept.pdf}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFilePdf size={35} color="red" />
                            </Link>
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm m-t-10"
                              onClick={() => handleOpenEditModal(dept)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm m-t-10"
                              onClick={() => handleOpenDeleteModal(dept.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
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
                      <Link
                        className="page-link"
                        to="#"
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                      >
                        Previous
                      </Link>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            to="#"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Link>
                        </li>
                      )
                    )}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <Link
                        className="page-link"
                        to="#"
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                      >
                        Next
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Department</h5>
              </div>
              <form onSubmit={handleEditDepartment}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>
                      Department Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) =>
                        setNewDepartment({
                          ...newDepartment,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Upload New PDF (Optional)</label>
                    <input
                      id="edit-pdf"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h5>Are you sure you want to delete this department?</h5>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteDepartment}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CitizenCharter;
