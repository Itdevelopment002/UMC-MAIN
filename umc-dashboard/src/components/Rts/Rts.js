import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { FaFilePdf } from "react-icons/fa";

const Rts = () => {
  const [rtsData, setRtsData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [pdfPreview, setPdfPreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRtsData();
    fetchPdfData();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
    });
    return () => {
      lightbox.destroy();
    };
  }, [pdfData]);

  const fetchRtsData = async () => {
    try {
      const response = await api.get("/righttoservices");
      setRtsData(response.data);
    } catch (error) {
      toast.error("Error fetching RTS!");
    }
  };

  const fetchPdfData = async () => {
    try {
      const response = await api.get("/rts_table");
      setPdfData(response.data);
    } catch (error) {
      toast.error("Error fetching RTS Pdf!");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "rts") {
        await api.delete(`/righttoservices/${id}`);
        setRtsData((prevData) => prevData.filter((item) => item.id !== id));
      } else if (type === "pdf") {
        await api.delete(`/rts_table/${id}`);
        setPdfData((prevData) => prevData.filter((item) => item.id !== id));
      }
      toast.success(
        `${type === "rts" ? "RTS" : "RTS Pdf"} deleted successfully!`
      );
    } catch (error) {
      console.error(error);
      toast.error("Error deleting the entry!");
    }
    closeModal();
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    setEditData(
      type === "rts"
        ? { heading: item.heading, description: item.description }
        : { ...item }
    );
    setPdfPreview(
      type === "pdf" && item.pdf_path ? `${baseURL}/${item.pdf_path}` : ""
    );
    setModalType(type);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setEditData({});
    setPdfPreview("");
  };

  const handleSaveChanges = async () => {
    try {
      if (modalType === "rts") {
        await api.put(`/righttoservices/${selectedItem.id}`, {
          heading: editData.heading,
          description: editData.description,
        });
        fetchRtsData();
      } else if (modalType === "pdf") {
        const formData = new FormData();
        formData.append("description", editData.description);

        if (editData.pdfFile) {
          formData.append("userfile", editData.pdfFile);
        }

        await api.put(`/rts_table/${selectedItem.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fetchPdfData();
      }

      toast.success(
        `${modalType === "rts" ? "RTS" : "RTS Pdf"} updated successfully!`
      );
      navigate("/rts");
    } catch (error) {
      console.error(error);
      toast.error("Error updating the entry!");
    }
    closeModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfPreview(URL.createObjectURL(file));
      setEditData({ ...editData, pdfFile: file });
    }
  };
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
                Right to Service
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Right to Service</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right">
                      <Link
                        to="/add-rts"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add RTS
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="5%">Sr. No.</th>
                          <th>Heading</th>
                          <th>Description</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rtsData.length > 0 ? (
                          rtsData.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.heading}</td>
                              <td>{item.description}</td>
                              <td>
                                <button
                                  onClick={() => openEditModal(item, "rts")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("rts");
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
                            <td colSpan="4">No Rts Data Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="row m-t-50">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Right to Service Pdf</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right">
                      <Link
                        to="/add-rts-pdf"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add RTS Pdf
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Description</th>
                          <th>Uploaded PDF</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pdfData.length > 0 ? (
                          pdfData.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.description}</td>
                              <td>
                                <Link
                                  to={`${baseURL}/${item.pdf_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaFilePdf
                                    size={35}
                                    style={{ color: "red" }}
                                  />
                                </Link>
                              </td>
                              <td>
                                <button
                                  onClick={() => openEditModal(item, "pdf")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("pdf");
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
                            <td colSpan="4">No Rts Pdf Available</td>
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
                      {modalType === "rts" ? "Edit RTS" : "Edit RTS Pdf"}
                    </h5>
                  </div>
                  <div className="modal-body">
                    {modalType === "rts" ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="heading">Heading</label>
                          <input
                            className="form-control form-control-md"
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
                          <textarea
                            className="form-control form-control-md"
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
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <input
                            type="text"
                            className="form-control form-control-md"
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
                          <label htmlFor="pdf">Upload PDF</label>
                          <input
                            type="file"
                            className="form-control form-control-md"
                            id="pdf"
                            accept="application/pdf"
                            onChange={handleFileChange}
                          />
                          {pdfPreview && (
                            <Link
                              to={pdfPreview}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: "block", marginTop: "10px" }}
                            >
                              Preview PDF
                            </Link>
                          )}
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
                    <h5>Are you sure you want to delete this entry?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
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

export default Rts;
