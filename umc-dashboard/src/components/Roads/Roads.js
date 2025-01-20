import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Roads = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    description: "",
    length: "",
  });
  const [roads, setRoads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roadsPerPage] = useState(5);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchRoads();
  }, []);

  const fetchRoads = async () => {
    try {
      const response = await api.get("/roads");
      setRoads(response.data);
    } catch (error) {
      console.error("Error fetching roads data:", error);
    }
  };

  const handleDeleteModalOpen = (id) => {
    setSelectedItem(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/roads/${selectedItem}`);
      setRoads(roads.filter((item) => item.id !== selectedItem));
    } catch (error) {
      console.error("Error deleting road:", error);
    } finally {
      setDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleEditModalOpen = (item) => {
    setEditData(item);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/roads/${editData.id}`, editData);
      setRoads(
        roads.map((item) => (item.id === editData.id ? editData : item))
      );
    } catch (error) {
      console.error("Error updating road:", error);
    } finally {
      setEditModalOpen(false);
    }
  };

  const indexOfLastRoad = currentPage * roadsPerPage;
  const indexOfFirstRoad = indexOfLastRoad - roadsPerPage;
  const currentRoads = roads.slice(indexOfFirstRoad, indexOfLastRoad);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-wrapper">
      <div className="content">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">City Profile</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Roads
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-lg-12">
            <div className="card-box">
              <div className="card-block">
                <div className="row">
                  <div className="col-sm-4 col-3">
                    <h4 className="page-title">Roads</h4>
                  </div>
                  <div className="col-sm-8 col-9 text-right m-b-20">
                    <Link
                      to="/add-roads"
                      className="btn btn-primary btn-rounded float-right"
                    >
                      <i className="fa fa-plus"></i> Add Roads
                    </Link>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered m-b-0">
                    <thead>
                      <tr>
                        <th width="10%">Sr. No.</th>
                        <th>Description</th>
                        <th>Length</th>
                        <th width="15%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRoads.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1 + indexOfFirstRoad}</td>
                          <td>{item.description}</td>
                          <td>{item.length}</td>
                          <td>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleEditModalOpen(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteModalOpen(item.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pagination-container mt-3">
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {[
                      ...Array(Math.ceil(roads.length / roadsPerPage)).keys(),
                    ].map((number) => (
                      <li
                        key={number + 1}
                        className={`page-item ${
                          currentPage === number + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(number + 1)}
                        >
                          {number + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === Math.ceil(roads.length / roadsPerPage)
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
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

        {isDeleteModalOpen && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            role="dialog"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteModalLabel">
                    Are you sure you want to delete this item?
                  </h5>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setDeleteModalOpen(false)}
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

        {isEditModalOpen && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            role="dialog"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editModalLabel">
                    Edit Road
                  </h5>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditSubmit}>
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
                      <label>Length</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.length}
                        onChange={(e) =>
                          setEditData({ ...editData, length: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group text-right">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary "
                        onClick={() => setEditModalOpen(false)}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary ml-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roads;
