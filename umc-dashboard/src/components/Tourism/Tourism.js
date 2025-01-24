import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import api, { baseURL } from "../api";

const Tourism = () => {
    const [gardensData, setGardensData] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    // const [selectedGarden, setSelectedGarden] = useState(null);
    // const [selectedFiles, setSelectedFiles] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedGarden, setSelectedGarden] = useState({ main_image: null });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [objectURLs, setObjectURLs] = useState({ mainImageURL: null, galleryURLs: [] });

    const handleMainImageChange = (e) => {
        const newMainImage = e.target.files[0];
        if (newMainImage) {
            setSelectedGarden({ ...selectedGarden, main_image: newMainImage });

            // Revoke previous URL and set new one
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

            // Cleanup existing gallery URLs
            objectURLs.galleryURLs.forEach((url) => URL.revokeObjectURL(url));

            // Create new URLs for gallery
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

        // Revoke the URL for the removed file
        URL.revokeObjectURL(objectURLs.galleryURLs[index]);

        setSelectedFiles(updatedFiles);
        setObjectURLs((prev) => ({
            ...prev,
            galleryURLs: prev.galleryURLs.filter((_, i) => i !== index),
        }));
    };

    useEffect(() => {
        // Cleanup object URLs on unmount
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

        // Safely parse gallery images, fallback to an empty array if parsing fails or if gallery is undefined
        try {
            const parsedImages = garden.gallery ? JSON.parse(garden.gallery) : [];
            setCurrentImages(parsedImages);
        } catch (error) {
            console.error("Error parsing gallery images:", error);
            setCurrentImages([]); // Fallback to an empty array if parsing fails
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

            // Append basic details
            formData.append("name", selectedGarden.name);
            formData.append("address", selectedGarden.address);
            formData.append("hours", selectedGarden.hours);
            formData.append("description", selectedGarden.description);
            formData.append("locationLink", selectedGarden.location_link);

            // Handle main image
            if (selectedGarden?.main_image) {
                formData.append("main_image", selectedGarden.main_image); // Add main image if it exists
            }

            // Handle existing images
            currentImages.forEach((img) => {
                if (!removedImages.includes(img)) {
                    formData.append("gallery", img); // Include retained images
                }
            });

            // Handle newly added images
            selectedFiles.forEach((file) => {
                formData.append("gallery", file); // Include new images
            });

            // API call to update the data
            await api.put(`/tourism/${selectedGarden.id}`, formData);

            // Fetch updated list
            const response = await api.get("/tourism");
            setGardensData(response.data);

            // Close modal
            setShowEditModal(false);
        } catch (error) {
            console.error("Error saving garden changes:", error);
        }
    };

    // const handleMainImageChange = (e) => {
    //     const newMainImage = e.target.files[0];
    //     if (newMainImage) {
    //         setSelectedFiles([newMainImage, ...selectedFiles]); 
    //     }
    // };


    // const handleRemoveMainImage = () => {
    //     setSelectedGarden({
    //         ...selectedGarden,
    //         main_image: null, // Clear the main image
    //     });
    // };



    // const handleFileChange = (e) => {
    //     setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
    // };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/tourism/${selectedGarden.id}`);
            setGardensData(
                gardensData.filter((garden) => garden.id !== selectedGarden.id)
            );
            handleCloseDeleteModal();
        } catch (error) {
            console.error("Error deleting garden:", error);
        }
    };

    // const handleRemoveImage = (image) => {
    //     if (currentImages.includes(image)) {
    //         setRemovedImages([...removedImages, image]);
    //         setCurrentImages(currentImages.filter((img) => img !== image));
    //     } else {
    //         setSelectedFiles(
    //             selectedFiles.filter((file) => file.name !== image.name)
    //         );
    //     }
    // };

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
                                                    <th width="5%">Sr. No.</th>
                                                    <th>Name</th>
                                                    <th>Address</th>
                                                    <th>Hours</th>
                                                    <th>Description</th>
                                                    <th>Location Link</th>
                                                    <th>Main Image</th>
                                                    <th>Gallery</th>
                                                    <th width="15%">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedData.map((tourism, index) => (
                                                    <tr key={tourism.id}>
                                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                        <td>{tourism.name}</td>
                                                        <td>{tourism.address}</td>
                                                        <td>{tourism.hours}</td>
                                                        <td>{tourism.description}</td>
                                                        <td>
                                                            <Link href={tourism.location_link} target="_blank" rel="noopener noreferrer">
                                                                {tourism.location_link}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <img
                                                                src={`${baseURL}${tourism.main_image}`}
                                                                alt="Main"
                                                                style={{ width: "50px", height: "50px" }}
                                                            />
                                                        </td>

                                                        <td>
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
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                onClick={() => handleEdit(tourism)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger mx-1"
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
                            </div>
                        </div>
                    </div>

                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <Link
                                className="page-link"
                                to="#"
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </Link>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li
                                key={index + 1}
                                className={`page-item ${currentPage === index + 1 ? "active" : ""
                                    }`}
                            >
                                <Link
                                    className="page-link"
                                    to="#"
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Link>
                            </li>
                        ))}
                        <li
                            className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                }`}
                        >
                            <Link
                                className="page-link"
                                to="#"
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </Link>
                        </li>
                    </ul>

                    {/* Delete Modal */}
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

                    {/* Edit Modal */}
                    {/* Edit Modal */}
                    {/* <div
                        className={`modal fade ${showEditModal ? "show" : ""}`}
                        id="editModal"
                        tabIndex="-1"
                        aria-labelledby="editModalLabel"
                        aria-hidden={!showEditModal}
                        style={{ display: showEditModal ? "block" : "none" }} // This forces the modal to be shown/hidden
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
                                        onClick={handleCloseEditModal}  // Close the modal on click
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div
                                    className="modal-body"
                                    style={{
                                        maxHeight: "500px", // Adjust this value as needed
                                        overflowY: "auto",  // Enable vertical scrolling
                                    }}
                                >
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
                                            {selectedGarden?.main_image && (
                                                <div className="position-relative">
                                                    <img
                                                        src={`${baseURL}${selectedGarden.main_image}`}
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
                                                        onClick={() => handleRemoveMainImage()}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                onChange={handleMainImageChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Gallery</label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Images</label>
                                        <div className="d-flex flex-wrap">
                                            {currentImages.map((img, index) => (
                                                <div key={index} className="position-relative me-2">
                                                    <img
                                                        src={`${baseURL}${img}`}
                                                        alt="Gallery"
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                            marginRight: "5px",
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                        onClick={() => handleRemoveImage(img)}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseEditModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSaveEdit}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div
                        className={`modal fade ${showEditModal ? "show" : ""}`}
                        id="editModal"
                        tabIndex="-1"
                        aria-labelledby="editModalLabel"
                        aria-hidden={!showEditModal}
                        style={{ display: showEditModal ? "block" : "none" }} // This forces the modal to be shown/hidden
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
                                        onClick={handleCloseEditModal}  // Close the modal on click
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div
                                    className="modal-body"
                                    style={{
                                        maxHeight: "500px", // Adjust this value as needed
                                        overflowY: "auto",  // Enable vertical scrolling
                                    }}
                                >
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
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Gallery</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="form-control"
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
                                        className="btn btn-secondary"
                                        onClick={handleCloseEditModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSaveEdit}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>









                </div>
            </div>
        </>
    );
};

export default Tourism;
