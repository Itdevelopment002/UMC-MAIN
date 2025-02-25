import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ElectedMember = () => {
    const [electeddata, setElecteddata] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedServices, setSelectedServices] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 10;

    useEffect(() => {
        fetchElectedData();
    }, []);

    const fetchElectedData = async () => {
        try {
            const response = await api.get("/elected_data");
            setElecteddata(response.data.reverse());
        } catch (error) {
            console.error("Error fetching elected member data:", error);
            toast.error("Failed to fetch elected member data!");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/elected_data/${selectedServices.id}`);
            setElecteddata(electeddata.filter((w) => w.id !== selectedServices.id));
            setShowDeleteModal(false);
            toast.success("Elected member data deleted successfully!");
        } catch (error) {
            console.error("Error deleting elected member data:", error);
            toast.error("Failed to delete the elected member data!");
        }
    };

    const handleEditSave = async () => {
        try {
            await api.put(`/elected_data/${selectedServices.id}`, {
                heading: selectedServices.heading,
                link: selectedServices.link,
                language_code: selectedServices.language_code,
            });
            const updatedServices = electeddata.map((services) =>
                services.id === selectedServices.id ? selectedServices : services
            );
            setElecteddata(updatedServices);
            setShowEditModal(false);
            toast.success("Elected member data updated successfully!");
        } catch (error) {
            console.error("Error updating elected member data:", error);
            toast.error("Failed to update the elected member data!");
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
    const currentServices = electeddata.slice(indexOfFirstServices, indexOfLastServices);

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
                                Elected Member
                            </li>
                        </ol>
                    </nav>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Elected Member</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-elected-member"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Member
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Heading</th>
                                                    <th>PDF Link</th>
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
                                                        <td>
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
                                            { length: Math.ceil(electeddata.length / servicesPerPage) },
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
                                            className={`page-item ${currentPage === Math.ceil(electeddata.length / servicesPerPage)
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
                                        <h5 className="modal-title">Edit Elected Member</h5>
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

export default ElectedMember;
