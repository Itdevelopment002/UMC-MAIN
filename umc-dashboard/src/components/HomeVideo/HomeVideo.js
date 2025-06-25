import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "flatpickr/dist/themes/material_blue.css";

const HomeVideo = () => {
  const [videos, setVideos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get("/home-video");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Error fetching videos");
    }
  };

  const handleDelete = (video) => {
    setSelectedVideo(video);
    setShowDeleteModal(true);
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setShowEditModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedVideo(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedVideo(null);
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      const { video_url } = selectedVideo;
      await api.post(`/edit-home-video/${selectedVideo.id}`, {
        video_url
      });
      setIsLoading(false);
      handleCloseEditModal();
      toast.success("Video updated successfully");
      fetchVideos();
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        Array.isArray(error.response.data.errors)
      ) {
        error.response.data.errors.forEach((err) => {
          const message = typeof err === "string" ? err : err.message || "Validation error";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update video. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      console.error("Error updating video:", error);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      setIsLoading(true);
      await api.post(`/delete-home-video/${selectedVideo.id}`);
      toast.success("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Error deleting video");
    } finally {
      setIsLoading(false);
      handleCloseDeleteModal();
    }
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      // eslint-disable-next-line
      /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleOpenVideoModal = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  const currentPageData = videos.slice(
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
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Home Video
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Home Video</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-home-video"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Video
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Videos</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((video, index) => (
                            <tr key={video.id}>
                              <td className="text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  onClick={() => handleOpenVideoModal(video)}
                                >
                                  <img
                                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                                      video.video_url
                                    )}/0.jpg`}
                                    alt={video.description}
                                    style={{
                                      width: "100px",
                                      height: "56px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </button>
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEdit(video)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDelete(video)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                              No video available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <ul className="pagination mt-4">
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
                    { length: Math.ceil(videos.length / itemsPerPage) },
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
                  {currentPage < Math.ceil(videos.length / itemsPerPage) - 3 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  {currentPage < Math.ceil(videos.length / itemsPerPage) - 2 && (
                    <li
                      className={`page-item ${currentPage === Math.ceil(videos.length / itemsPerPage) - 1
                        ? "active"
                        : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(Math.ceil(videos.length / itemsPerPage) - 1)
                        }
                      >
                        {Math.ceil(videos.length / itemsPerPage) - 1}
                      </button>
                    </li>
                  )}
                  {currentPage < Math.ceil(videos.length / itemsPerPage) - 1 && (
                    <li
                      className={`page-item ${currentPage === Math.ceil(videos.length / itemsPerPage)
                        ? "active"
                        : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(Math.ceil(videos.length / itemsPerPage))
                        }
                      >
                        {Math.ceil(videos.length / itemsPerPage)}
                      </button>
                    </li>
                  )}
                  <li
                    className={`page-item ${currentPage === Math.ceil(videos.length / itemsPerPage)
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
                    onClick={handleDeleteVideo}
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
                    <h5 className="modal-title">Edit Video</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Video URL</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedVideo?.video_url || ""}
                          onChange={(e) =>
                            setSelectedVideo({
                              ...selectedVideo,
                              video_url: e.target.value,
                            })
                          }
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
                      onClick={handleSaveEdit}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {showVideoModal && (
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
                    {selectedVideo && (
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                          selectedVideo.video_url
                        )}`}
                        title="Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleCloseVideoModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default HomeVideo;
