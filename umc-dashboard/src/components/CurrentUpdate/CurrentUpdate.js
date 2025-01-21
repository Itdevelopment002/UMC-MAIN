import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

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
      await api.delete(`/current-update/${selectedUpdates}`);
      setUpdates(updates.filter((item) => item.id !== selectedUpdates));
      setModalType(null);
      setSelectedUpdates(null);
    } catch (error) {
      console.error("Error deleting updates:", error);
    }
  };

  const handleEditClick = (updatesItem) => {
    setSelectedUpdates(updatesItem.id);
    setEditedData(updatesItem);
    setModalType("edit");
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/current-update/${selectedUpdates}`, editedData);
      setUpdates(
        updates.map((item) =>
          item.id === selectedUpdates ? { ...item, ...editedData } : item
        )
      );
      setModalType(null);
      setSelectedUpdates(null);
      setEditedData({});
    } catch (error) {
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
                <Link to="/home">Home</Link>
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
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Current Update</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
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
                          <th width="10%">Sr. No.</th>
                          <th>Description</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((item, index) => (
                            <tr key={item.id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{item.description}</td>
                              <td>
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
              </div>
            </div>
          </div>

          <div>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
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
    </>
  );
};

export default CurrentUpdate;
