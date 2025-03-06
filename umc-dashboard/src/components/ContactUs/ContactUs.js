import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

const ContactUs = () => {
  const [contactData, setContactData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchContactData();
    fetchWardData();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
    });
    return () => {
      lightbox.destroy();
    };
  }, [contactData]);

  const fetchContactData = async () => {
    try {
      const response = await api.get("/contact-info");
      setContactData(response.data);
    } catch (error) {
      toast.error("Failed to fetch contact data!");
    }
  };

  const fetchWardData = async () => {
    try {
      const response = await api.get("/ward-info");
      setWardData(response.data);
    } catch (error) {
      toast.error("Failed to fetch Ward data!");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "contact") {
        await api.delete(`/contact-info/${id}`);
        setContactData((prevData) => prevData.filter((item) => item.id !== id));
      } else if (type === "ward") {
        await api.delete(`/ward-info/${id}`);
        setWardData((prevData) => prevData.filter((item) => item.id !== id));
      }
      toast.success(
        `${type === "contact" ? "Contact Information" : "Ward Information"} deleted successfully!`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the entry!");
    }
    closeModal();
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    setEditData(
      type === "ward" ? { office: item.office, address: item.address, phone: item.phone, email: item.email, language_code: item.language_code } : { ...item }
    );
    setImagePreview(type === "contact" ? `${baseURL}${item.image_path}` : "");
    setModalType(type);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setEditData({});
    setImagePreview("");
  };

  const handleSaveChanges = async () => {
    try {
      if (modalType === "ward") {
        await api.put(`/ward-info/${selectedItem.id}`, {
          office: editData.office,
          address: editData.address,
          phone: editData.phone,
          email: editData.email,
          language_code: editData.language_code
        });
        setWardData(
          wardData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, office: editData.office, address: editData.address, phone: editData.phone, email: editData.email }
              : item
          )
        );
        fetchWardData();
      } else if (modalType === "contact") {
        const formData = new FormData();
        formData.append("heading", editData.heading);
        formData.append("description", editData.description);
        formData.append("language_code", editData.language_code);

        if (editData.imageFile) {
          formData.append("contactIcon", editData.imageFile);
        }

        await api.put(`/contact-info/${selectedItem.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setContactData(
          contactData.map((item) =>
            item.id === selectedItem.id ? { ...item, ...editData } : item
          )
        );
        fetchContactData();
      }
      toast.success(
        `${modalType === "contact" ? "Contact" : "Ward"} information updated successfully!`
      );
      navigate("/contact-us");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the entry!");
    }
    closeModal();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditData({ ...editData, imageFile: file });
      };
      reader.readAsDataURL(file);
    }
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
                Contact Us
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="page-title">Contact Information</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link
                        to="/add-contact-info"
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
                          <th>Description</th>
                          <th className="text-center">Contact Icon</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactData.length > 0 ? (
                          contactData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item.heading}</td>
                              <td>{item.description}</td>
                              <td style={{ backgroundColor: "#000" }} className="text-center">
                                <Link
                                  className="glightbox"
                                  to={`${baseURL}${item.image_path}`}
                                >
                                  <img
                                    src={`${baseURL}${item.image_path}`}
                                    alt={item.heading}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                    }}
                                  />
                                </Link>
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => openEditModal(item, "contact")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("contact");
                                    setShowDeleteModal(true);
                                  }}
                                  className="btn btn-danger btn-sm m-t-10"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No Contact Data Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Ward Information</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-ward-info"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Info
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th className="text-center">Ward Office No.</th>
                          <th>Office Address</th>
                          <th>Phone Number</th>
                          <th>Email Id</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wardData.length > 0 ? (
                          wardData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">{item.office}</td>
                              <td>{item.address}</td>
                              <td>{item.phone}</td>
                              <td>{item.email}</td>
                              <td className="text-center">
                                <button
                                  onClick={() => openEditModal(item, "ward")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("ward");
                                    setShowDeleteModal(true);
                                  }}
                                  className="btn btn-danger btn-sm m-t-10"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">No Ward Data Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
                    <h5 className="modal-title">
                      {modalType === "contact"
                        ? "Edit Contact Information"
                        : "Edit Ward Information"}
                    </h5>
                  </div>
                  <div className="modal-body">
                    {modalType === "contact" ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="language_code">
                            Select Language
                          </label>
                          <select
                            className="form-control"
                            name="language_code"
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
                          <label htmlFor="heading">Heading</label>
                          <input
                            type="text"
                            className="form-control"
                            id="heading"
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
                          <label htmlFor="description">Description</label>
                          <input
                            type="text"
                            className="form-control"
                            id="description"
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
                          <label htmlFor="contactIcon">Contact Icon</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            id="contactIcon"
                            onChange={handleImageChange}
                          />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                marginTop: "10px",
                                backgroundColor: "#000",
                              }}
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="language_code">
                            Select Language
                          </label>
                          <select
                            className="form-control"
                            name="language_code"
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
                          <label htmlFor="office">Ward Office no.</label>
                          <input
                            type="text"
                            className="form-control"
                            id="office"
                            value={editData.office}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                office: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="address">Office Address</label>
                          <input
                            type="text"
                            className="form-control"
                            id="address"
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
                          <label htmlFor="phone">Phone number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            value={editData.phone}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email Id</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveChanges}
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
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(selectedItem.id, modalType)}
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

export default ContactUs;
