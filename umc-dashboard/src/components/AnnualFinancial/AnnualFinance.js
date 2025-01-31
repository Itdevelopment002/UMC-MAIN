import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      setAnnual(response.data.reverse());
    } catch (error) {
      console.error("Error fetching Annual:", error);
      toast.error("Failed to fetch Annual data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/annual-finance/${selectedAnnual.id}`);
      setAnnual(annual.filter((w) => w.id !== selectedAnnual.id));
      setShowDeleteModal(false);
      toast.success("Annual deleted successfully!");
    } catch (error) {
      console.error("Error deleting Annual:", error);
      toast.error("Failed to delete the Annual!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/annual-finance/${selectedAnnual.id}`, {
        heading: selectedAnnual.heading,
        link: selectedAnnual.link,
      });
      const updatedAnnual = annual.map((annual) =>
        annual.id === selectedAnnual.id ? selectedAnnual : annual
      );
      setAnnual(updatedAnnual);
      setShowEditModal(false);
      toast.success("annual updated successfully!");
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
                        to="/add-annual"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Annual
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Heading</th>
                          <th>Link</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentAnnual.map((annual, index) => (
                          <tr key={annual.id}>
                            <td>
                              {index + 1 + (currentPage - 1) * annualPerPage}
                            </td>
                            <td>{annual.heading}</td>
                            <td>{annual.link}</td>
                            <td>
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
              </div>
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
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
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
                className={`page-item ${
                  currentPage === Math.ceil(annual.length / annualPerPage)
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
                    <h5 className="modal-title">Edit Annual</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
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

export default Annual;
