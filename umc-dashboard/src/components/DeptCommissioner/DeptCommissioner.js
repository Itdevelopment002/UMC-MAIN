import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

const DeptCommissioner = () => {
    const [coData, setCoData] = useState([]);
    const [descData, setDescData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCommissioner, setSelectedCommissioner] = useState("");
    const [editData, setEditData] = useState({
        commissioner_name: "",
        description: "",
        language_code: "",
        coName: "",
        designation: "",
        qualification: "",
        address: "",
        number: "",
        email: "",
        imageFile: null
    });
    const [imagePreview, setImagePreview] = useState("");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchDescData();
        fetchCoData();
    }, []);

    useEffect(() => {
        const lightbox = GLightbox({
            selector: ".glightbox",
        });
        return () => {
            lightbox.destroy();
        };
    }, [coData]);

    const fetchDescData = async () => {
        try {
            const response = await api.get("/dept-commissioner-desc");
            setDescData(response.data);
        } catch (error) {
            toast.error("Failed to fetch Deputy Commissioner description data!");
        }
    };

    const fetchCoData = async () => {
        try {
            const response = await api.get("/dept-commissioner-details");
            setCoData(response.data);
        } catch (error) {
            toast.error("Failed to fetch Deputy Commissioner Details data!");
        }
    };

    useEffect(() => {
        if (descData.length > 0 && !selectedCommissioner) {
            const firstCommissioner = descData[0]?.commissioner_name;
            if (firstCommissioner) {
                setSelectedCommissioner(firstCommissioner);
            }
        }
    }, [descData]);

    const handleDelete = async (id, type) => {
        try {
            if (type === "history") {
                await api.post(`/delete-dept-commissioner-desc/${id}`);
                setDescData((prevData) => prevData.filter((item) => item.id !== id));
            } else if (type === "co") {
                await api.post(`/delete-dept-commissioner-details/${id}`);
                setCoData((prevData) => prevData.filter((item) => item.id !== id));
            }
            toast.success(
                `Deputy Commissioner Information deleted successfully!`
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the entry!");
        }
        closeModal();
    };

    const openEditModal = (item, type) => {
        setSelectedItem(item);
        setModalType(type);

        if (type === "history") {
            setEditData({
                commissioner_name: item.commissioner_name,
                description: item.description,
                language_code: item.language_code
            });
        } else {
            setEditData({
                ...item,
                imageFile: null
            });
            setImagePreview(`${baseURL}${item.image_path}`);
        }

        setShowEditModal(true);
    };

    const closeModal = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedItem(null);
        setEditData({
            commissioner_name: "",
            description: "",
            language_code: "",
            coName: "",
            designation: "",
            qualification: "",
            address: "",
            number: "",
            email: "",
            imageFile: null
        });
        setImagePreview("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setEditData(prev => ({ ...prev, imageFile: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        try {
            if (modalType === "history") {
                await api.post(`/edit-dept-commissioner-desc/${selectedItem.id}`, {
                    commissioner_name: editData.commissioner_name,
                    description: editData.description,
                    language_code: editData.language_code
                });
                fetchDescData();
                toast.success("Description updated successfully!");
            } else {
                const formData = new FormData();
                formData.append("coName", editData.coName);
                formData.append("designation", editData.designation);
                formData.append("qualification", editData.qualification);
                formData.append("address", editData.address);
                formData.append("number", editData.number);
                formData.append("email", editData.email);
                formData.append("language_code", editData.language_code);

                if (editData.imageFile) {
                    formData.append("coImage", editData.imageFile);
                }

                await api.post(`/edit-dept-commissioner-details/${selectedItem.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                fetchCoData();
                toast.success("Commissioner details updated successfully!");
            }
            closeModal();
            navigate("/deputy-commissioner");
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
                    error.response?.data?.message || "Failed to update the entry!",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }
            console.error(error);
        }
    };

    const filteredDescData = selectedCommissioner
        ? descData.filter(item => item.commissioner_name === selectedCommissioner)
        : [];

    const totalPages = Math.ceil(filteredDescData.length / itemsPerPage);
    const currentPageData = filteredDescData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="#">About UMC</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Deputy Commissioner
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row ">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Deputy Commissioner Details</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-dept-commissioner-details"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Details
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive m-t-10">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th className="text-center">Commissioner Image</th>
                                                    <th>Commissioner Name</th>
                                                    <th>Designation</th>
                                                    <th>Education Qualification</th>
                                                    <th>Office Address</th>
                                                    <th>Phone No.</th>
                                                    <th>Mail Id</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {coData.length > 0 ? (
                                                    coData.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td className="text-center">
                                                                <Link
                                                                    className="glightbox"
                                                                    to={`${baseURL}${item.image_path}`}
                                                                >
                                                                    <img
                                                                        src={`${baseURL}${item.image_path}`}
                                                                        alt={item.coName}
                                                                        style={{
                                                                            width: "80px",
                                                                            height: "80px",

                                                                        }}
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td>{item.coName}</td>
                                                            <td>{item.designation}</td>
                                                            <td>{item.qualification}</td>
                                                            <td>{item.address}</td>
                                                            <td>{item.number}</td>
                                                            <td>{item.email}</td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "co")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("co");
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
                                                        <td colSpan="9" className="text-center">No Deputy Commissioner Details Available</td>
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
                                            <h4 className="page-title">Deputy Commissioner Description</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-dept-commissioner-desc"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Desc
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <select
                                                className="form-control"
                                                value={selectedCommissioner}
                                                onChange={(e) => {
                                                    setSelectedCommissioner(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                disabled={descData.length === 0}
                                            >
                                                {descData.length > 0 ? (
                                                    [...new Set(descData.map(item => item.commissioner_name))]
                                                        .filter(name => name)
                                                        .map((name, index) => (
                                                            <option key={index} value={name}>
                                                                {name}
                                                            </option>
                                                        ))
                                                ) : (
                                                    <option value="">No commissioners available</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="table-responsive m-t-20">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Commissioner Description</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPageData.length > 0 ? (
                                                    currentPageData.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                                            <td>{item.description}</td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "history")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("history");
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
                                                        <td colSpan="3" className="text-center">
                                                            {descData.length === 0 ? "No data available" : "No descriptions for selected commissioner"}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4">
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
                                            {modalType === "history"
                                                ? "Edit Dy. Commissioner Description"
                                                : "Edit Dy. Commissioner Details"}
                                        </h5>
                                    </div>
                                    <div className="modal-body">
                                        {modalType === "history" ? (
                                            <>
                                                <div className="form-group">
                                                    <label>Commissioner</label>
                                                    <select
                                                        className="form-control"
                                                        name="commissioner_name"
                                                        value={editData.commissioner_name}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value="">Select Commissioner</option>
                                                        {coData.map(commissioner => (
                                                            <option key={commissioner.id} value={commissioner.coName}>
                                                                {commissioner.coName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Language</label>
                                                    <select
                                                        className="form-control"
                                                        name="language_code"
                                                        value={editData.language_code}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value="">Select Language</option>
                                                        <option value="en">English</option>
                                                        <option value="mr">Marathi</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Description</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="description"
                                                        value={editData.description}
                                                        onChange={handleInputChange}
                                                        rows="5"
                                                        required
                                                    />
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
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="" disabled>Select Language</option>
                                                        <option value="en">English</option>
                                                        <option value="mr">Marathi</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="coName">Commissioner Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="coName"
                                                        value={editData.coName}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="designation">Designation</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="designation"
                                                        value={editData.designation}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="qualification">Education Qualification</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="qualification"
                                                        value={editData.qualification}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="address">Office Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="address"
                                                        value={editData.address}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="number">Contact Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="number"
                                                        value={editData.number}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Mail ID</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        value={editData.email}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="coImage">Commissioner Image</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        name="coImage"
                                                        accept="image/*"
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
                                                            }}
                                                        />
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

export default DeptCommissioner;