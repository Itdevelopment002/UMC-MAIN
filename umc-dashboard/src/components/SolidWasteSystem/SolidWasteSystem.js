import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SolidWasteSystem = () => {
  const [swms, setSwms] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSwms, setSelectedSwms] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const swmsPerPage = 10;

  useEffect(() => {
    fetchSwms();
  }, []);

  const fetchSwms = async () => {
    try {
      const response = await api.get("/swms");
      setSwms(response.data);
    } catch (error) {
      console.error("Error fetching swms:", error);
      toast.error("Failed to fetch swms data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/swms/${selectedSwms.id}`);
      setSwms(swms.filter((w) => w.id !== selectedSwms.id));
      setShowDeleteModal(false);
      toast.success("Swms deleted successfully!");
    } catch (error) {
      console.error("Error deleting swms:", error);
      toast.error("Failed to delete the swms!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/swms/${selectedSwms.id}`, {
        description: selectedSwms.description,
        link: selectedSwms.link,
      });
      const updatedSwms = swms.map((swms) =>
        swms.id === selectedSwms.id ? selectedSwms : swms
      );
      setSwms(updatedSwms);
      setShowEditModal(false);
      toast.success("Swms updated successfully!");
    } catch (error) {
      console.error("Error updating swms:", error);
      toast.error("Failed to update the swms!");
    }
  };

  const handleEditClick = (swms) => {
    setSelectedSwms({ ...swms });
    setShowEditModal(true);
  };

  const handleDeleteClick = (swms) => {
    setSelectedSwms(swms);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedSwms({ ...selectedSwms, [name]: value });
  };

  const indexOfLastSwms = currentPage * swmsPerPage;
  const indexOfFirstSwms = indexOfLastSwms - swmsPerPage;
  const currentSwms = swms.slice(indexOfFirstSwms, indexOfLastSwms);

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
                Solid Waste Management System
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Solid Waste Management System</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-swms"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add SWMS
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
                        {currentSwms.length > 0 ? (
                          currentSwms.map((swms, index) => (
                            <tr key={swms.id}>
                              <td className="text-center">
                                {index + 1 + (currentPage - 1) * swmsPerPage}
                              </td>
                              <td>{swms.description}</td>
                              <td>
                                <Link
                                  to={swms.link}
                                  target="_blank"
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {swms.link}
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleEditClick(swms)}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(swms)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">No Swms data available</td>
                          </tr>
                        )}

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
                      { length: Math.ceil(swms.length / swmsPerPage) },
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
                      className={`page-item ${currentPage === Math.ceil(swms.length / swmsPerPage)
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
                    <h5 className="modal-title">Edit Solid Waste Management System</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={selectedSwms?.description || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedSwms?.link || ""}
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
                    <h5>Are you sure you want to delete this entry?</h5>
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

export default SolidWasteSystem;