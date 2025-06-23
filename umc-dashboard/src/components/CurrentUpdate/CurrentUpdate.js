import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CurrentUpdate = () => {
  const [updates, setUpdates] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedUpdates, setSelectedUpdates] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUpdates = async () => {
    try {
      const response = await api.get("/current-update");
      setUpdates(response.data);
    } catch (error) {
      console.error("Error fetching updates:", error);
      toast.error("Failed to fetch updates!");
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleDeleteClick = (updatesId) => {
    setSelectedUpdates(updatesId);
    setModalType("delete");
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.post(`/delete-current-update/${selectedUpdates}`);
      setUpdates(updates.filter((item) => item.id !== selectedUpdates));
      setModalType(null);
      setSelectedUpdates(null);
      toast.success("Current Update deleted successfully!");
    } catch (error) {
      console.error("Error deleting updates:", error);
      toast.error("Failed to delete the updates!");
    }
  };

  const handleEditClick = (updatesItem) => {
    setSelectedUpdates(updatesItem.id);
    setEditedData(updatesItem);
    setModalType("edit");
  };

  const handleSaveEdit = async () => {
    try {
      await api.post(`/edit-current-update/${selectedUpdates}`, editedData);
      setUpdates(
        updates.map((item) =>
          item.id === selectedUpdates ? { ...item, ...editedData } : item
        )
      );
      setModalType(null);
      setSelectedUpdates(null);
      setEditedData({});
      toast.success("Current Update updated successfully")
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.errors
      ) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error("Failed to update current update:. Try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Error updating current update:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const totalPages = Math.ceil(updates.length / itemsPerPage);
  const currentPageData = updates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
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
                Current Update
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-4">
                      <h4 className="page-title">Current Update</h4>
                    </div>
                    <div className="col-sm-8 col-8 text-right m-b-20">
                      <Link
                        to="/add-current-update"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Current Update
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Description</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{item.description}</td>
                              <td className="text-center">
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditClick(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10 "
                                  onClick={() => handleDeleteClick(item.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                              No current update available
                            </td>
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
          </div>

          {modalType && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  {modalType === "delete" ? (
                    <>
                      <div className="modal-body text-center">
                        <h5>Are you sure you want to delete this item?</h5>
                      </div>
                      <div className="modal-footer text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => setModalType(null)}
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
                    </>
                  ) : (
                    <>
                      <div className="modal-header">
                        <h4>Edit Current Update</h4>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">
                            Select Language
                          </label>

                          <select
                            className="form-control"
                            value={editedData?.language_code || ""}
                            onChange={handleInputChange}
                            name="language_code"
                          >
                            <option value="" disabled>Select Language</option>
                            <option value="en">English</option>
                            <option value="mr">Marathi</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label>Description</label>
                          <textarea
                            name="description"
                            value={editedData.description || ""}
                            onChange={handleInputChange}
                            className="form-control"
                            rows="3"
                            placeholder="Description"
                          ></textarea>
                        </div>
                      </div>
                      <div className="modal-footer text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => setModalType(null)}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={handleSaveEdit}
                        >
                          Save Changes
                        </button>
                      </div>
                    </>
                  )}
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

export default CurrentUpdate;
