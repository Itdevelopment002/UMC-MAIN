import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const PressNote = () => {
  const [note, setNote] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notePerPage = 10;

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get("/press-note");
      const sortedData = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      setNote(sortedData);
    } catch (error) {
      console.error("Error fetching note:", error);
      toast.error("Failed to fetch note data!");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/press-note/${selectedNote.id}`);
      setNote(note.filter((w) => w.id !== selectedNote.id));
      setShowDeleteModal(false);
      toast.success("Press Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete the note!");
    }
  };

  const handleEditSave = async () => {
    const formattedIssueDate = selectedNote.issue_date
      ? formatDate(selectedNote.issue_date)
      : "";
    try {
      await api.put(`/press-note/${selectedNote.id}`, {
        description: selectedNote.description,
        link: selectedNote.link,
        language_code: selectedNote.language_code,
        issue_date: formattedIssueDate,
      });
      fetchNotes();
      setShowEditModal(false);
      toast.success("Press Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update the note!");
    }
  };

  const handleEditClick = (note) => {
    setSelectedNote({ ...note });
    setShowEditModal(true);
  };

  const handleDeleteClick = (note) => {
    setSelectedNote(note);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedNote({ ...selectedNote, [name]: value });
  };

  const indexOfLastNote = currentPage * notePerPage;
  const indexOfFirstNote = indexOfLastNote - notePerPage;
  const currentNote = note.slice(indexOfFirstNote, indexOfLastNote);

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
                Press Note
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Press Note</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-press-note"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Note
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Description</th>
                          <th>Link</th>
                          <th width="20%" className="text-center">Issue Date</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentNote.length > 0 ? (
                          currentNote.map((note, index) => (
                            <tr key={note.id}>
                              <td className="text-center">
                                {index + 1 + (currentPage - 1) * notePerPage}
                              </td>
                              <td>{note.description}</td>
                              <td>
                                <Link
                                  to={note.link !== "#" ? `${note.link}` : "#"}
                                  target={note.link !== "#" ? "_blank" : ""}
                                  className="text-decoration-none"
                                  style={{ color: "#000" }}
                                >
                                  {note.link}
                                </Link>
                              </td>
                              <td className="text-center">
                                {new Date(note.issue_date)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(/\//g, "-")}
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleEditClick(note)}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(note)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">No Pressnote data available</td>
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
                      { length: Math.ceil(note.length / notePerPage) },
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
                    {currentPage < Math.ceil(note.length / notePerPage) - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {currentPage < Math.ceil(note.length / notePerPage) - 2 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(note.length / notePerPage) - 1
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(note.length / notePerPage) - 1)
                          }
                        >
                          {Math.ceil(note.length / notePerPage) - 1}
                        </button>
                      </li>
                    )}
                    {currentPage < Math.ceil(note.length / notePerPage) - 1 && (
                      <li
                        className={`page-item ${currentPage === Math.ceil(note.length / notePerPage)
                          ? "active"
                          : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            setCurrentPage(Math.ceil(note.length / notePerPage))
                          }
                        >
                          {Math.ceil(note.length / notePerPage)}
                        </button>
                      </li>
                    )}
                    <li
                      className={`page-item ${currentPage === Math.ceil(note.length / notePerPage)
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
                    <h5 className="modal-title">Edit Pressnote</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">
                          Select Language
                        </label>

                        <select
                          className="form-control"
                          value={selectedNote?.language_code || ""}
                          onChange={handleEditChange}
                          name="language_code"
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={selectedNote?.description || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                          type="text"
                          className="form-control"
                          name="link"
                          value={selectedNote?.link || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Issue Date</label>
                        <Flatpickr
                          value={selectedNote?.issue_date || ""}
                          onChange={(date) =>
                            setSelectedNote({
                              ...selectedNote,
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

export default PressNote;
