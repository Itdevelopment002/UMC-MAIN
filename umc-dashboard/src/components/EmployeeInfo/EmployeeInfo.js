import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const EmployeeInfo = () => {
  const [emp, setEmp] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const empPerPage = 10;

  useEffect(() => {
    fetchEmp();
  }, []);

  const fetchEmp = async () => {
    try {
      const response = await api.get("/emp-info");
      const sortedData = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      setEmp(sortedData);
    } catch (error) {
      console.error("Error fetching emp info:", error);
      toast.error("Failed to fetch emp info data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/emp-info/${selectedEmp.id}`);
      setEmp(emp.filter((w) => w.id !== selectedEmp.id));
      setShowDeleteModal(false);
      toast.success("Employee Information deleted successfully!");
    } catch (error) {
      console.error("Error deleting emp info:", error);
      toast.error("Failed to delete the emp info!");
    }
  };

  const handleEditSave = async () => {
    const formattedIssueDate = selectedEmp.issue_date
      ? formatDate(selectedEmp.issue_date)
      : "";
    try {
      await api.put(`/emp-info/${selectedEmp.id}`, {
        description: selectedEmp.description,
        link: selectedEmp.link,
        issue_date: formattedIssueDate,
        language_code: selectedEmp.language_code,
      });
      fetchEmp();
      setShowEditModal(false);
      toast.success("Employee Information updated successfully!");
    } catch (error) {
      console.error("Error updating emp info:", error);
      toast.error("Failed to update the emp info!");
    }
  };

  const handleEditClick = (emp) => {
    setSelectedEmp({ ...emp });
    setShowEditModal(true);
  };

  const handleDeleteClick = (emp) => {
    setSelectedEmp(emp);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmp({ ...selectedEmp, [name]: value });
  };

  const indexOfLastEmp = currentPage * empPerPage;
  const indexOfFirstEmp = indexOfLastEmp - empPerPage;
  const currentEmp = emp.slice(indexOfFirstEmp, indexOfLastEmp);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
                Employee Information
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Employee Information</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-emp-info"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Information
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Description</th>
                          <th>Link</th>
                          <th width="20%" className="text-center">Issue Date</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEmp.length > 0 ? (
                          currentEmp.map((emp, index) => (
                            <tr key={emp.id}>
                              <td className="text-center">
                                {index + 1 + (currentPage - 1) * empPerPage}
                              </td>
                              <td>{emp.description}</td>
                              <td>
                                <Link
                                  to={emp.link !== "#" ? `${emp.link}` : "#"}
                                  target={emp.link !== "#" ? "_blank" : ""}
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {emp.link}
                                </Link>
                              </td>
                              <td className="text-center">
                                {new Date(emp.issue_date)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(/\//g, "-")}
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleEditClick(emp)}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(emp)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center">No Employee Information available</td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {currentPage > 2 && (
                      <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(1)}>
                          1
                        </button>
                      </li>
                    )}
                    {currentPage > 3 && (
                      <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(2)}>
                          2
                        </button>
                      </li>
                    )}
                    {currentPage > 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {Array.from(
                      { length: Math.ceil(emp.length / empPerPage) },
                      (_, i) => i + 1
                    )
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
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                    {currentPage < Math.ceil(emp.length / empPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(emp.length / empPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(emp.length / empPerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(emp.length / empPerPage) - 1)
                          }
                        >
                          {Math.ceil(emp.length / empPerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(emp.length / empPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(emp.length / empPerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(emp.length / empPerPage))
                          }
                        >
                          {Math.ceil(emp.length / empPerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(emp.length / empPerPage)
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

          {showEditModal && (
            <div
              className="modal fade show"
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Employee Information</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          name="language_code"
                          value={selectedEmp?.language_code || ""}
                          onChange={handleEditChange}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Emp Info Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={selectedEmp?.description || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Emp Info Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedEmp?.link || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Issue Date</label>
                        <Flatpickr
                          value={selectedEmp?.issue_date || ""}
                          onChange={(date) =>
                            setSelectedEmp({
                              ...selectedEmp,
                              issue_date: date[0],
                            })
                          }
                          className="form-control"
                          options={{ dateFormat: "d-m-Y" }}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
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
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this item?</h5>
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
                      onClick={handleDelete}
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
      <ToastContainer />
    </div>
  );
};

export default EmployeeInfo;
