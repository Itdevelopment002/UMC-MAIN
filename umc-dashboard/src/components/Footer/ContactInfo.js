import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURL } from "../api";

const ContactInfo = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [editData, setEditData] = useState({
    heading: "",
    description: "",
    language_code: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastServices = currentPage * itemsPerPage;
  const indexOfFirstServices = indexOfLastServices - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstServices, indexOfLastServices);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => {
      lightbox.destroy();
    };
  }, [contacts, currentContacts]);

  const fetchContacts = () => {
    api
      .get("/contacts-info")
      .then((response) => setContacts(response.data))
      .catch((error) => {
        console.error("Error fetching contact info details!", error);
        toast.error("Failed to load contact info details.");
      });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDeleteModalOpen = (contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = (contact) => {
    setEditData(contact);
    setImagePreview(`${baseURL}${contact.image_path}`);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    api
      .post(`/delete-contacts-info/${selectedContact.id}`)
      .then(() => {
        setContacts(
          contacts.filter((contact) => contact.id !== selectedContact.id)
        );
        setShowDeleteModal(false);
        setSelectedContact(null);
        toast.success("Contact Info deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting contact info!", error);
        toast.error("Failed to delete contact info.");
      });
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("heading", editData.heading);
    formData.append("description", editData.description);
    formData.append("language_code", editData.language_code);
    if (editData.image) {
      formData.append("image", editData.image);
    }

    try {
      await api.post(`/edit-contacts-info/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchContacts();
      setShowEditModal(false);
      toast.success("Contact Info updated successfully!");
    } catch (error) {
      console.error("Error updating conatct info!", error);
      toast.error("Failed to update conatct info.");
    }
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({ heading: "", description: "", language_code: "", image: null });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  //eslint-disable-next-line
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <div className="card-block">
              <div className="row">
                <div className="col-sm-4 col-3">
                  <h4 className="page-title">Contact Info</h4>
                </div>
                <div className="col-sm-8 col-9 text-right m-b-20">
                  <Link
                    to="/add-contact"
                    className="btn btn-primary btn-rounded float-right"
                  >
                    <i className="fa fa-plus"></i> Add Contact Info
                  </Link>
                </div>
              </div>
              <div className="table-responsive m-t-10">
                <table className="table table-bordered m-b-0">
                  <thead>
                    <tr>
                      <th width="10%" className="text-center">Sr. No.</th>
                      <th>Contact Title</th>
                      <th>Contact Description</th>
                      <th className="text-center">Contact Icon</th>
                      <th width="15%" className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentContacts.map((contact, index) => (
                      <tr key={contact.id}>
                        <td className="text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                        <td>{contact.heading}</td>
                        <td>{contact.description}</td>
                        <td className="text-center">
                          <Link
                            to={`${baseURL}${contact.image_path}`}
                            className="glightbox"
                            data-gallery="contact-images"
                          >
                            <img
                              width="30px"
                              src={`${baseURL}${contact.image_path}`}
                              alt={`contact-img${contact.image_path}`}
                            />
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-success btn-sm m-t-10"
                            onClick={() => handleEditModalOpen(contact)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm m-t-10"
                            onClick={() => handleDeleteModalOpen(contact)}
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
                  { length: Math.ceil(contacts.length / itemsPerPage) },
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
                {currentPage < Math.ceil(contacts.length / itemsPerPage) - 3 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
                {currentPage < Math.ceil(contacts.length / itemsPerPage) - 2 && (
                  <li
                    className={`page-item ${currentPage === Math.ceil(contacts.length / itemsPerPage) - 1
                      ? "active"
                      : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage(Math.ceil(contacts.length / itemsPerPage) - 1)
                      }
                    >
                      {Math.ceil(contacts.length / itemsPerPage) - 1}
                    </button>
                  </li>
                )}
                {currentPage < Math.ceil(contacts.length / itemsPerPage) - 1 && (
                  <li
                    className={`page-item ${currentPage === Math.ceil(contacts.length / itemsPerPage)
                      ? "active"
                      : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage(Math.ceil(contacts.length / itemsPerPage))
                      }
                    >
                      {Math.ceil(contacts.length / itemsPerPage)}
                    </button>
                  </li>
                )}
                <li
                  className={`page-item ${currentPage === Math.ceil(contacts.length / itemsPerPage)
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
                <h5 className="modal-title">Edit Contact Info</h5>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>
                      Select Language
                    </label>

                    <select
                      className="form-control"
                      value={editData.language_code}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
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
                    <label>Contact Title</label>
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
                    <label>Contact Description</label>
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
                    <label>Contact Icon</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
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
    </>
  );
};

export default ContactInfo;
