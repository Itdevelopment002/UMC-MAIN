import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Circulars = () => {
  const [circular, setCircular] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCircular();
  }, []);

  const fetchCircular = async () => {
    try {
      const response = await api.get("/circular-info");
      setCircular(response.data.reverse());
    } catch (error) {
      console.error("Error fetching circular:", error);
      toast.error("Error fetching circular");
    }
  };

  const handleDelete = (circular) => {
    setSelectedCircular(circular);
    setShowDeleteModal(true);
  };

  const handleEdit = (circular) => {
    setSelectedCircular(circular);
    setShowEditModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCircular(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCircular(null);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      const { description, number, link, language_code } = selectedCircular;

      const formattedPublishDate = selectedCircular.publish_date
        ? formatDate(selectedCircular.publish_date)
        : "";

      await api.put(`/circular-info/${selectedCircular.id}`, {
        description,
        number,
        publish_date: formattedPublishDate,
        language_code,
        link
      });
      toast.success("Circular updated successfully");
      fetchCircular();
    } catch (error) {
      console.error("Error updating circular:", error);
      toast.error("Error updating circular");
    } finally {
      setIsLoading(false);
      handleCloseEditModal();
    }
  };

  const handleDeleteCircular = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/circular-info/${selectedCircular.id}`);
      toast.success("Circular deleted successfully");
      fetchCircular();
    } catch (error) {
      console.error("Error deleting circular:", error);
      toast.error("Error deleting circular");
    } finally {
      setIsLoading(false);
      handleCloseDeleteModal();
    }
  };

  const currentPageData = circular.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                Circulars
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="page-title">Circulars</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link
                        to="/add-circulars"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Circular
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Circular Title</th>
                          <th className="text-center">Circular Number</th>
                          <th className="text-center">Circular Date</th>
                          <th>Circular Link</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{item.description}</td>
                              <td className="text-center">{item.number}</td>
                              <td className="text-center">
                                {new Date(item.publish_date)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(/\//g, "-")}
                              </td>
                              <td>
                                <Link
                                  to={item.link !== "#" ? `${item.link}` : "#"}
                                  target={item.link !== "#" ? "_blank" : ""}
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {item.link}
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEdit(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDelete(item)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center">
                              No Circular data available
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
                    {Array.from(
                      { length: Math.ceil(circular.length / itemsPerPage) },
                      (_, i) => i + 1
                    )
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
                    {currentPage < Math.ceil(circular.length / itemsPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(circular.length / itemsPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(circular.length / itemsPerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(circular.length / itemsPerPage) - 1)
                          }
                        >
                          {Math.ceil(circular.length / itemsPerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(circular.length / itemsPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(circular.length / itemsPerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(circular.length / itemsPerPage))
                          }
                        >
                          {Math.ceil(circular.length / itemsPerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(circular.length / itemsPerPage)
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

          <div
            className={`modal fade ${showDeleteModal ? "show" : ""}`}
            tabIndex="-1"
            aria-hidden={!showDeleteModal}
            style={{ display: showDeleteModal ? "block" : "none" }}
          >
            <div className="modal-dialog modal-dialog-centered">
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
                    onClick={handleDeleteCircular}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
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
                    <h5 className="modal-title">Edit Circular</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          value={selectedCircular?.language_code || ""}
                          onChange={(e) =>
                            setSelectedCircular({
                              ...selectedCircular,
                              language_code: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Circular Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedCircular?.description || ""}
                          onChange={(e) =>
                            setSelectedCircular({
                              ...selectedCircular,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Circular Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedCircular?.number || ""}
                          onChange={(e) =>
                            setSelectedCircular({
                              ...selectedCircular,
                              number: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Posting Date</label>
                        <Flatpickr
                          value={selectedCircular?.publish_date || ""}
                          onChange={(date) =>
                            setSelectedCircular({
                              ...selectedCircular,
                              publish_date: date[0],
                            })
                          }
                          className="form-control"
                          options={{ dateFormat: "d-m-Y" }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Circular Link</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedCircular?.link || ""}
                          onChange={(e) =>
                            setSelectedCircular({
                              ...selectedCircular,
                              link: e.target.value,
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
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleSaveEdit}
                      disabled={isLoading}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Circulars;
