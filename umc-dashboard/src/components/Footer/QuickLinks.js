import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuickLinks = () => {
    const [quicklinks, setQuickLinks] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedServices, setSelectedServices] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 5;

    useEffect(() => {
        fetchQuickLinks();
    }, []);

    const fetchQuickLinks = async () => {
        try {
            const response = await api.get("/quick-link");
            setQuickLinks(response.data);
        } catch (error) {
            console.error("Error fetching quick links:", error);
            toast.error("Failed to fetch quick links!");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/quick-link/${selectedServices.id}`);
            setQuickLinks(quicklinks.filter((w) => w.id !== selectedServices.id));
            setShowDeleteModal(false);
            toast.success("Quick Links deleted successfully!");
        } catch (error) {
            console.error("Error deleting quick links:", error);
            toast.error("Failed to delete the quick links!");
        }
    };

    const handleEditSave = async () => {
        try {
            await api.put(`/quick-link/${selectedServices.id}`, {
                heading: selectedServices.heading,
                link: selectedServices.link,
                language_code: selectedServices.language_code,
            });
            const updatedServices = quicklinks.map((services) =>
                services.id === selectedServices.id ? selectedServices : services
            );
            setQuickLinks(updatedServices);
            setShowEditModal(false);
            toast.success("Quick Links updated successfully!");
        } catch (error) {
            console.error("Error updating quick links:", error);
            toast.error("Failed to update the quick links!");
        }
    };

    const handleEditClick = (news) => {
        setSelectedServices({ ...news });
        setShowEditModal(true);
    };

    const handleDeleteClick = (news) => {
        setSelectedServices(news);
        setShowDeleteModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedServices({ ...selectedServices, [name]: value });
    };

    const indexOfLastServices = currentPage * servicesPerPage;
    const indexOfFirstServices = indexOfLastServices - servicesPerPage;
    const currentServices = quicklinks.slice(indexOfFirstServices, indexOfLastServices);

    return (
        <div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card-box">
                        <div className="card-block">
                            <div className="row">
                                <div className="col-sm-4 col-3">
                                    <h4 className="page-title">Quick Links</h4>
                                </div>
                                <div className="col-sm-8 col-9 text-right m-b-20">
                                    <Link
                                        to="/add-quick-links"
                                        className="btn btn-primary btn-rounded float-right"
                                    >
                                        <i className="fa fa-plus"></i> Add Quick Links
                                    </Link>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered m-b-0">
                                    <thead>
                                        <tr>
                                            <th width="10%" className="text-center">Sr. No.</th>
                                            <th>Heading</th>
                                            <th>Link</th>
                                            <th width="15%" className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentServices.map((service, index) => (
                                            <tr key={service.id}>
                                                <td className="text-center">
                                                    {index + 1 + (currentPage - 1) * servicesPerPage}
                                                </td>
                                                <td>{service.heading}</td>
                                                <td>{service.link}</td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={() => handleEditClick(service)}
                                                        className="btn btn-success btn-sm m-t-10"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm m-t-10"
                                                        onClick={() => handleDeleteClick(service)}
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
                                    { length: Math.ceil(quicklinks.length / servicesPerPage) },
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
                                {currentPage < Math.ceil(quicklinks.length / servicesPerPage) - 3 && (
                                    <li className="page-item disabled">
                                        <span className="page-link">...</span>
                                    </li>
                                )}
                                {currentPage < Math.ceil(quicklinks.length / servicesPerPage) - 2 && (
                                    <li
                                        className={`page-item ${currentPage === Math.ceil(quicklinks.length / servicesPerPage) - 1
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                setCurrentPage(Math.ceil(quicklinks.length / servicesPerPage) - 1)
                                            }
                                        >
                                            {Math.ceil(quicklinks.length / servicesPerPage) - 1}
                                        </button>
                                    </li>
                                )}
                                {currentPage < Math.ceil(quicklinks.length / servicesPerPage) - 1 && (
                                    <li
                                        className={`page-item ${currentPage === Math.ceil(quicklinks.length / servicesPerPage)
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                setCurrentPage(Math.ceil(quicklinks.length / servicesPerPage))
                                            }
                                        >
                                            {Math.ceil(quicklinks.length / servicesPerPage)}
                                        </button>
                                    </li>
                                )}
                                <li
                                    className={`page-item ${currentPage === Math.ceil(quicklinks.length / servicesPerPage)
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
                                <h5 className="modal-title">Edit Quick Links</h5>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Select Language
                                        </label>

                                        <select
                                            className="form-control"
                                            name="language_code"
                                            value={selectedServices?.language_code || ""}
                                            onChange={handleEditChange}
                                        >
                                            <option value="" disabled>Select Language</option>
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
                                            value={selectedServices?.heading || ""}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Link</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="link"
                                            value={selectedServices?.link || ""}
                                            onChange={handleEditChange}
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

    );
};

export default QuickLinks;
