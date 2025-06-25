import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURL } from "../api";

const Tourism = () => {
    const [gardensData, setGardensData] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGarden, setSelectedGarden] = useState({ main_image: null });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [objectURLs, setObjectURLs] = useState({ mainImageURL: null, galleryURLs: [] });
    const itemsPerPage = 5;

    const handleMainImageChange = (e) => {
        const newMainImage = e.target.files[0];
        if (newMainImage) {
            setSelectedGarden({ ...selectedGarden, main_image: newMainImage });
            if (objectURLs.mainImageURL) {
                URL.revokeObjectURL(objectURLs.mainImageURL);
            }
            setObjectURLs((prev) => ({
                ...prev,
                mainImageURL: URL.createObjectURL(newMainImage),
            }));
        }
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length > 0) {
            setSelectedFiles(newFiles);

            objectURLs.galleryURLs.forEach((url) => URL.revokeObjectURL(url));

            setObjectURLs((prev) => ({
                ...prev,
                galleryURLs: newFiles.map((file) => URL.createObjectURL(file)),
            }));
        }
    };

    const handleRemoveMainImage = () => {
        if (objectURLs.mainImageURL) {
            URL.revokeObjectURL(objectURLs.mainImageURL);
        }
        setSelectedGarden({ ...selectedGarden, main_image: null });
        setObjectURLs((prev) => ({ ...prev, mainImageURL: null }));
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        URL.revokeObjectURL(objectURLs.galleryURLs[index]);
        setSelectedFiles(updatedFiles);
        setObjectURLs((prev) => ({
            ...prev,
            galleryURLs: prev.galleryURLs.filter((_, i) => i !== index),
        }));
    };

    useEffect(() => {
        return () => {
            if (objectURLs.mainImageURL) {
                URL.revokeObjectURL(objectURLs.mainImageURL);
            }
            objectURLs.galleryURLs.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [objectURLs]);

    useEffect(() => {
        const lightbox = GLightbox({ selector: ".glightbox" });
        return () => lightbox.destroy();
    }, [gardensData]);

    useEffect(() => {
        const fetchGardens = async () => {
            try {
                const response = await api.get("/tourism");
                setGardensData(response.data);
            } catch (error) {
                console.error("Error fetching tourism data:", error);
            }
        };
        fetchGardens();
    }, []);

    const handleDelete = (garden) => {
        setSelectedGarden(garden);
        setShowDeleteModal(true);
    };

    const handleEdit = (garden) => {
        setSelectedGarden(garden);
        setSelectedFiles([]);
        try {
            const parsedImages = garden.gallery ? JSON.parse(garden.gallery) : [];
            setCurrentImages(parsedImages);
        } catch (error) {
            console.error("Error parsing gallery images:", error);
            setCurrentImages([]);
        }
        setRemovedImages([]);
        setShowEditModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedGarden(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedGarden(null);
        setSelectedFiles([]);
        setCurrentImages([]);
        setRemovedImages([]);
    };

    const handleSaveEdit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", selectedGarden.name);
            formData.append("address", selectedGarden.address);
            formData.append("hours", selectedGarden.hours);
            formData.append("description", selectedGarden.description);
            formData.append("locationLink", selectedGarden.location_link);
            formData.append("language_code", selectedGarden.language_code);
            if (selectedGarden?.main_image) {
                formData.append("main_image", selectedGarden.main_image);
            }

            currentImages.forEach((img) => {
                if (!removedImages.includes(img)) {
                    formData.append("gallery", img);
                }
            });

            selectedFiles.forEach((file) => {
                formData.append("gallery", file);
            });
            await api.post(`/edit-tourism/${selectedGarden.id}`, formData);
            const response = await api.get("/tourism");
            setGardensData(response.data);
            toast.success("Tourism data added successfully!")
            setShowEditModal(false);
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
                    error.response?.data?.message || "Failed to add tourism data. Please try again.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
            }
            console.error("Failed to add tourism data:", error);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.post(`/delete-tourism/${selectedGarden.id}`);
            setGardensData(
                gardensData.filter((garden) => garden.id !== selectedGarden.id)
            );
            handleCloseDeleteModal();
        } catch (error) {
            console.error("Error deleting garden:", error);
        }
    };

    const totalPages = Math.ceil(gardensData.length / itemsPerPage);
    const paginatedData = gardensData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="#">About UMC</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Tourism
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Tourism</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-tourism"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Tourism
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '5%' }} className="text-center">Sr. No.</th>
                                                    <th style={{ width: '10%' }}>Name</th>
                                                    <th style={{ width: '15%' }}>Address</th>
                                                    <th style={{ width: '5%' }}>Hours</th>
                                                    <th style={{ width: '20%' }}>Description</th>
                                                    <th style={{ width: '10%' }}>Location Link</th>
                                                    <th style={{ width: '15%' }} className="text-center">Main Image</th>
                                                    <th style={{ width: '20%' }} className="text-center">Gallery</th>
                                                    <th style={{ width: '10%' }} className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedData.map((tourism, index) => (
                                                    <tr key={tourism.id}>
                                                        <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                        <td>{tourism.name}</td>
                                                        <td>{tourism.address}</td>
                                                        <td>{tourism.hours}</td>
                                                        <td>
                                                            {tourism.description.length > 100
                                                                ? `${tourism.description.slice(0, 100)}...`
                                                                : tourism.description}
                                                        </td>

                                                        <td>
                                                            <Link to={tourism.location_link} target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>
                                                                {tourism.location_link}
                                                            </Link>
                                                        </td>
                                                        <td className="text-center">
                                                            <img
                                                                src={`${baseURL}${tourism.main_image}`}
                                                                alt="Main"
                                                                style={{ width: "50px", height: "50px" }}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="d-flex flex-wrap">
                                                                {JSON.parse(tourism.gallery).map((img, imgIndex) => (
                                                                    <div key={imgIndex} className="position-relative me-2">
                                                                        <img
                                                                            src={`${baseURL}${img}`}
                                                                            alt="Gallery"
                                                                            style={{ width: "50px", height: "50px", marginRight: "5px" }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                className="btn btn-success btn-sm m-t-10"
                                                                onClick={() => handleEdit(tourism)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm m-t-10"
                                                                onClick={() => handleDelete(tourism)}
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

                    <div
                        className={`modal fade ${showDeleteModal ? "show" : ""}`}
                        style={{ display: showDeleteModal ? "block" : "none" }}
                    >
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body text-center">
                                    <h5>Are you sure you want to delete this item?</h5>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={handleCloseDeleteModal}
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

                    <div
                        className={`modal fade ${showEditModal ? "show" : ""}`}
                        id="editModal"
                        tabIndex="-1"
                        aria-labelledby="editModalLabel"
                        aria-hidden={!showEditModal}
                        style={{ display: showEditModal ? "block" : "none" }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="editModalLabel">
                                        Edit Tourism
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseEditModal}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div
                                    className="modal-body"
                                    style={{
                                        maxHeight: "500px",
                                        overflowY: "auto",
                                        scrollbarWidth: "thin"
                                    }}
                                >
                                    <div className="form-group">
                                        <label>
                                            Select Language
                                        </label>
                                        <select
                                            className="form-control"
                                            value={selectedGarden?.language_code || ""}
                                            onChange={(e) =>
                                                setSelectedGarden({
                                                    ...selectedGarden,
                                                    language_code: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="" disabled>Select Language</option>
                                            <option value="en">English</option>
                                            <option value="mr">Marathi</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedGarden?.name || ""}
                                            onChange={(e) =>
                                                setSelectedGarden({
                                                    ...selectedGarden,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedGarden?.address || ""}
                                            onChange={(e) =>
                                                setSelectedGarden({
                                                    ...selectedGarden,
                                                    address: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Hours</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedGarden?.hours || ""}
                                            onChange={(e) =>
                                                setSelectedGarden({
                                                    ...selectedGarden,
                                                    hours: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={selectedGarden?.description || ""}
                                            onChange={(e) =>
                                                setSelectedGarden({
                                                    ...selectedGarden,
                                                    description: e.target.value,
                                                })
                                            }
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Location Link</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedGarden?.location_link || ""}
                                            onChange={(e) =>
                                                setSelectedGarden({
                                                    ...selectedGarden,
                                                    location_link: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Main Image</label>
                                        <div className="d-flex flex-column">
                                            {objectURLs.mainImageURL && (
                                                <div className="position-relative">
                                                    <img
                                                        src={objectURLs.mainImageURL}
                                                        alt="Main"
                                                        style={{
                                                            width: "150px",
                                                            height: "150px",
                                                            marginBottom: "10px",
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                        onClick={handleRemoveMainImage}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                onChange={handleMainImageChange}
                                                className="form-control"
                                                accept="image/*"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Gallery</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="form-control"
                                                accept="image/*"
                                            />
                                            <div className="d-flex flex-wrap mt-2">
                                                {objectURLs.galleryURLs.map((url, index) => (
                                                    <div key={index} className="position-relative me-2">
                                                        <img
                                                            src={url}
                                                            alt={`Gallery ${index}`}
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                                marginRight: "5px",
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                            onClick={() => handleRemoveImage(index)}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={handleCloseEditModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={handleSaveEdit}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default Tourism;
