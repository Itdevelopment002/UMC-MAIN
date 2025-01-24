import React, { useState, useEffect } from "react";
import api from "../api";
//eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HistoryContent = () => {
    const [desc, setDesc] = useState([]);
    const [description, setDescription] = useState("");
    const [showAddNewModal, setShowAddNewModal] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWork, setSelectedWork] = useState(null);
    const [editData, setEditData] = useState({ id: "", description: "" });
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const validateAddForm = () => {
        const newErrors = {};
        if (!description.trim()) {
            newErrors.description = "Description is required.";
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
        const newWork = { description };
        try {
            const response = await api.post("/history_desc", newWork);
            setDesc([...desc, response.data]);
            setDescription("");
            setShowAddNewModal(false);
            toast.success("Description added successfully!");
        } catch (error) {
            toast.error("Error adding Description.");
        }
    };

    const handleDeleteClick = (work) => {
        setSelectedWork(work);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/history_desc/${selectedWork.id}`);
            setDesc(desc.filter((work) => work.id !== selectedWork.id));
            toast.success("Description deleted successfully!");
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
            const response = await api.put(`/history_desc/${editData.id}`, {
                description: editData.description,
            });

            if (response.status === 200) {
                setDesc(
                    desc.map((work) => (work.id === editData.id ? response.data : work))
                );
                toast.success("Description updated successfully!");
            } else {
                toast.error("Failed to update Description.");
            }
        } catch (error) {
            console.error("Error updating Description:", error);
            toast.error("Error updating Description.");
        } finally {
            setShowEditModal(false);
        }
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
        if (errors.description) {
            setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
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
                                <div className="col-sm-4 col-3">
                                    <h4 className="page-title">
                                        History Description
                                    </h4>
                                </div>
                                <div className="col-sm-8 col-9 text-right m-b-20">
                                    <button
                                        onClick={() => setShowAddNewModal(true)}
                                        className="btn btn-primary btn-rounded float-right"
                                    >
                                        <i className="fa fa-plus"></i> Add New
                                    </button>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered m-b-0">
                                    <thead>
                                        <tr>
                                            <th width="10%">Sr. No.</th>
                                            <th>Description</th>
                                            <th width="15%">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPageData.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.description}</td>
                                                <td>
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
                    </div>
                </div>
            </div>

            <div>
                <ul className="pagination">
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
                                <h5 className="modal-title">Add New Description</h5>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input
                                            type="text"
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
                                    onClick={() => setShowAddNewModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={handleAddWork}
                                >
                                    Add
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
                                <h5>Are you sure you want to delete this description?</h5>
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
                                        <label>Description</label>
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
