import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Information = () => {
  const [info, setInfo] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const infoPerPage = 10;

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const response = await api.get("/information");
      setInfo(response.data.reverse());
    } catch (error) {
      console.error("Error fetching info:", error);
      toast.error("Failed to fetch info data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/information/${selectedInfo.id}`);
      setInfo(info.filter((w) => w.id !== selectedInfo.id));
      setShowDeleteModal(false);
      toast.success("Information deleted successfully!");
    } catch (error) {
      console.error("Error deleting info:", error);
      toast.error("Failed to delete the info!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/information/${selectedInfo.id}`, {
        heading: selectedInfo.heading,
        link: selectedInfo.link,
        language_code: selectedInfo.language_code,
      });
      const updatedInfo = info.map((info) =>
        info.id === selectedInfo.id ? selectedInfo : info
      );
      setInfo(updatedInfo);
      setShowEditModal(false);
      toast.success("Information updated successfully!");
    } catch (error) {
      console.error("Error updating info:", error);
      toast.error("Failed to update the info!");
    }
  };

  const handleEditClick = (info) => {
    setSelectedInfo({ ...info });
    setShowEditModal(true);
  };

  const handleDeleteClick = (info) => {
    setSelectedInfo(info);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedInfo({ ...selectedInfo, [name]: value });
  };

  const indexOfLastInfo = currentPage * infoPerPage;
  const indexOfFirstInfo = indexOfLastInfo - infoPerPage;
  const currentInfo = info.slice(indexOfFirstInfo, indexOfLastInfo);

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
                Information
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Information</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-information"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Info
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
                        {currentInfo.map((info, index) => (
                          <tr key={info.id}>
                            <td className="text-center">
                              {index + 1 + (currentPage - 1) * infoPerPage}
                            </td>
                            <td>{info.heading}</td>
                            <td>
                              <Link to={info.link} target="_blank" className="text-decoration-none" style={{ color: "#000" }}>
                                {info.link}
                              </Link>
                            </td>
                            <td className="text-center">
                              <button
                                onClick={() => handleEditClick(info)}
                                className="btn btn-success btn-sm m-t-10"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteClick(info)}
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
                <div className="mt-4">
                  <ul className="pagination">
                    {/* Previous Button */}
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>

                    {/* Always show the first page */}
                    {currentPage > 2 && (
                      <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(1)}>
                          1
                        </button>
                      </li>
                    )}

                    {/* Show the second page if currentPage is greater than 2 */}
                    {currentPage > 3 && (
                      <li className={`page-item ${currentPage === 2 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(2)}>
                          2
                        </button>
                      </li>
                    )}

                    {/* Show ellipsis if currentPage is far from the start */}
                    {currentPage > 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}

                    {/* Show currentPage and its neighbors */}
                    {Array.from(
                      { length: Math.ceil(info.length / infoPerPage) },
                      (_, i) => i + 1
                    )
                      .filter(
                        (page) =>
                          page >= currentPage - 1 && page <= currentPage + 1 // Show current page and its neighbors
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

                    {/* Show ellipsis if currentPage is far from the end */}
                    {currentPage < Math.ceil(info.length / infoPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}

                    {/* Show the second-to-last page if currentPage is not near the end */}
                    {currentPage < Math.ceil(info.length / infoPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(info.length / infoPerPage) - 1)
                          }
                        >
                          {Math.ceil(info.length / infoPerPage) - 1}
                        </button>
                      </li>
                    )}

                    {/* Always show the last page */}
                    {currentPage < Math.ceil(info.length / infoPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(info.length / infoPerPage))
                          }
                        >
                          {Math.ceil(info.length / infoPerPage)}
                        </button>
                      </li>
                    )}

                    {/* Next Button */}
                    <li
                      className={`page-item ${currentPage === Math.ceil(info.length / infoPerPage)
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
                    <h5 className="modal-title">Edit Information</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          value={selectedInfo?.language_code || ""}
                          onChange={handleEditChange}
                          name="language_code"
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Heading</label>
                        <input
                          type="text"
                          className="form-control"
                          name="heading"
                          value={selectedInfo?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedInfo?.link || ""}
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

export default Information;
