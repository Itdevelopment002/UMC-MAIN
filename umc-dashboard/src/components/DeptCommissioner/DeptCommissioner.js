import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import CKEditorComponent from "../CKEditorComponent/CKEditorComponent";

const DeptCommissioner = () => {
    const [coData, setCoData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData, setEditData] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoData();
    }, []);

    useEffect(() => {
        const lightbox = GLightbox({
            selector: ".glightbox",
        });
        return () => lightbox.destroy();
    }, [coData]);

    const fetchCoData = async () => {
        try {
            const response = await api.get("/dept-commissioner-data");
            setCoData(response.data);
        } catch (error) {
            toast.error("Failed to fetch Additional Commissioner Details data!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.post(`/delete-dept-commissioner-data/${id}`);
            setCoData((prevData) => prevData.filter((item) => item.id !== id));
            toast.success(
                `Deputy Commissioner Data deleted successfully!`
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
            { ...item }
        );
        setImagePreview(`${baseURL}${item.image_path}`);
        setShowEditModal(true);
    };

    const closeModal = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedItem(null);
        setEditData({});
        setImagePreview("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setEditData({ ...editData, imageFile: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append("coName", editData.coName);
            formData.append("designation", editData.designation);
            formData.append("qualification", editData.qualification);
            formData.append("address", editData.address);
            formData.append("number", editData.number);
            formData.append("email", editData.email);
            formData.append("description", editData.description);
            formData.append("language_code", editData.language_code);

            if (editData.imageFile) {
                formData.append("coImage", editData.imageFile);
            }

            await api.post(`/edit-dept-commissioner-data/${selectedItem.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setCoData(
                coData.map((item) =>
                    item.id === selectedItem.id ? { ...item, ...editData } : item
                )
            );
            fetchCoData();
            toast.success('Deputy Commissioner Information update suceessfully');
            navigate('/deputy-commissioner');
        } catch (error) {
            console.error(error);
            toast.error("Failed to update the entry!");
        } finally {
            closeModal();
        }
    };

    const stripHtml = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    const truncatedText = (html, maxLength = 100) => {
        const text = stripHtml(html);
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
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
                                            <h4 className="page-title">Deputy Commissioner Data</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-dept-commissioner-data"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Data
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive m-t-10">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "5%" }} className="text-center">Sr. No.</th>
                                                    <th style={{ width: "10%" }} className="text-center">Commissioner Image</th>
                                                    <th style={{ width: "10%" }}>Commissioner Name</th>
                                                    <th style={{ width: "10%" }}>Designation</th>
                                                    <th style={{ width: "10%" }}>Education Qualification</th>
                                                    <th style={{ width: "10%" }}>Office Address</th>
                                                    <th style={{ width: "10%" }}>Phone No.</th>
                                                    <th style={{ width: "10%" }}>Mail Id</th>
                                                    <th style={{ width: "25%" }}>Commissioner Description</th>
                                                    <th style={{ width: "10%" }} className="text-center">Action</th>
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
                                                            <td style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{item.coName}</td>
                                                            <td style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{item.designation}</td>
                                                            <td style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{item.qualification}</td>
                                                            <td style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{item.address}</td>
                                                            <td style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{item.number}</td>
                                                            <td style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{item.email}</td>
                                                            <td style={{ width: "25%", wordBreak: "break-word", whiteSpace: "normal" }}>
                                                                {truncatedText(item.description, 100)}
                                                            </td>                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "co")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
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
                                                        <td colSpan="10" className="text-center">No Deputy Commissioner Data Available</td>
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
                                            Edit Commissioner Data
                                        </h5>
                                    </div>
                                    <div className="modal-body">
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="language_code">
                                                    Select Language
                                                </label>

                                                <select
                                                    className="form-control"
                                                    name="language_code"
                                                    value={editData.language_code}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
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
                                                <label htmlFor="coName">Commissioner Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="coName"
                                                    value={editData.coName}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, coName: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="designation">Designation</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="designation"
                                                    value={editData.designation}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, designation: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="qualification">Education Qualification</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="qualification"
                                                    value={editData.qualification}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, qualification: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address">Office Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="address"
                                                    value={editData.address}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, address: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="number">Contact Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="number"
                                                    value={editData.number}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, number: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Mail ID</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    value={editData.email}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, email: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Commissioner Description</label>
                                                <CKEditorComponent
                                                    value={editData.description}
                                                    onChange={(value) =>
                                                        setEditData({ ...editData, description: value })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="coImage">Commissioner Image</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="coImage"
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
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-sm btn-secondary" onClick={closeModal}>
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-sm btn-primary" onClick={handleSaveChanges}>
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
                                            onClick={() => handleDelete(selectedItem.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    }
                </div >
            </div >
            <ToastContainer />
        </div >
    );
};

export default DeptCommissioner;