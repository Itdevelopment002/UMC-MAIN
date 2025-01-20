import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const TreeCensus = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    description: "",
    total: "",
  });
  const [treeCensusData, setTreeCensusData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTreeCensusData();
  }, []);

  const fetchTreeCensusData = async () => {
    try {
      const response = await api.get("/tree-census");
      setTreeCensusData(response.data);
    } catch (error) {
      console.error("Error fetching tree census data:", error);
      toast.error("Error fetching tree census data.");
    }
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.delete(`/tree-census/${selectedRow.id}`);
      if (response.status === 200) {
        toast.success("Tree Census deleted successfully!");
        fetchTreeCensusData();
      } else {
        toast.error("Failed to delete Tree Census.");
      }
    } catch (error) {
      console.error("Error deleting tree census:", error);
      toast.error("Error deleting Tree Census.");
    } finally {
      setModalOpen(false);
    }
  };

  const handleEditModalOpen = (row) => {
    setEditData(row);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await api.put(`/tree-census/${editData.id}`, editData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Tree Census updated successfully!");
        fetchTreeCensusData();
      } else {
        toast.error("Failed to update Tree Census.");
      }
    } catch (error) {
      console.error("Error updating tree census:", error);
      toast.error("Error updating Tree Census.");
    } finally {
      setShowEditModal(false);
    }
  };

  const currentPageData = treeCensusData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/tree-census">City Profile</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Tree Census
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Tree Census</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-tree-census"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Tree Census
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Description</th>
                          <th>Total</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((row, index) => (
                            <tr key={row.id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{row.description}</td>
                              <td>{row.total}</td>
                              <td>
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditModalOpen(row)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(row)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                              No tree census available
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

          <div className="mt-1">
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
                { length: Math.ceil(treeCensusData.length / itemsPerPage) },
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
                  currentPage ===
                  Math.ceil(treeCensusData.length / itemsPerPage)
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

          {isModalOpen && (
            <div
              className="modal delete_modal fade show"
              style={{ display: "block" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary btn-lg"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger btn-lg"
                      onClick={handleDeleteConfirm}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEditModal && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Tree Census</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={editData.description}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Total</label>
                        <input
                          type="text"
                          className="form-control"
                          name="total"
                          value={editData.total}
                          onChange={handleChange}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleEditSubmit}
                    >
                      Save changes
                    </button>
                  </div>
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

export default TreeCensus;
