import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wards = () => {
  const [wards, setWards] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const wardsPerPage = 10;

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const response = await api.get("/wards");
      setWards(response.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
      toast.error("Failed to fetch wards data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/wards/${selectedWard.id}`);
      setWards(wards.filter((w) => w.id !== selectedWard.id));
      setShowDeleteModal(false);
      toast.success("Ward deleted successfully!");
    } catch (error) {
      console.error("Error deleting ward:", error);
      toast.error("Failed to delete the ward!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/wards/${selectedWard.id}`, {
        ward_no: selectedWard.ward_no,
        ward_name: selectedWard.ward_name,
      });
      const updatedWards = wards.map((ward) =>
        ward.id === selectedWard.id ? selectedWard : ward
      );
      setWards(updatedWards);
      setShowEditModal(false);
      toast.success("Ward updated successfully!");
    } catch (error) {
      console.error("Error updating ward:", error);
      toast.error("Failed to update the ward!");
    }
  };

  const handleEditClick = (ward) => {
    setSelectedWard({ ...ward });
    setShowEditModal(true);
  };

  const handleDeleteClick = (ward) => {
    setSelectedWard(ward);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedWard({ ...selectedWard, [name]: value });
  };

  const indexOfLastWard = currentPage * wardsPerPage;
  const indexOfFirstWard = indexOfLastWard - wardsPerPage;
  const currentWards = wards.slice(indexOfFirstWard, indexOfLastWard);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#.">About KBMC</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Wards
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Wards</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-wards"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Ward
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Ward No.</th>
                          <th>Ward Name</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentWards.map((ward, index) => (
                          <tr key={ward.id}>
                            <td>
                              {index + 1 + (currentPage - 1) * wardsPerPage}
                            </td>
                            <td>{ward.ward_no}</td>
                            <td>{ward.ward_name}</td>
                            <td>
                              <button
                                onClick={() => handleEditClick(ward)}
                                className="btn btn-success btn-sm m-t-10"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteClick(ward)}
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
                { length: Math.ceil(wards.length / wardsPerPage) },
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
                  currentPage === Math.ceil(wards.length / wardsPerPage)
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
                    <h5 className="modal-title">Edit Ward</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Ward No.</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ward_no"
                          value={selectedWard?.ward_no || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Ward Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ward_name"
                          value={selectedWard?.ward_name || ""}
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

export default Wards;
