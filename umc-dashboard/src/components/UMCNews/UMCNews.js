import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const UMCNews = () => {
  const [news, setNews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 10;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get("/umc-news");
      const sortedData = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      setNews(sortedData);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to fetch news data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/delete-umc-news/${selectedNews.id}`);
      setNews(news.filter((w) => w.id !== selectedNews.id));
      setShowDeleteModal(false);
      toast.success("News deleted successfully!");
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Failed to delete the news!");
    }
  };

  const handleEditSave = async () => {
    const formattedIssueDate = selectedNews.issue_date
      ? formatDate(selectedNews.issue_date)
      : "";
    try {
      await api.post(`/edit-umc-news/${selectedNews.id}`, {
        heading: selectedNews.heading,
        link: selectedNews.link,
        issue_date: formattedIssueDate,
        language_code: selectedNews.language_code,
      });
      fetchNews();
      setShowEditModal(false);
      toast.success("News updated successfully!");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.errors
      ) {
        error.response.data.errors.forEach((err) => {
          toast.error(err.message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error("Failed to updating news. Try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Error updating news:", error);
    }
  };

  const handleEditClick = (news) => {
    setSelectedNews({ ...news });
    setShowEditModal(true);
  };

  const handleDeleteClick = (news) => {
    setSelectedNews(news);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedNews({ ...selectedNews, [name]: value });
  };

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
                UMC News
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="page-title">UMC News</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link
                        to="/add-umc-news"
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
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>News Heading</th>
                          <th>News Link</th>
                          <th width="20%" className="text-center">Issue Date</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentNews.map((news, index) => (
                          <tr key={news.id}>
                            <td className="text-center">
                              {index + 1 + (currentPage - 1) * newsPerPage}
                            </td>
                            <td>{news.heading}</td>
                            <td>
                              <Link to={news.link} target="_blank" className="text-decoration-none" style={{ color: "#000" }}>
                                {news.link}
                              </Link>
                            </td>
                            <td className="text-center">
                              {new Date(news.issue_date)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                                .replace(/\//g, "-")}
                            </td>
                            <td className="text-center">
                              <button
                                onClick={() => handleEditClick(news)}
                                className="btn btn-success btn-sm m-t-10"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteClick(news)}
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
                      { length: Math.ceil(news.length / newsPerPage) },
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
                    {currentPage < Math.ceil(news.length / newsPerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(news.length / newsPerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(news.length / newsPerPage) - 1 ? "active" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(news.length / newsPerPage) - 1)
                          }
                        >
                          {Math.ceil(news.length / newsPerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(news.length / newsPerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(news.length / newsPerPage) ? "active" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(Math.ceil(news.length / newsPerPage))}
                        >
                          {Math.ceil(news.length / newsPerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(news.length / newsPerPage) ? "disabled" : ""
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
                    <h5 className="modal-title">Edit UMC News</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          value={selectedNews?.language_code || ""}
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
                          value={selectedNews?.heading || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedNews?.link || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Issue Date</label>
                        <Flatpickr
                          value={selectedNews?.issue_date || ""}
                          onChange={(date) =>
                            setSelectedNews({
                              ...selectedNews,
                              issue_date: date[0],
                            })
                          }
                          className="form-control"
                          options={{ dateFormat: "d-m-Y" }}
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

export default UMCNews;
