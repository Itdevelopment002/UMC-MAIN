import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RTI = () => {
  const [rti, setRti] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRti, setSelectedRti] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rtiPerPage = 10;

  useEffect(() => {
    fetchRTI();
  }, []);

  const fetchRTI = async () => {
    try {
      const response = await api.get("/rti-info");
      setRti(response.data);
    } catch (error) {
      console.error("Error fetching rti:", error);
      toast.error("Failed to fetch rti data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/rti-info/${selectedRti.id}`);
      setRti(rti.filter((w) => w.id !== selectedRti.id));
      setShowDeleteModal(false);
      toast.success("Right to Information deleted successfully!");
    } catch (error) {
      console.error("Error deleting rti:", error);
      toast.error("Failed to delete the rti!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/rti-info/${selectedRti.id}`, {
        description: selectedRti.description,
        link: selectedRti.link,
        language_code: selectedRti.language_code,
      });
      const updatedRti = rti.map((rti) =>
        rti.id === selectedRti.id ? selectedRti : rti
      );
      setRti(updatedRti);
      setShowEditModal(false);
      toast.success("Right to Information updated successfully!");
    } catch (error) {
      console.error("Error updating rti:", error);
      toast.error("Failed to update the rti!");
    }
  };

  const handleEditClick = (rti) => {
    setSelectedRti({ ...rti });
    setShowEditModal(true);
  };

  const handleDeleteClick = (rti) => {
    setSelectedRti(rti);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedRti({ ...selectedRti, [name]: value });
  };

  const indexOfLastRti = currentPage * rtiPerPage;
  const indexOfFirstRti = indexOfLastRti - rtiPerPage;
  const currentRti = rti.slice(indexOfFirstRti, indexOfLastRti);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">RTI</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Right to Information
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Right to Information</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-rti"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add RTI
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
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRti.length > 0 ? (
                          currentRti.map((rti, index) => (
                            <tr key={rti.id}>
                              <td className="text-center">
                                {index + 1 + (currentPage - 1) * rtiPerPage}
                              </td>
                              <td>{rti.description}</td>
                              <td>
                                <Link
                                  to={rti.link === "#" || rti.link.startsWith("/") ? "#" : `${rti.link}`}
                                  target={rti.link === "#" || rti.link.startsWith("/") ? "" : "_blank"}
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {rti.link}
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleEditClick(rti)}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(rti)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">No RTI data available</td>
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
                      { length: Math.ceil(rti.length / rtiPerPage) },
                      (_, i) => i + 1
                    )
                      .filter(
                        (page) =>
                          page >= currentPage - 1 && page <= currentPage + 1 // Show current page and its neighbors
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
                    {currentPage < Math.ceil(rti.length / rtiPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(rti.length / rtiPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(rti.length / rtiPerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(rti.length / rtiPerPage) - 1)
                          }
                        >
                          {Math.ceil(rti.length / rtiPerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(rti.length / rtiPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(rti.length / rtiPerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(rti.length / rtiPerPage))
                          }
                        >
                          {Math.ceil(rti.length / rtiPerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(rti.length / rtiPerPage)
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
                    <h5 className="modal-title">Edit Right to Information</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          value={selectedRti?.language_code || ""}
                          onChange={handleEditChange}
                          name="language_code"
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={selectedRti?.description || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedRti?.link || ""}
                          onChange={handleEditChange}
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

export default RTI;
