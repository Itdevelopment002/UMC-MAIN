import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURL } from "../api";

const FireStation = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [fireStations, setFireStations] = useState([]);
  const [editData, setEditData] = useState({
    heading: "",
    address: "",
    phoneNo: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = fireStations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => {
      lightbox.destroy();
    };
  }, [fireStations]);

  const fetchFireStations = () => {
    api
      .get("/fire-stations")
      .then((response) => setFireStations(response.data))
      .catch((error) => {
        console.error("Error fetching fire stations!", error);
        toast.error("Failed to load fire stations.");
      });
  };

  useEffect(() => {
    fetchFireStations();
  }, []);

  const handleDeleteModalOpen = (station) => {
    setSelectedStation(station);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = (station) => {
    setEditData(station);
    setImagePreview(`${baseURL}${station.image_path}`);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    api
      .delete(`/fire-stations/${selectedStation.id}`)
      .then(() => {
        setFireStations(
          fireStations.filter((station) => station.id !== selectedStation.id)
        );
        setShowDeleteModal(false);
        setSelectedStation(null);
        toast.success("Fire station deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting fire station!", error);
        toast.error("Failed to delete fire station.");
      });
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("heading", editData.heading);
    formData.append("address", editData.address);
    formData.append("phoneNo", editData.phoneNo);
    if (editData.image) {
      formData.append("image", editData.image);
    }

    try {
      await api.put(`/fire-stations/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchFireStations();
      setShowEditModal(false);
      toast.success("Fire station updated successfully!");
    } catch (error) {
      console.error("Error updating fire station!", error);
      toast.error("Failed to update fire station.");
    }
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({ heading: "", address: "", phoneNo: "", image: null });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //eslint-disable-next-line
  const currentStations = fireStations.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/fire-station">City Profile</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Fire Station
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Fire Station</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-fire-station"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Fire Station
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Heading</th>
                          <th>Address</th>
                          <th>Phone No.</th>
                          <th>Image</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fireStations.map((station, index) => (
                          <tr key={station.id}>
                            <td>{index + 1}</td>
                            <td>{station.heading}</td>
                            <td>{station.address}</td>
                            <td>{station.phoneNo}</td>
                            <td>
                              <Link
                                to={`${baseURL}${station.image_path}`}
                                className="glightbox"
                                data-gallery="slider-images"
                              >
                                <img
                                  width="50px"
                                  src={`${baseURL}${station.image_path}`}
                                  alt={`fire-station-img${station.image_path}`}
                                />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleEditModalOpen(station)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteModalOpen(station)}
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

          <ul className="pagination  mt-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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

          <ToastContainer />

          {showDeleteModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
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

          {showEditModal && (
            <div className="modal fade show d-block" 
            style={{
              overflowY: "auto",
              maxHeight: "100vh",
              scrollbarWidth: "none",
            }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Fire Station</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Heading</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.heading}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              heading: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.address}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone No.</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.phoneNo}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              phoneNo: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Image</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="preview"
                            width="100"
                            className="mt-2"
                          />
                        )}
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
                      Save changes
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

export default FireStation;
