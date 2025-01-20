import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const PropertyHolder = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    description: "",
    property: "",
  });
  const [propertyHolders, setPropertyHolders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPropertyHolders = async () => {
      try {
        const response = await api.get("/property_holder");
        setPropertyHolders(response.data);
      } catch (error) {
        console.error("Error fetching property holders:", error);
      }
    };
    fetchPropertyHolders();
  }, []);

  const handleDeleteModalOpen = (itemId) => {
    setSelectedItem(itemId);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = (item) => {
    setEditData(item);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/property_holder/${selectedItem}`);
      setPropertyHolders(
        propertyHolders.filter((holder) => holder.id !== selectedItem)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting property holder:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/property_holder/${editData.id}`, editData);
      setPropertyHolders(
        propertyHolders.map((holder) =>
          holder.id === editData.id
            ? {
                ...holder,
                description: editData.description,
                property: editData.property,
              }
            : holder
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating property holder:", error);
    }
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);

  const currentPageData = propertyHolders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/property-holder">City Profile</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Property Holder
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Property Holder</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-property-holder"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Property Holder
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Description</th>
                          <th>Property</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((holder, index) => (
                            <tr key={holder.id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{holder.description}</td>
                              <td>{holder.property}</td>
                              <td>
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditModalOpen(holder)}
                                  style={{ marginLeft: "5px" }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() =>
                                    handleDeleteModalOpen(holder.id)
                                  }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                              No property holder available
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

          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {[
              ...Array(Math.ceil(propertyHolders.length / itemsPerPage)).keys(),
            ].map((page) => (
              <li
                key={page + 1}
                className={`page-item ${
                  currentPage === page + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === Math.ceil(propertyHolders.length / itemsPerPage)
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

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="modal fade show d-block" role="dialog">
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this item?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseDeleteModal}
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

          {/* Edit Modal */}
          {showEditModal && (
            <div className="modal fade show d-block" role="dialog">
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Property Holder</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Property</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.property}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              property: e.target.value,
                            })
                          }
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseEditModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleEditSubmit}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyHolder;
