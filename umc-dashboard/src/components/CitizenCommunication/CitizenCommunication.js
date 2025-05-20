import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { getImageValidationError } from "../../validation/ImageValidation";

const CitizenCommunication = () => {
    const [portalData, setPortalData] = useState([]);
    const [emergencyData, setEmergencyData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData, setEditData] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPortalData();
        fetchEmergencyData();
    }, []);

    useEffect(() => {
        const lightbox = GLightbox({
            selector: ".glightbox",
        });
        return () => {
            lightbox.destroy();
        };
    }, [portalData, emergencyData]);

    const fetchPortalData = async () => {
        try {
            const response = await api.get("/portal-services");
            setPortalData(response.data);
        } catch (error) {
            toast.error("Failed to fetch portal data!");
        }
    };

    const fetchEmergencyData = async () => {
        try {
            const response = await api.get("/emergency-services");
            setEmergencyData(response.data);
        } catch (error) {
            toast.error("Failed to fetch emergency data!");
        }
    };

    const handleDelete = async (id, type) => {
        try {
            if (type === "portal") {
                await api.post(`/delete-portal-services/${id}`);
                setPortalData((prevData) => prevData.filter((item) => item.id !== id));
            } else if (type === "emergency") {
                await api.post(`/delete-emergency-services/${id}`);
                setEmergencyData((prevData) => prevData.filter((item) => item.id !== id));
            }
            toast.success(
                `${type === "portal" ? "Portal Service" : "Emergency Service"} deleted successfully!`
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the entry!");
        }
        closeModal();
    };

    const openEditModal = (item, type) => {
        setSelectedItem(item);
        setEditData(
            type === "portal" ? { ...item } : { ...item }
        );
        setImagePreview(type === "emergency" ? `${baseURL}/${item.main_icon_path}` : `${baseURL}/${item.main_icon_path}`);
        setModalType(type);
        setShowEditModal(true);
        setErrors({});
    };

    const closeModal = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedItem(null);
        setEditData({});
        setImagePreview("");
        setErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
const validateForm = () => {
    const newErrors = {};

    if (modalType === "portal") {
        if (!editData.heading?.trim()) newErrors.heading = "Service Heading is required.";
        if (!editData.description?.trim()) newErrors.description = "Service Description is required.";
        if (!editData.link?.trim()) newErrors.link = "Service Link is required.";
        if (!editData.language_code) newErrors.language_code = "Language selection is required.";
    } else if (modalType === "emergency") {
        if (!editData.heading?.trim()) newErrors.heading = "Service Heading is required.";
        if (!editData.number?.trim()) newErrors.number = "Service Number is required.";
        if (!editData.language_code) newErrors.language_code = "Language selection is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
        toast.error("Please fix errors before submitting.", {
            position: "top-right",
            autoClose: 3000,
        });
    }

    return Object.keys(newErrors).length === 0;
};

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const errorMessage = getImageValidationError(file);
        if (errorMessage) {
            setErrors({ ...errors, imageFile: errorMessage });
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setEditData({ ...editData, imageFile: file });
            setErrors({ ...errors, imageFile: "" });
        };
        reader.readAsDataURL(file);
    } else {
        setErrors({ ...errors, imageFile: "Image is required" });
        toast.error("Image is required", {
            position: "top-right",
            autoClose: 3000,
        });
    }
};

