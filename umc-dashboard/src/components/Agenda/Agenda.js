import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Agenda = () => {
    const [resolutions, setResolutions] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedResolution, setSelectedResolution] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resolutionsPerPage = 10;

    useEffect(() => {
        fetchResolutions();
    }, []);

    const fetchResolutions = async () => {
        try {
            const response = await api.get("/agenda_data");
            setResolutions(response.data);
        } catch (error) {
            console.error("Error fetching agenda:", error);
            toast.error("Failed to fetch agenda!");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/agenda_data/${selectedResolution.Sr_No}`);
            setResolutions(
                resolutions.filter((r) => r.Sr_No !== selectedResolution.Sr_No)
            );
            setShowDeleteModal(false);
            toast.success("Agenda deleted successfully!");
        } catch (error) {
            console.error("Error deleting agenda:", error);
            toast.error("Failed to delete the agenda!");
        }
    };

    const handleEditSave = async () => {
        try {
            await api.put(`/agenda_data/${selectedResolution.Sr_No}`, {
                Department_Name: selectedResolution.Department_Name,
                Agenda_No_Date: selectedResolution.Agenda_No_Date,
                Schedule_Date_of_Meeting: selectedResolution.Schedule_Date_of_Meeting,
                Adjournment_Notice: selectedResolution.Adjournment_Notice,
                pdf_link: selectedResolution.pdf_link,
            });
            const updatedResolutions = resolutions.map((resolution) =>
                resolution.Sr_No === selectedResolution.Sr_No
                    ? selectedResolution
                    : resolution
            );
            setResolutions(updatedResolutions);
            setShowEditModal(false);
            toast.success("Agenda updated successfully!");
        } catch (error) {
            console.error("Error updating agenda:", error);
            toast.error("Failed to update the agenda!");
        }
    };

    const handleEditClick = (resolution) => {
        setSelectedResolution({ ...resolution });
        setShowEditModal(true);
    };

    const handleDeleteClick = (resolution) => {
        setSelectedResolution(resolution);
        setShowDeleteModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedResolution({ ...selectedResolution, [name]: value });
    };

    const indexOfLastResolution = currentPage * resolutionsPerPage;
    const indexOfFirstResolution = indexOfLastResolution - resolutionsPerPage;
    const currentResolutions = resolutions.slice(
        indexOfFirstResolution,
        indexOfLastResolution
    );

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
                                Agenda
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Agenda</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-agenda"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Agenda
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%">Sr. No.</th>
                                                    <th width="20%">Department Name</th>
                                                    <th>Agenda No/Date</th>
                                                    <th width="15%">Schedule Date</th>
                                                    <th width="20%">Adjournment Notice</th>
                                                    <th>PDF Link</th>
                                                    <th width="25%">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentResolutions.map((resolution, index) => (
                                                    <tr key={resolution.Sr_No}>
                                                        <td>
                                                            {index + 1 + (currentPage - 1) * resolutionsPerPage}
                                                        </td>
                                                        <td>{resolution.Department_Name}</td>
                                                        <td>{resolution.Agenda_No_Date}</td>
                                                        <td>{new Date(resolution.Schedule_Date_of_Meeting).toLocaleDateString('en-CA')}</td>
                                                        <td>{resolution.Adjournment_Notice}</td>
                                                        <td>
                                                            <Link to={resolution.pdf_link} target="_blank" rel="noreferrer" style={{ color: 'black' }}>
                                                                {resolution.pdf_link}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleEditClick(resolution)}
                                                                className="btn btn-success btn-sm m-t-10"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm m-t-10"
                                                                onClick={() => handleDeleteClick(resolution)}
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

                    {/* Pagination */}
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
                                { length: Math.ceil(resolutions.length / resolutionsPerPage) },
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
                                className={`page-item ${currentPage === Math.ceil(resolutions.length / resolutionsPerPage)
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

                    {/* Modals */}
                    {showEditModal && (
                        <div
                            className="modal fade show"
                            style={{
                                display: "block",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                overflowY: "scroll",
                            }}
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Resolution</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">Department Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="Department_Name"
                                                    value={selectedResolution?.Department_Name || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Agenda No/Date</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="Agenda_No_Date"
                                                    value={selectedResolution?.Agenda_No_Date || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Schedule Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="Schedule_Date_of_Meeting"
                                                    value={
                                                        selectedResolution?.Schedule_Date_of_Meeting || ""
                                                    }
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Adjournment Notice</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="Adjournment_Notice"
                                                    value={selectedResolution?.Adjournment_Notice || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">PDF Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pdf_link"
                                                    value={selectedResolution?.pdf_link || ""}
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
            </div>
        </>
    );
};

export default Agenda;
