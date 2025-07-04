import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Tenders = () => {
  const [tender, setTender] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tenderPerPage = 10;

  useEffect(() => {
    fetchTenders();
    fetchDepartments();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await api.get("/tenders-quotations");
      const sortedTenders = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      setTender(sortedTenders);
    } catch (error) {
      console.error("Error fetching tender:", error);
      toast.error("Failed to fetch tender data!");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department-info");
      const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
      setDepartments(sortedData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/delete-tenders-quotations/${selectedTender.id}`);
      setTender(tender.filter((w) => w.id !== selectedTender.id));
      setShowDeleteModal(false);
      toast.success("Tender and Quotation deleted successfully!");
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error("Failed to delete the tender!");
    }
  };

  const handleEditSave = async () => {
    const formattedIssueDate = selectedTender.issue_date
      ? formatDate(selectedTender.issue_date)
      : "";
    try {
      await api.post(`/edit-tenders-quotations/${selectedTender.id}`, {
        heading: selectedTender.heading,
        department: selectedTender.department,
        link: selectedTender.link,
        issue_date: formattedIssueDate,
        language_code: selectedTender.language_code,
      });
      fetchTenders();
      setShowEditModal(false);
      toast.success("Tender and Quotation updated successfully!");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        Array.isArray(error.response.data.errors)
      ) {
        error.response.data.errors.forEach((err) => {
          const message = typeof err === "string" ? err : err.message || "Validation error";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update tender data. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error updating tender data:", error);
    }
  };

  const handleEditClick = (tender) => {
    setSelectedTender({ ...tender });
    setShowEditModal(true);
  };

  const handleDeleteClick = (tender) => {
    setSelectedTender(tender);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedTender({ ...selectedTender, [name]: value });
  };

  const indexOfLastTender = currentPage * tenderPerPage;
  const indexOfFirstTender = indexOfLastTender - tenderPerPage;
  const currentTender = tender.slice(indexOfFirstTender, indexOfLastTender);

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
                <Link to="#">Citizen Services</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Tenders and Quotations
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Tenders and Quotations</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-tenders-quotations"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Tenders
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Issue Date</th>
                          <th>Tender Heading</th>
                          <th width="25%">Department Name</th>
                          <th>Tender Link</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTender.length > 0 ? (
                          currentTender.map((tender, index) => (
                            <tr key={tender.id}>
                              <td className="text-center">
                                {new Date(tender.issue_date)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(/\//g, "-")}
                              </td>
                              <td>{tender.heading}</td>
                              <td>{tender.department}</td>
                              <td>
                                <Link
                                  to={tender.link !== "#" ? `${tender.link}` : "#"}
                                  target={tender.link !== "#" ? "_blank" : ""}
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {tender.link}
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleEditClick(tender)}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(tender)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center">No Tender data available</td>
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
                      { length: Math.ceil(tender.length / tenderPerPage) },
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
                    {currentPage < Math.ceil(tender.length / tenderPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(tender.length / tenderPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(tender.length / tenderPerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(tender.length / tenderPerPage) - 1)
                          }
                        >
                          {Math.ceil(tender.length / tenderPerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(tender.length / tenderPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(tender.length / tenderPerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(tender.length / tenderPerPage))
                          }
                        >
                          {Math.ceil(tender.length / tenderPerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(tender.length / tenderPerPage)
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
                    <h5 className="modal-title">Edit Tenders and Quotations</h5>
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
                          value={selectedTender?.language_code || ""}
                          onChange={handleEditChange}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Tender Heading</label>
                        <input
                          type="text"
                          className="form-control"
                          name="heading"
                          value={selectedTender?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Department Name</label>
                        <select
                          className="form-control"
                          name="department"
                          value={selectedTender?.department || ""}
                          onChange={handleEditChange}
                        >
                          <option value="" disabled>
                            Select Department Name
                          </option>
                          {departments.map((department) => (
                            <option value={department.heading} key={department.id}>
                              {department.heading}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Tender Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedTender?.link || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Issue Date</label>
                        <Flatpickr
                          value={selectedTender?.issue_date || ""}
                          onChange={(date) =>
                            setSelectedTender({
                              ...selectedTender,
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

export default Tenders;