const handleSaveChanges = async () => {
    if (!validateForm()) {
        return;
    }

    if (errors.imageFile || errors.heading || errors.description || errors.link || errors.number || errors.language_code) {
        toast.error("Please fix errors before submitting.", {
            position: "top-right",
            autoClose: 3000,
        });
        return;
    }

    try {
        const formData = new FormData();
        formData.append("heading", editData.heading);

        if (modalType === "portal") {
            formData.append("description", editData.description);
            formData.append("link", editData.link);
        } else if (modalType === "emergency") {
            formData.append("number", editData.number);
        }

        formData.append("language_code", editData.language_code);

        if (editData.imageFile) {
            formData.append(
                modalType === "portal" ? "portalImage" : "emergencyImage",
                editData.imageFile
            );
        }

        await api.post(
            `/${modalType === "portal" ? "edit-portal-services" : "edit-emergency-services"}/${selectedItem.id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (modalType === "portal") {
            fetchPortalData();
        } else {
            fetchEmergencyData();
        }

        toast.success(
            `${modalType === "portal" ? "Portal Services" : "Emergency Services"} updated successfully!`,
            {
                position: "top-right",
                autoClose: 3000,
            }
        );
        closeModal();
    } catch (error) {
        console.error(error);
        toast.error("Failed to update the entry!", {
            position: "top-right",
            autoClose: 3000,
        });
    }
};


    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="#">Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Citizen Communication
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Portal Services</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-portal-services"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Service
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Servcie Heading</th>
                                                    <th>Servcie Description</th>
                                                    <th>Servcie Link</th>
                                                    <th className="text-center">Servcie Image</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {portalData.length > 0 ? (
                                                    portalData.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{item.heading}</td>
                                                            <td>{item.description}</td>
                                                            <td>
                                                                <Link to={item.link} className="text-decoration-none" target="_blank" style={{ color: "#000" }}>
                                                                    {item.link}
                                                                </Link>
                                                            </td>
                                                            <td className="text-center">
                                                                <Link
                                                                    className="glightbox"
                                                                    to={`${baseURL}/${item.main_icon_path}`}
                                                                >
                                                                    <img
                                                                        src={`${baseURL}/${item.main_icon_path}`}
                                                                        alt={item.heading}
                                                                        style={{
                                                                            width: "50px",
                                                                            height: "50px",
                                                                        }}
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "portal")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("portal");
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
                                                        <td colSpan="6">No Portal Service Data Available</td>
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
                                            <h4 className="page-title">Emergency Services</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-emergency-services"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Service
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive m-t-10">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Servcie Heading</th>
                                                    <th>Servcie Number</th>
                                                    <th className="text-center">Servcie Image</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {emergencyData.length > 0 ? (
                                                    emergencyData.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{item.heading}</td>
                                                            <td>
                                                                <Link to={`tel:${item.number}`} className="text-decoration-none" style={{ color: "#000" }}>
                                                                    {item.number}
                                                                </Link>
                                                            </td>
                                                            <td className="text-center">
                                                                <Link
                                                                    className="glightbox"
                                                                    to={`${baseURL}/${item.main_icon_path}`}
                                                                >
                                                                    <img
                                                                        src={`${baseURL}/${item.main_icon_path}`}
                                                                        alt={item.heading}
                                                                        style={{
                                                                            width: "50px",
                                                                            height: "50px",
                                                                        }}
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "emergency")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("emergency");
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
                                                        <td colSpan="5">No Emergency Service Data Available</td>
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
                                            {modalType === "portal"
                                                ? "Edit Portal Services"
                                                : "Edit Emergency Services"}
                                        </h5>
                                    </div>
                                    <div className="modal-body">
                                        {modalType === "portal" ? (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="language_code">
                                                        Select Language <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className={`form-control ${errors.language_code ? 'is-invalid' : ''}`}
                                                        id="language_code"
                                                        value={editData.language_code}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                language_code: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Select Language</option>
                                                        <option value="en">English</option>
                                                        <option value="mr">Marathi</option>
                                                    </select>
                                                    {errors.language_code && <div className="invalid-feedback">{errors.language_code}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="heading">Service Heading <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.heading ? 'is-invalid' : ''}`}
                                                        id="heading"
                                                        value={editData.heading}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="description">Description <span className="text-danger">*</span></label>
                                                    <textarea
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                        id="description"
                                                        value={editData.description}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="link">Service Link <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.link ? 'is-invalid' : ''}`}
                                                        id="link"
                                                        value={editData.link}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                link: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    {errors.link && <div className="invalid-feedback">{errors.link}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="portalImage">Service Image</label>
                                                    <input
                                                        type="file"
                                                        className={`form-control ${errors.imageFile ? 'is-invalid' : ''}`}
                                                        id="portalImage"
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleImageChange}
                                                        ref={fileInputRef}
                                                    />
                                                    {errors.imageFile && <div className="invalid-feedback">{errors.imageFile}</div>}
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
                                        ) : (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="language_code">
                                                        Select Language <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className={`form-control ${errors.language_code ? 'is-invalid' : ''}`}
                                                        id="language_code"
                                                        value={editData.language_code}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                language_code: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Select Language</option>
                                                        <option value="en">English</option>
                                                        <option value="mr">Marathi</option>
                                                    </select>
                                                    {errors.language_code && <div className="invalid-feedback">{errors.language_code}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="heading">Service Heading <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.heading ? 'is-invalid' : ''}`}
                                                        id="heading"
                                                        value={editData.heading}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="number">Service Number <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                                                        id="number"
                                                        value={editData.number}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                number: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    {errors.number && <div className="invalid-feedback">{errors.number}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="emergencyImage">Service Image</label>
                                                    <input
                                                        type="file"
                                                        className={`form-control ${errors.imageFile ? 'is-invalid' : ''}`}
                                                        id="emergencyImage"
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleImageChange}
                                                        ref={fileInputRef}
                                                    />
                                                    {errors.imageFile && <div className="invalid-feedback">{errors.imageFile}</div>}
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
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CitizenCommunication;