import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScreenReader = () => {
  const [readerData, setReaderData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReader, setSelectedReader] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchReader();
  }, []);

  const fetchReader = async () => {
    try {
      const response = await api.get("/screen-reader");
      setReaderData(response.data);
    } catch (error) {
      toast.error("Failed to fetch screen reader data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/delete-screen-reader/${selectedReader.id}`);
      setReaderData((prevData) =>
        prevData.filter((reader) => reader.id !== selectedReader.id)
      );
      setShowDeleteModal(false);
      toast.success("Screen Reader Access deleted successfully!");
    } catch (error) {
      console.error("Error deleting screen reader data:", error);
      toast.error("Failed to delete the screen reader data!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.post(`/edit-screen-reader/${selectedReader.id}`, {
        name: selectedReader.name,
        website: selectedReader.website,
        available: selectedReader.available,
        language_code: selectedReader.language_code,
      });

      const updatedReader = readerData.map((reader) =>
        reader.id === selectedReader.id ? selectedReader : reader
      );
      setReaderData(updatedReader);
      setShowEditModal(false);
      toast.success("Screen Reader Access updated successfully!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessages = error.response.data.errors ||
          (error.response.data.message ? [error.response.data] : []);

        errorMessages.forEach((err) => {
          toast.error(err.message || err, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error("Failed to update screen reader. Try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Error updating screen reader data:", error);
    }
  };

  const handleEditClick = (reader) => {
    setSelectedReader({ ...reader });
    setShowEditModal(true);
  };

  const handleDeleteClick = (reader) => {
    setSelectedReader(reader);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedReader({ ...selectedReader, [name]: value });
  };

  const currentPageData = readerData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(readerData.length / itemsPerPage);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Screen Reader Access
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="page-title">Screen Reader Access</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link
                        to="/add-screen-reader-access"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Reader
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Reader Name</th>
                          <th>Reader Website</th>
                          <th className="text-center">Reader Availability</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((reader, index) => (
                            <tr key={reader.id}>
                              <td className="text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{reader.name}</td>
                              <td>
                                <Link
                                  to={reader.website !== "#" ? `${reader.website}` : "#"}
                                  target={reader.website !== "#" ? "_blank" : ""}
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {reader.website}
                                </Link>
                              </td>
                              <td className="text-center">{reader.available}</td>
                              <td className="text-center">
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditClick(reader)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(reader)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No Screen Reader Access Data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {currentPage > 2 && (
                      <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(1)}>
                          1
                        </button>
                      </li>
                    )}
                    {currentPage > 3 && (
                      <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(2)}>
                          2
                        </button>
                      </li>
                    )}
                    {currentPage > 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page >= currentPage - 1 && page <= currentPage + 1
                      )
                      .map((page) => (
                        <li
                          className={`page-item ${currentPage === page ? "active" : ""}`}
                          key={page}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                    {currentPage < totalPages - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < totalPages - 2 && (
                      <li
                        className={`page-item ${currentPage === totalPages - 1 ? "active" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(totalPages - 1)}
                        >
                          {totalPages - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < totalPages - 1 && (
                      <li
                        className={`page-item ${currentPage === totalPages ? "active" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
                    <h5 className="modal-title">Edit Screen Reader Access</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control form-control-md"
                          name="language_code"
                          value={selectedReader?.language_code || ""}
                          onChange={handleEditChange}
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Reader Name</label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          name="name"
                          value={selectedReader?.name || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Reader Website</label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          name="website"
                          value={selectedReader?.website || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Reader Availability</label>
                        <select
                          className="form-control form-control-md"
                          name="available"
                          value={selectedReader?.available || ""}
                          onChange={handleEditChange}
                        >
                          <option value="" disabled>Select Availability</option>
                          <option value="Free">Free</option>
                          <option value="मुफ़्त">मुफ़्त</option>
                          <option value="Commercial">Commercial</option>
                          <option value="व्यावसायिक">व्यावसायिक</option>
                        </select>
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
                    <h5>Are you sure you want to delete this item?</h5>
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

export default ScreenReader;
