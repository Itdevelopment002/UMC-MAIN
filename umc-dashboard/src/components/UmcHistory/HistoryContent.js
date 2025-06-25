import React, { useState, useEffect } from "react";
import api from "../api";
//eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HistoryContent = () => {
    const [desc, setDesc] = useState([]);
    const [description, setDescription] = useState("");
    const [languageCode, setLanguageCode] = useState("");
    const [showAddNewModal, setShowAddNewModal] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWork, setSelectedWork] = useState(null);
    const [editData, setEditData] = useState({ id: "", description: "", language_code: "" });
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const validateAddForm = () => {
        const newErrors = {};
        if (!description.trim()) {
            newErrors.description = "Description is required.";
        }
        if (!languageCode.trim()) {
            newErrors.languageCode = "Language Selection is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        fetchDesc();
    }, []);

    const fetchDesc = async () => {
        try {
            const response = await api.get("/history_desc");
            setDesc(response.data);
        } catch (error) {
            toast.error("Error fetching desc.");
        }
    };

    const handleAddWork = async () => {
        if (!validateAddForm()) return;
        const newWork = { description, language_code: languageCode };
        try {
            const response = await api.post("/history_desc", newWork);
            setDesc([...desc, response.data]);
            fetchDesc();
            setDescription("");
            setLanguageCode("");
            setShowAddNewModal(false);
            toast.success("History Description added successfully!");
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
                      error.response?.data?.message || "Error adding Description.",
                      {
                        position: "top-right",
                        autoClose: 3000,
                      }
                    );
                  }
            console.error("Error adding Description:", error);
        }
    };

    const handleDeleteClick = (work) => {
        setSelectedWork(work);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.post(`/delete-history_desc/${selectedWork.id}`);
            setDesc(desc.filter((work) => work.id !== selectedWork.id));
            toast.success("History Description deleted successfully!");
        } catch (error) {
            toast.error("Error deleting Description.");
        } finally {
            setDeleteModalOpen(false);
        }
    };

    const handleEditClick = (work) => {
        setEditData(work);
        setShowEditModal(true);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await api.post(`/edit-history_desc/${editData.id}`, {
                description: editData.description,
                language_code: editData.language_code,
            });

            if (response.status === 200 || response.status === 201) {
                setDesc(
                    desc.map((work) => (work.id === editData.id ? response.data : work))
                );
                fetchDesc();
                toast.success("History Description updated successfully!", {
                    position: "top-right",
                    autoClose: 1000,
                    onClose: () => {
                        setShowEditModal(false);
                    }
                });
            }
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
                    error.response?.data?.message || "Error updating Description:",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }
            console.error("Error updating Description:", error);
        }
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
        if (errors.description) {
            setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
        }
    };

    const handleLanguageChange = (value) => {
        setLanguageCode(value);
        if (errors.languageCode) {
            setErrors((prevErrors) => ({ ...prevErrors, languageCode: "" }));
        }
    };

    const totalPages = Math.ceil(desc.length / itemsPerPage);
    const currentPageData = desc.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card-box">
                        <div className="card-block">
                            <div className="row">
                                <div className="col-6">
                                    <h4 className="page-title">
                                        History Description
                                    </h4>
                                </div>
                                <div className="col-6 text-right m-b-20">
                                    <button
                                        onClick={() => setShowAddNewModal(true)}
                                        className="btn btn-primary btn-rounded float-right"
                                    >
                                        <i className="fa fa-plus"></i> Add Desc
                                    </button>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered m-b-0">
                                    <thead>
                                        <tr>
                                            <th width="10%" className="text-center">Sr. No.</th>
                                            <th>Description</th>
                                            <th width="15%" className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPageData.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="text-center">{((currentPage - 1) * itemsPerPage) + (index + 1)}</td>
                                                <td>{item.description}</td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-success btn-sm m-t-10"
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm m-t-10"
                                                        onClick={() => handleDeleteClick(item)}
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
                        <div>
                            <ul className="pagination mt-4">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                        Previous
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {showAddNewModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        role="document"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add History Description</h5>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>
                                            Select Language
                                        </label>
                                        <select
                                            className={`form-control ${errors.languageCode ? "is-invalid" : ""}`}
                                            value={languageCode}
                                            onChange={(e) => handleLanguageChange(e.target.value)}
                                            name="language_code"
                                        >
                                            <option value="">Select Language</option>
                                            <option value="en">English</option>
                                            <option value="mr">Marathi</option>
                                        </select>
                                        {errors.languageCode && (
                                            <div className="invalid-feedback">
                                                {errors.languageCode}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            rows={3}
                                            className={`form-control ${errors.description ? "is-invalid" : ""
                                                }`}
                                            placeholder="Enter Description"
                                            value={description}
                                            onChange={(e) =>
                                                handleDescriptionChange(e.target.value)
                                            }
                                        />
                                        {errors.description && (
                                            <div className="invalid-feedback">
                                                {errors.description}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => {
                                        setShowAddNewModal(false);
                                        setDescription("");
                                        setLanguageCode("");
                                        setErrors({ description: "", languageCode: "" });
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={handleAddWork}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div
                    className="modal fade show"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        role="document"
                    >
                        <div className="modal-content">
                            <div className="modal-body text-center">
                                <h5>Are you sure you want to delete this item?</h5>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setDeleteModalOpen(false)}
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
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        role="document"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Description</h5>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>
                                            Select Language
                                        </label>
                                        <select
                                            className="form-control"
                                            value={editData.language_code || ""}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    language_code: e.target.value,
                                                })
                                            }
                                            name="language_code"
                                        >
                                            <option value="">Select Language</option>
                                            <option value="en">English</option>
                                            <option value="mr">Marathi</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            rows={3}
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
                                    onClick={handleEditSubmit}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HistoryContent;