import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Annual = () => {
  const [annual, setAnnual] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnual, setSelectedAnnual] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const annualPerPage = 10;

  useEffect(() => {
    fetchAnnual();
  }, []);

  const fetchAnnual = async () => {
    try {
      const response = await api.get("/annual-finance");
      const sortedData = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      setAnnual(sortedData);
    } catch (error) {
      console.error("Error fetching Annual Financial Statement:", error);
      toast.error("Failed to fetch Annual Financial Statement data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/delete-annual-finance/${selectedAnnual.id}`);
      setAnnual(annual.filter((w) => w.id !== selectedAnnual.id));
      setShowDeleteModal(false);
      toast.success("Annual Financial Statement deleted successfully!");
    } catch (error) {
      console.error("Error deleting Annual:", error);
      toast.error("Failed to delete the Annual!");
    }
  };

  const handleEditSave = async () => {
    const formattedIssueDate = selectedAnnual.issue_date
      ? formatDate(selectedAnnual.issue_date)
      : "";
    try {
      await api.post(`/edit-annual-finance/${selectedAnnual.id}`, {
        heading: selectedAnnual.heading,
        link: selectedAnnual.link,
        issue_date: formattedIssueDate,
        language_code: selectedAnnual.language_code,

      });
      fetchAnnual();
      setShowEditModal(false);
      toast.success("Annual Financial Statement updated successfully!");
    } catch (error) {
      console.error("Error updating annual:", error);
      toast.error("Failed to update the annual!");
    }
  };

  const handleEditClick = (annual) => {
    setSelectedAnnual({ ...annual });
    setShowEditModal(true);
  };

  const handleDeleteClick = (annual) => {
    setSelectedAnnual(annual);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedAnnual({ ...selectedAnnual, [name]: value });
  };

  const indexOfLastAnnual = currentPage * annualPerPage;
  const indexOfFirstAnnual = indexOfLastAnnual - annualPerPage;
  const currentAnnual = annual.slice(indexOfFirstAnnual, indexOfLastAnnual);

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
                <Link to="#">Corporation</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Annual Financial Statement
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Annual Financial Statement</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-annual-financial-statement"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Statement
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Heading</th>
                          <th>Link</th>
                          <th width="20%" className="text-center">Issue Date</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentAnnual.map((annual, index) => (
                          <tr key={annual.id}>
                            <td className="text-center">
                              {index + 1 + (currentPage - 1) * annualPerPage}
                            </td>
                            <td>{annual.heading}</td>
                            <td>
                              <Link
                                to={annual.link !== "#" ? `${annual.link}` : "#"}
                                target={annual.link !== "#" ? "_blank" : ""}
                                className="text-decoration-none"
                                style={{ color: "#000" }}
                              >
                                {annual.link}
                              </Link>
                            </td>
                            <td className="text-center">
                              {new Date(annual.issue_date)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                                .replace(/\//g, "-")}
                            </td>
                            <td className="text-center">
                              <button
                                onClick={() => handleEditClick(annual)}
                                className="btn btn-success btn-sm m-t-10"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteClick(annual)}
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
                <div className="mt-4">
                  <ul className="pagination">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from(
                      { length: Math.ceil(annual.length / annualPerPage) },
                      (_, i) => (
                        <li
                          className={`page-item ${currentPage === i + 1 ? "active" : ""
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
                      className={`page-item ${currentPage === Math.ceil(annual.length / annualPerPage)
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
                    <h5 className="modal-title">Edit Annual Financial Statement</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          value={selectedAnnual?.language_code || ""}
                          onChange={handleEditChange}
                          name="language_code"
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        <label className="form-label">Heading</label>
                        <input
                          type="text"
                          className="form-control"
                          name="heading"
                          value={selectedAnnual?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedAnnual?.link || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Issue Date</label>
                        <Flatpickr
                          value={selectedAnnual?.issue_date || ""}
                          onChange={(date) =>
                            setSelectedAnnual({
                              ...selectedAnnual,
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

export default Annual;
