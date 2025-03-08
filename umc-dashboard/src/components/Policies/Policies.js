import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const Policies = () => {
    const [policiesdata, setPoliciesdata] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedServices, setSelectedServices] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 10;

    useEffect(() => {
        fetchPoliciesData();
    }, []);

    const fetchPoliciesData = async () => {
        try {
            const response = await api.get("/policies_data");
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                return dateB - dateA;
            });
            setPoliciesdata(sortedData);
        } catch (error) {
            console.error("Error fetching quick links:", error);
            toast.error("Failed to fetch quick links!");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/policies_data/${selectedServices.id}`);
            setPoliciesdata(policiesdata.filter((w) => w.id !== selectedServices.id));
            setShowDeleteModal(false);
            toast.success("Policies deleted successfully!");
        } catch (error) {
            console.error("Error deleting quick links:", error);
            toast.error("Failed to delete the quick links!");
        }
    };

    const handleEditSave = async () => {
        const formattedIssueDate = selectedServices.issue_date
            ? formatDate(selectedServices.issue_date)
            : "";
        try {
            await api.put(`/policies_data/${selectedServices.id}`, {
                heading: selectedServices.heading,
                link: selectedServices.link,
                issue_date: formattedIssueDate,
                language_code: selectedServices.language_code,

            });
            const updatedServices = policiesdata.map((services) =>
                services.id === selectedServices.id ? selectedServices : services
            );
            fetchPoliciesData();
            setShowEditModal(false);
            toast.success("Policies updated successfully!");
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
    const currentServices = policiesdata.slice(indexOfFirstServices, indexOfLastServices);

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="#">Corporation</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                UMC Policies
                            </li>
                        </ol>
                    </nav>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-6">
                                            <h4 className="page-title">UMC Policies</h4>
                                        </div>
                                        <div className="col-6 text-right m-b-20">
                                            <Link
                                                to="/add-policies"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Policies
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th width="35%">Heading</th>
                                                    <th>PDF Link</th>
                                                    <th width="15%" className="text-center" style={{textWrap: "pretty"}}>Issue Date</th>
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
                                                        <td style={{textWrap: "pretty"}}>
                                                            <Link
                                                                to={service.link !== "#" ? `${service.link}` : "#"}
                                                                target={service.link !== "#" ? "_blank" : ""}
                                                                className="text-decoration-none"
                                                                style={{ color: "#000" }}
                                                            >
                                                                {service.link}
                                                            </Link>
                                                        </td>
                                                        <td className="text-center">
                                                            {new Date(service.issue_date)
                                                                .toLocaleDateString("en-GB", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                })
                                                                .replace(/\//g, "-")}
                                                        </td>
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
                                            { length: Math.ceil(policiesdata.length / servicesPerPage) },
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
                                            className={`page-item ${currentPage === Math.ceil(policiesdata.length / servicesPerPage)
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
                                        <h5 className="modal-title">Edit UMC Policies</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Select Language
                                                </label>

                                                <select
                                                    className="form-control"
                                                    value={selectedServices?.language_code || ""}
                                                    onChange={handleEditChange}
                                                    name="language_code"
                                                >
                                                    <option value="">Select Language</option>
                                                    <option value="en">English</option>
                                                    <option value="mr">Marathi</option>
                                                </select>
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
                                                <label className="form-label">PDF Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="link"
                                                    value={selectedServices?.link || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Issue Date</label>
                                                <Flatpickr
                                                    value={selectedServices?.issue_date || ""}
                                                    onChange={(date) =>
                                                        setSelectedServices({
                                                            ...selectedServices,
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
                    <ToastContainer />
                </div>
            </div>
        </>

    );
};

export default Policies;
