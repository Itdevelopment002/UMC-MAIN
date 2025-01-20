import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const MuncipalProperties = () => {
  const [properties, setProperties] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    propertyType: "",
    address: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProperties = async () => {
    try {
      const response = await api.get("/muncipal");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await api.delete(`/muncipal/${deleteId}`);
        setProperties(
          properties.filter((property) => property.id !== deleteId)
        );
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  const handleEdit = (property) => {
    setEditData(property);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({ id: "", name: "", propertyType: "", address: "" });
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/muncipal/${editData.id}`, editData);
      setProperties(
        properties.map((property) =>
          property.id === editData.id ? { ...property, ...editData } : property
        )
      );
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const currentPageData = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/muncipal-properties">City Profile</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Muncipal Properties
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-lg-12">
            <div className="card-box">
              <div className="card-block">
                <div className="row">
                  <div className="col-sm-4 col-3">
                    <h4 className="page-title">Muncipal Properties</h4>
                  </div>
                  <div className="col-sm-8 col-9 text-right m-b-20">
                    <Link
                      to="/add-muncipal-properties"
                      className="btn btn-primary btn-rounded float-right"
                    >
                      <i className="fa fa-plus"></i> Add Property
                    </Link>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered m-b-0">
                    <thead>
                      <tr>
                        <th width="10%">Sr. No.</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Address</th>
                        <th width="15%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageData.length > 0 ? (
                        currentPageData.map((property, index) => (
                          <tr key={property.id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>{property.name}</td>
                            <td>{property.propertyType}</td>
                            <td>{property.address}</td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => handleEdit(property)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => {
                                  setDeleteId(property.id);
                                  setShowDeleteModal(true);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            No Municipal properties data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="pagination-wrapper mt-3">
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages).keys()].map((number) => (
                      <li
                        key={number + 1}
                        className={`page-item ${
                          currentPage === number + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(number + 1)}
                        >
                          {number + 1}
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
              </div>
            </div>
          </div>
        </div>

        {showEditModal && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Property</h5>
                </div>
                <div className="modal-body">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <label>
                    Shops / Sabhagruha / Community Hall / Gymnasium / Library
                  </label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Property Type"
                    value={editData.propertyType}
                    onChange={(e) =>
                      setEditData({ ...editData, propertyType: e.target.value })
                    }
                  />
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    value={editData.address}
                    onChange={(e) =>
                      setEditData({ ...editData, address: e.target.value })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={handleCloseEditModal}
                  >
                    Cancel
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

        {showDeleteModal && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <h5>Are you sure you want to delete this item?</h5>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
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
  );
};

export default MuncipalProperties;
