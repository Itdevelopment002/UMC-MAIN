import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RightToService = () => {
  const [rts, setRts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRts, setSelectedRts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rtsPerPage = 10;

  useEffect(() => {
    fetchRts();
  }, []);

  const fetchRts = async () => {
    try {
      const response = await api.get("/rts");
      setRts(response.data);
    } catch (error) {
      console.error("Error fetching rts:", error);
      toast.error("Failed to fetch rts data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/rts/${selectedRts.id}`);
      setRts(rts.filter((w) => w.id !== selectedRts.id));
      setShowDeleteModal(false);
      toast.success("Rts deleted successfully!");
    } catch (error) {
      console.error("Error deleting rts:", error);
      toast.error("Failed to delete the rts!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/rts/${selectedRts.id}`, {
        heading: selectedRts.heading,
        link: selectedRts.link,
      });
      const updatedRts = rts.map((rts) =>
        rts.id === selectedRts.id ? selectedRts : rts
      );
      setRts(updatedRts);
      setShowEditModal(false);
      toast.success("Rts updated successfully!");
    } catch (error) {
      console.error("Error updating rts:", error);
      toast.error("Failed to update the rts!");
    }
  };

  const handleEditClick = (rts) => {
    setSelectedRts({ ...rts });
    setShowEditModal(true);
  };

  const handleDeleteClick = (rts) => {
    setSelectedRts(rts);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedRts({ ...selectedRts, [name]: value });
  };

  const indexOfLastRts = currentPage * rtsPerPage;
  const indexOfFirstRts = indexOfLastRts - rtsPerPage;
  const currentRts = rts.slice(indexOfFirstRts, indexOfLastRts);

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
                Right To Service
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Right To Service</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-rts"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add RTS
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
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRts.length > 0 ? (
                          currentRts.map((rts, index) => (
                            <tr key={rts.id}>
                              <td className="text-center">
                                {index + 1 + (currentPage - 1) * rtsPerPage}
                              </td>
                              <td>{rts.heading}</td>
                              <td>
                                <Link to={rts.link} target="_blank" className="text-decoration-none" style={{ color: "#000" }}>
                                  {rts.link}
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleEditClick(rts)}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(rts)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">No Rts data available</td>
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
                      { length: Math.ceil(rts.length / rtsPerPage) },
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
                      className={`page-item ${currentPage === Math.ceil(rts.length / rtsPerPage)
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
                    <h5 className="modal-title">Edit Right To Service</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Heading</label>
                        <input
                          type="text"
                          className="form-control"
                          name="heading"
                          value={selectedRts?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedRts?.link || ""}
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

export default RightToService;
