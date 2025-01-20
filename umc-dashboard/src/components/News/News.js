import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const News = () => {
  const [news, setNews] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchNews = async () => {
    try {
      const response = await api.get("/newsupdate");
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDeleteClick = (newsId) => {
    setSelectedNews(newsId);
    setModalType("delete");
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/newsupdate/${selectedNews}`);
      setNews(news.filter((item) => item.id !== selectedNews));
      setModalType(null);
      setSelectedNews(null);
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleEditClick = (newsItem) => {
    setSelectedNews(newsItem.id);
    setEditedData(newsItem);
    setModalType("edit");
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/newsupdate/${selectedNews}`, editedData);
      setNews(
        news.map((item) =>
          item.id === selectedNews ? { ...item, ...editedData } : item
        )
      );
      setModalType(null);
      setSelectedNews(null);
      setEditedData({});
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const currentPageData = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                News Update
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">News Update</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-news"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add News
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>News Description</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((item, index) => (
                            <tr key={item.id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{item.description}</td>
                              <td>
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditClick(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10 "
                                  onClick={() => handleDeleteClick(item.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                              No news available
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

          <div>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
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
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
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

          {modalType && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  {modalType === "delete" ? (
                    <>
                      <div className="modal-body text-center">
                        <h5>Are you sure you want to delete this item?</h5>
                      </div>
                      <div className="modal-footer text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => setModalType(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={handleDeleteConfirm}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-header">
                        <h4>Edit News</h4>
                      </div>
                      <div className="modal-body">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={editedData.description || ""}
                          onChange={handleInputChange}
                          className="form-control"
                          rows="3"
                          placeholder="Description"
                        ></textarea>
                      </div>
                      <div className="modal-footer text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => setModalType(null)}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={handleSaveEdit}
                        >
                          Save Changes
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default News;
