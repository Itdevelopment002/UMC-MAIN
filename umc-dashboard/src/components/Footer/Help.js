import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Help = () => {
    const [helplinks, setHelpLinks] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedServices, setSelectedServices] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 10;

    useEffect(() => {
        fetchHelpLinks();
    }, []);

    const fetchHelpLinks = async () => {
        try {
            const response = await api.get("/helps");
            setHelpLinks(response.data);
        } catch (error) {
            console.error("Error fetching help data:", error);
            toast.error("Failed to fetch help data!");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/helps/${selectedServices.id}`);
            setHelpLinks(helplinks.filter((w) => w.id !== selectedServices.id));
            setShowDeleteModal(false);
            toast.success("Help Data deleted successfully!");
        } catch (error) {
            console.error("Error deleting help data:", error);
            toast.error("Failed to delete the help data!");
        }
    };

    const handleEditSave = async () => {
        try {
            await api.put(`/helps/${selectedServices.id}`, {
                heading: selectedServices.heading,
                link: selectedServices.link,
            });
            const updatedServices = helplinks.map((services) =>
                services.id === selectedServices.id ? selectedServices : services
            );
            setHelpLinks(updatedServices);
            setShowEditModal(false);
            toast.success("Help Data updated successfully!");
        } catch (error) {
            console.error("Error updating help data:", error);
            toast.error("Failed to update the help data!");
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
    const currentServices = helplinks.slice(indexOfFirstServices, indexOfLastServices);

    return (
        <div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="card-box">
                        <div className="card-block">
                            <div className="row">
                                <div className="col-sm-4 col-3">
                                    <h4 className="page-title">Help Links</h4>
                                </div>
                                <div className="col-sm-8 col-9 text-right m-b-20">
                                    <Link
                                        to="/add-help"
                                        className="btn btn-primary btn-rounded float-right"
                                    >
                                        <i className="fa fa-plus"></i> Add Help Links
                                    </Link>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered m-b-0">
                                    <thead>
                                        <tr>
                                            <th width="10%">Sr. No.</th>
                                            <th>Heading</th>
                                            <th>Link</th>
                                            <th width="15%">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentServices.map((service, index) => (
                                            <tr key={service.id}>
                                                <td>
                                                    {index + 1 + (currentPage - 1) * servicesPerPage}
                                                </td>
                                                <td>{service.heading}</td>
                                                <td>{service.link}</td>
                                                <td>
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
                    </div>
                </div>
            </div>

            <div className="mt-0">
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
                        { length: Math.ceil(helplinks.length / servicesPerPage) },
                        (_, i) => (
                            <li
                                className={`page-item ${currentPage === i + 1 ? "active" : ""
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
                        className={`page-item ${currentPage === Math.ceil(helplinks.length / servicesPerPage)
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
                                <h5 className="modal-title">Edit Help Links</h5>
                            </div>
                            <div className="modal-body">
                                <form>
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
                                <h5>Are you sure you want to delete this entry?</h5>
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
            <ToastContainer />

        </div>

    );
};

export default Help;
