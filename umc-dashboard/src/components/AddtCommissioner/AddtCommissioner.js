import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

const AddtCommissioner = () => {
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
        fetchData();
    }, []);

    useEffect(() => {
        const lightbox = GLightbox({
            selector: ".glightbox",
        });
        return () => lightbox.destroy();
    }, [coData]);

    const fetchData = async () => {
        try {
            const [descResponse, coResponse] = await Promise.all([
                api.get("/addt-commissioner-desc"),
                api.get("/addt-commissioner-details")
            ]);
            setDescData(descResponse.data);
            setCoData(coResponse.data);
        } catch (error) {
            toast.error("Failed to fetch data!");
            console.error(error);
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
            const endpoint = type === "history"
                ? `/delete-addt-commissioner-desc/${id}`
                : `/delete-addt-commissioner-details/${id}`;

            await api.post(endpoint);

            if (type === "history") {
                setDescData(prev => prev.filter(item => item.id !== id));
            } else {
                setCoData(prev => prev.filter(item => item.id !== id));
            }

            toast.success("Deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete!");
            console.error(error);
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
                await api.post(`/edit-addt-commissioner-desc/${selectedItem.id}`, editData);
                fetchData();
                toast.success("Description updated successfully!");
            } else {
                const formData = new FormData();
                Object.entries(editData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formData.append(key, value);
                    }
                });

                await api.post(`/edit-addt-commissioner-details/${selectedItem.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                fetchData();
                toast.success("Commissioner details updated successfully!");
            }
            closeModal();
        } catch (error) {
            toast.error("Failed to update!");
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
        <div className="page-wrapper">
            <div className="content">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="#">About UMC</Link></li>
                        <li className="breadcrumb-item active">Additional Commissioner</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card-box">
                            <div className="card-block">
                                <div className="row">
                                    <div className="col-sm-4 col-3">
                                        <h4 className="page-title">Additional Commissioner Details</h4>
                                    </div>
                                    <div className="col-sm-8 col-9 text-right m-b-20">
                                        <Link to="/add-addt-commissioner-details" className="btn btn-primary btn-rounded float-right">
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
                                                <th>Email id</th>
                                                <th width="15%" className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {coData.length > 0 ? (
                                                coData.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td className="text-center">{index + 1}</td>
                                                        <td className="text-center">
                                                            <Link className="glightbox" to={`${baseURL}${item.image_path}`}>
                                                                <img src={`${baseURL}${item.image_path}`} alt={item.coName}
                                                                    style={{ width: "80px", height: "80px" }} />
                                                            </Link>
                                                        </td>
                                                        <td>{item.coName}</td>
                                                        <td>{item.designation}</td>
                                                        <td>{item.qualification}</td>
                                                        <td>{item.address}</td>
                                                        <td>{item.number}</td>
                                                        <td>{item.email}</td>
                                                        <td className="text-center">
                                                            <button onClick={() => openEditModal(item, "co")}
                                                                className="btn btn-success btn-sm m-t-10">
                                                                Edit
                                                            </button>
                                                            <button onClick={() => {
                                                                setSelectedItem(item);
                                                                setModalType("co");
                                                                setShowDeleteModal(true);
                                                            }} className="btn btn-danger btn-sm m-t-10">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="9" className="text-center">No Data Available</td>
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
                                        <h4 className="page-title">Additional Commissioner Description</h4>
                                    </div>
                                    <div className="col-sm-8 col-9 text-right m-b-20">
                                        <Link to="/add-addt-commissioner-desc" className="btn btn-primary btn-rounded float-right">
                                            <i className="fa fa-plus"></i> Add Description
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
                                                <th>Description</th>
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
                                                            <button onClick={() => openEditModal(item, "history")}
                                                                className="btn btn-success btn-sm m-t-10">
                                                                Edit
                                                            </button>
                                                            <button onClick={() => {
                                                                setSelectedItem(item);
                                                                setModalType("history");
                                                                setShowDeleteModal(true);
                                                            }} className="btn btn-danger btn-sm m-t-10">
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

                                {totalPages > 1 && (
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {showEditModal && (
                    <div className="modal fade show" style={{
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
                                            ? "Edit Commissioner Description"
                                            : "Edit Commissioner Details"}
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
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Name</label>
                                                        <input type="text" className="form-control"
                                                            name="coName" value={editData.coName}
                                                            onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Designation</label>
                                                        <input type="text" className="form-control"
                                                            name="designation" value={editData.designation}
                                                            onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Qualification</label>
                                                        <input type="text" className="form-control"
                                                            name="qualification" value={editData.qualification}
                                                            onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Language</label>
                                                        <select className="form-control"
                                                            name="language_code" value={editData.language_code}
                                                            onChange={handleInputChange} required>
                                                            <option value="">Select Language</option>
                                                            <option value="en">English</option>
                                                            <option value="mr">Marathi</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Address</label>
                                                <input type="text" className="form-control"
                                                    name="address" value={editData.address}
                                                    onChange={handleInputChange} required />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Phone</label>
                                                        <input type="text" className="form-control"
                                                            name="number" value={editData.number}
                                                            onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Email</label>
                                                        <input type="email" className="form-control"
                                                            name="email" value={editData.email}
                                                            onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Image</label>
                                                <input type="file" className="form-control"
                                                    accept="image/*" onChange={handleImageChange} />
                                                {imagePreview && (
                                                    <img src={imagePreview} alt="Preview"
                                                        style={{ width: "100px", height: "100px", marginTop: "10px" }} />
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="modal fade show" style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        overflowY: "scroll",
                        scrollbarWidth: "none",
                    }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body text-center">
                                    <h5>Are you sure you want to delete this item?</h5>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-danger"
                                        onClick={() => handleDelete(selectedItem.id, modalType)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddtCommissioner;