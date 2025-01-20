import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Contact = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [contact, setContact] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchContact = async () => {
    try {
      const response = await api.get("/contact-us");
      setContact(response.data);
    } catch (error) {
      console.error("Error fetching contact data.");
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const handleDeleteModalOpen = (feedbackId) => {
    setSelectedFeedback(feedbackId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/contact-us/${selectedFeedback}`);
      setContact(
        contact.filter((feedback) => feedback.id !== selectedFeedback)
      );
      setShowDeleteModal(false);
      setSelectedFeedback(null);
      toast.success("Feedback deleted successfully!");
    } catch (error) {
      console.error("Error deleting feedback.");
      toast.error("Error deletin feedback!");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFeedback(null);
  };

  const currentPageData = contact.slice(
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
                <Link to="#.">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Contact Us
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Contact Us</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Full Name</th>
                          <th>Mobile No.</th>
                          <th>Subject</th>
                          <th>Email Address</th>
                          <th>Feedback</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageData.length > 0 ? (
                          currentPageData.map((feedback, index) => (
                            <tr key={feedback.id}>
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{feedback.name}</td>
                              <td>{feedback.mobile}</td>
                              <td>{feedback.subject}</td>
                              <td>{feedback.email}</td>
                              <td>{feedback.feedback}</td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm m-t-10"
                                  onClick={() =>
                                    handleDeleteModalOpen(feedback.id)
                                  }
                                >
                                  Follow Up
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                              No contact available
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

          <div className="mt-4">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from(
                { length: Math.ceil(contact.length / itemsPerPage) },
                (_, i) => (
                  <li
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    key={i}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              )}
              <li
                className={`page-item ${
                  currentPage === Math.ceil(contact.length / itemsPerPage)
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
                    <h5>Are you sure you want to delete this entry?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCloseDeleteModal}
                    >
                      Cancel
                    </button>
                    <button
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

export default Contact;
