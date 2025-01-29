import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ENews = () => {
    const [enewsList, setEnewsList] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const agendasPerPage = 10;

    useEffect(() => {
        fetchEnews();
    }, []);

    const fetchEnews = async () => {
        try {
            const response = await api.get("/enews_data");
            setEnewsList(response.data);
        } catch (error) {
            console.error("Error fetching e-news:", error);
            toast.error("Failed to fetch e-news!");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/enews_data/${selectedAgenda.id}`);
            setEnewsList(
                enewsList.filter((agenda) => agenda.id !== selectedAgenda.id)
            );
            setShowDeleteModal(false);
            toast.success("e-news deleted successfully!");
        } catch (error) {
            console.error("Error deleting e-news:", error);
            toast.error("Failed to delete the e-news!");
        }
    };

    const handleEditSave = async () => {
        try {
            await api.put(`/enews_data/${selectedAgenda.id}`, {
                info: selectedAgenda.info,
                issue_date: selectedAgenda.issue_date,
                pdf_link: selectedAgenda.pdf_link,
            });
            const updatedAgendaList = enewsList.map((agenda) =>
                agenda.id === selectedAgenda.id ? selectedAgenda : agenda
            );
            setEnewsList(updatedAgendaList);
            setShowEditModal(false);
            toast.success("e-news updated successfully!");
        } catch (error) {
            console.error("Error updating e-news:", error);
            toast.error("Failed to update the e-news!");
        }
    };

    const handleEditClick = (agenda) => {
        setSelectedAgenda({ ...agenda });
        setShowEditModal(true);
    };

    const handleDeleteClick = (agenda) => {
        setSelectedAgenda(agenda);
        setShowDeleteModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedAgenda({ ...selectedAgenda, [name]: value });
    };

    const indexOfLastAgenda = currentPage * agendasPerPage;
    const indexOfFirstAgenda = indexOfLastAgenda - agendasPerPage;
    const currentAgendas = enewsList.slice(indexOfFirstAgenda, indexOfLastAgenda);

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
                                e-News Letter
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">e-News Letter</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-enews-letter"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add E-News
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%">Sr. No.</th>
                                                    <th width="40%">Information</th>
                                                    <th width="20%">Issue Date</th>
                                                    <th width="20%">PDF Link</th>
                                                    <th width="10%">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentAgendas.map((agenda, index) => (
                                                    <tr key={agenda.id}>
                                                        <td>
                                                            {index + 1 + (currentPage - 1) * agendasPerPage}
                                                        </td>
                                                        <td>{agenda.info}</td>
                                                        <td>
                                                            {new Date(agenda.issue_date).toLocaleDateString("en-CA")}
                                                        </td>
                                                        <td>
                                                            <Link
                                                                to={agenda.pdf_link}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                style={{ color: "black" }}
                                                            >
                                                                {agenda.pdf_link}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleEditClick(agenda)}
                                                                className="btn btn-success btn-sm m-t-10"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm m-t-10"
                                                                onClick={() => handleDeleteClick(agenda)}
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
                                { length: Math.ceil(enewsList.length / agendasPerPage) },
                                (_, i) => (
                                    <li
                                        className={`page-item ${
                                            currentPage === i + 1 ? "active" : ""
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
                                className={`page-item ${
                                    currentPage === Math.ceil(enewsList.length / agendasPerPage)
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
                                        <h5 className="modal-title">Edit Agenda</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">Information</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="info"
                                                    value={selectedAgenda?.info || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Issue Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="issue_date"
                                                    value={selectedAgenda?.issue_date || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">PDF Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pdf_link"
                                                    value={selectedAgenda?.pdf_link || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleEditSave}
                                            className="btn btn-primary"
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
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Delete</h5>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to delete this agenda?
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="btn btn-danger"
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
        </>
    );
};

export default ENews;
