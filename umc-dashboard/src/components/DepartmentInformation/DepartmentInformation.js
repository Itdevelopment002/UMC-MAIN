import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

const DepartmentInformation = () => {
    const [selectedDepartmentDescription, setSelectedDepartmentDescription] = useState("");
    const [selectedDepartmentPdf, setSelectedDepartmentPdf] = useState("");
    const [bannerData, setBannerData] = useState([]);
    const [descriptionData, setDescriptionData] = useState([]);
    const [hodData, setHodData] = useState([]);
    const [pdfData, setPdfData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData, setEditData] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [bannerCurrentPage, setBannerCurrentPage] = useState(1);
    const [descriptionCurrentPage, setDescriptionCurrentPage] = useState(1);
    const [hodCurrentPage, setHodCurrentPage] = useState(1);
    const [pdfCurrentPage, setPdfCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
        fetchBannerData();
        fetchDescriptionData();
        fetchHodData();
        fetchPdfData();
    }, []);

    useEffect(() => {
        const lightbox = GLightbox({
            selector: ".glightbox",
        });
        return () => {
            lightbox.destroy();
        };
    }, [hodData, bannerData]);

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/department-info");
            const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
            setDepartments(sortedData);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchBannerData = async () => {
        try {
            const response = await api.get("/department-banner");
            const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setBannerData(sortedData);
        } catch (error) {
            toast.error("Failed to fetch banner data!");
        }
    };

    const fetchDescriptionData = async () => {
        try {
            const response = await api.get("/department-description");
            const sortedData = response.data.sort((a, b) => a.department.localeCompare(b.department));
            setDescriptionData(sortedData);
        } catch (error) {
            toast.error("Failed to fetch description data!");
        }
    };

    const fetchHodData = async () => {
        try {
            const response = await api.get("/hod-details");
            const sortedData = response.data.sort((a, b) => a.designation.localeCompare(b.designation));
            setHodData(sortedData);
        } catch (error) {
            toast.error("Failed to fetch hod data!");
        }
    };

    const fetchPdfData = async () => {
        try {
            const response = await api.get("/department-pdfs");
            const sortedData = response.data.sort((a, b) => a.department.localeCompare(b.department));
            setPdfData(sortedData);
        } catch (error) {
            toast.error("Failed to fetch pdf data!");
        }
    };

    const handleDelete = async (id, type) => {
        try {
            if (type === "banner") {
                await api.delete(`/department-banner/${id}`);
                setBannerData((prevData) => prevData.filter((item) => item.id !== id));
            } else if (type === "description") {
                await api.delete(`/department-description/${id}`);
                setDescriptionData((prevData) => prevData.filter((item) => item.id !== id));
            } else if (type === "hod") {
                await api.delete(`/hod-details/${id}`);
                setHodData((prevData) => prevData.filter((item) => item.id !== id));
            } else if (type === "pdf") {
                await api.delete(`/department-pdfs/${id}`);
                setPdfData((prevData) => prevData.filter((item) => item.id !== id));
            }
            toast.success(
                `${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} data deleted successfully!`
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
            type === "banner" || type === "hod" || type === "pdf"
                ? { ...item }
                : {
                    ...item,
                    subDescriptions: Array.isArray(item.subDescriptions)
                        ? item.subDescriptions
                        : item.subDescriptions
                            ? item.subDescriptions.split(",")
                            : [],
                }
        );
        setImagePreview(type === "banner" || type === "hod" ? `${baseURL}/${item.file_path}` : "");
        setModalType(type);
        setShowEditModal(true);
    };

    const closeModal = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedItem(null);
        setEditData({});
        setImagePreview("");
    };

    const handleSaveChanges = async () => {
        try {
            if (modalType === "banner") {
                const formData = new FormData();
                formData.append("name", editData.name);
                if (editData.imageFile) {
                    formData.append("bannerImage", editData.imageFile);
                }

                await api.put(`/department-banner/${selectedItem.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setBannerData(
                    bannerData.map((item) =>
                        item.id === selectedItem.id ? { ...item, ...editData } : item
                    )
                );
                fetchBannerData();
            }
            else if (modalType === "description") {
                await api.put(`/department-description/${selectedItem.id}`, {
                    department: editData.department,
                    description: editData.description,
                    subDescriptions: Array.isArray(editData.subDescriptions) ? editData.subDescriptions : [],
                });

                setDescriptionData(
                    descriptionData.map((item) =>
                        item.id === selectedItem.id ? { ...item, ...editData } : item
                    )
                );

                fetchDescriptionData();
            }
            else if (modalType === "hod") {
                const formData = new FormData();
                formData.append("name", editData.name);
                formData.append("designation", editData.designation);
                formData.append("education", editData.education);
                formData.append("address", editData.address);
                formData.append("number", editData.number);
                formData.append("email", editData.email);
                if (editData.imageFile) {
                    formData.append("hodImage", editData.imageFile);
                }

                await api.put(`/hod-details/${selectedItem.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setHodData(
                    hodData.map((item) =>
                        item.id === selectedItem.id ? { ...item, ...editData } : item
                    )
                );
                fetchHodData();
            }
            else if (modalType === "pdf") {
                await api.put(`/department-pdfs/${selectedItem.id}`, {
                    department: editData.department,
                    heading: editData.heading,
                    link: editData.link,
                });
                setPdfData(
                    pdfData.map((item) =>
                        item.id === selectedItem.id ? { ...item, ...editData } : item
                    )
                );
                fetchPdfData();
            }
            toast.success(
                `${modalType.charAt(0).toUpperCase() + modalType.slice(1).toLowerCase()} data updated successfully!`
            );
            navigate("/department-information");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update the entry!");
        }
        closeModal();
    };

    const departmentDescriptionOptions = [...new Set(descriptionData.map((item) => item.department))];

    useEffect(() => {
        if (departmentDescriptionOptions.length > 0) {
            setSelectedDepartmentDescription(departmentDescriptionOptions[0]);
        }
        // eslint-disable-next-line
    }, [descriptionData]);

    const filteredDescriptionData = descriptionData.filter((item) => item.department === selectedDepartmentDescription);
    const startDescriptionIndex = (descriptionCurrentPage - 1) * itemsPerPage;
    const paginatedDescriptionData = filteredDescriptionData.slice(startDescriptionIndex, startDescriptionIndex + itemsPerPage);

    const departmentPdfOptions = [...new Set(pdfData.map((item) => item.department))];

    useEffect(() => {
        if (departmentPdfOptions.length > 0) {
            setSelectedDepartmentPdf(departmentPdfOptions[0]);
        }
        // eslint-disable-next-line
    }, [pdfData]);

    const filteredPdfData = pdfData.filter((item) => item.department === selectedDepartmentPdf);
    const startPdfIndex = (pdfCurrentPage - 1) * itemsPerPage;
    const paginatedPdfData = filteredPdfData.slice(startPdfIndex, startPdfIndex + itemsPerPage);

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

    const bannerPageData = bannerData.slice((bannerCurrentPage - 1) * itemsPerPage, bannerCurrentPage * itemsPerPage);
    const hodPageData = hodData.slice((hodCurrentPage - 1) * itemsPerPage, hodCurrentPage * itemsPerPage);

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="#">Departments</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Department Information
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Department Banner</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-department-banner"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Department Banner
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Department Name</th>
                                                    <th>Department Banner</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bannerPageData.length > 0 ? (
                                                    bannerPageData.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">
                                                                {(bannerCurrentPage - 1) * itemsPerPage + index + 1}
                                                            </td>
                                                            <td>{item.name}</td>
                                                            <td>
                                                                <Link
                                                                    className="glightbox"
                                                                    to={`${baseURL}/${item.file_path}`}
                                                                >
                                                                    <img
                                                                        src={`${baseURL}/${item.file_path}`}
                                                                        alt={item.name}
                                                                        style={{
                                                                            width: "150px",
                                                                        }}
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "banner")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("banner");
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
                                                        <td colSpan={4} className="text-center">No Banner Data Available</td>
                                                    </tr>
                                                )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <ul className="pagination m-t-20">
                                    <li className={`page-item ${bannerCurrentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setBannerCurrentPage(bannerCurrentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {[
                                        ...Array(Math.ceil(bannerData.length / itemsPerPage)).keys(),
                                    ].map((page) => (
                                        <li
                                            key={page + 1}
                                            className={`page-item ${bannerCurrentPage === page + 1 ? "active" : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setBannerCurrentPage(page + 1)}
                                            >
                                                {page + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li
                                        className={`page-item ${bannerCurrentPage === Math.ceil(bannerData.length / itemsPerPage)
                                            ? "disabled"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setBannerCurrentPage(bannerCurrentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Department Description</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-department-description"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Department Description
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <select
                                                className="form-control"
                                                value={selectedDepartmentDescription}
                                                onChange={(e) => {
                                                    setSelectedDepartmentDescription(e.target.value);
                                                    setDescriptionCurrentPage(1);
                                                }}
                                            >
                                                {departmentDescriptionOptions.map((dept, index) => (
                                                    <option key={index} value={dept}>
                                                        {dept}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="table-responsive m-t-20">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Department Description</th>
                                                    <th>Sub Description</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedDescriptionData.length > 0 ? (
                                                    paginatedDescriptionData.map((item, index) => {
                                                        const subDescriptions = Array.isArray(item.subDescriptions)
                                                            ? item.subDescriptions
                                                            : typeof item.subDescriptions === "string" && item.subDescriptions.length > 0
                                                                ? item.subDescriptions.split(",").map(subDesc => subDesc.trim())
                                                                : [];

                                                        return (
                                                            <React.Fragment key={item.id}>
                                                                {/* First row with main description */}
                                                                <tr>
                                                                    <td rowSpan={subDescriptions.length || 1} className="text-center">
                                                                        {startDescriptionIndex + index + 1}
                                                                    </td>
                                                                    <td rowSpan={subDescriptions.length || 1}>{item.description}</td>
                                                                    {/* Display the first sub-description */}
                                                                    <td>{subDescriptions.length > 0 ? subDescriptions[0] : "-"}</td>
                                                                    <td rowSpan={subDescriptions.length || 1} className="text-center">
                                                                        <button
                                                                            onClick={() => openEditModal(item, "description")}
                                                                            className="btn btn-success btn-sm m-t-10"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedItem(item);
                                                                                setModalType("description");
                                                                                setShowDeleteModal(true);
                                                                            }}
                                                                            className="btn btn-danger btn-sm m-t-10"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>

                                                                {/* Generate additional rows for remaining sub-descriptions */}
                                                                {subDescriptions.slice(1).map((subDesc, idx) => (
                                                                    <tr key={`${item.id}-sub-${idx}`}>
                                                                        <td>{subDesc}</td>
                                                                    </tr>
                                                                ))}
                                                            </React.Fragment>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="text-center">
                                                            No Description Data Available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <ul className="pagination m-t-20">
                                        <li className={`page-item ${descriptionCurrentPage === 1 ? "disabled" : ""}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setDescriptionCurrentPage(descriptionCurrentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {[...Array(Math.ceil(filteredDescriptionData.length / itemsPerPage)).keys()].map((page) => (
                                            <li
                                                key={page + 1}
                                                className={`page-item ${descriptionCurrentPage === page + 1 ? "active" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setDescriptionCurrentPage(page + 1)}
                                                >
                                                    {page + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li
                                            className={`page-item ${descriptionCurrentPage === Math.ceil(filteredDescriptionData.length / itemsPerPage)
                                                ? "disabled"
                                                : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setDescriptionCurrentPage(descriptionCurrentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
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
                                            <h4 className="page-title">Hod Details</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-hod-details"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Hod Detail
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Hod Name</th>
                                                    <th>Designation</th>
                                                    <th>Education Qualification</th>
                                                    <th>Office Address</th>
                                                    <th>Phone Number</th>
                                                    <th>Email Address</th>
                                                    <th className="text-center">Hod Image</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {hodPageData.length > 0 ? (
                                                    hodPageData.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">
                                                                {(hodCurrentPage - 1) * itemsPerPage + index + 1}
                                                            </td>
                                                            <td>{item.name}</td>
                                                            <td>{item.designation}</td>
                                                            <td>{item.education}</td>
                                                            <td>{item.address}</td>
                                                            <td>{item.number}</td>
                                                            <td>{item.email}</td>
                                                            <td className="text-center">
                                                                <Link
                                                                    className="glightbox"
                                                                    to={`${baseURL}/${item.file_path}`}
                                                                >
                                                                    <img
                                                                        src={`${baseURL}/${item.file_path}`}
                                                                        alt={item.name}
                                                                        style={{
                                                                            width: "75px",
                                                                        }}
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "hod")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("hod");
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
                                                        <td colSpan={9} className="text-center">No Hod Data Available</td>
                                                    </tr>
                                                )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <ul className="pagination m-t-20">
                                    <li className={`page-item ${hodCurrentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setHodCurrentPage(hodCurrentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {[
                                        ...Array(Math.ceil(hodData.length / itemsPerPage)).keys(),
                                    ].map((page) => (
                                        <li
                                            key={page + 1}
                                            className={`page-item ${hodCurrentPage === page + 1 ? "active" : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setHodCurrentPage(page + 1)}
                                            >
                                                {page + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li
                                        className={`page-item ${hodCurrentPage === Math.ceil(hodData.length / itemsPerPage)
                                            ? "disabled"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setHodCurrentPage(hodCurrentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Department Pdfs</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link
                                                to="/add-department-pdfs"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Department Pdf
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <select
                                                className="form-control"
                                                value={selectedDepartmentPdf}
                                                onChange={(e) => {
                                                    setSelectedDepartmentPdf(e.target.value);
                                                    setPdfCurrentPage(1);
                                                }}
                                            >
                                                {departmentPdfOptions.map((dept, index) => (
                                                    <option key={index} value={dept}>
                                                        {dept}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="table-responsive m-t-20">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>PDF Heading</th>
                                                    <th>PDF Link</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedPdfData.length > 0 ? (
                                                    paginatedPdfData.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{startPdfIndex + index + 1}</td>
                                                            <td>{item.heading}</td>
                                                            <td>
                                                                <Link
                                                                    className="text-decoration-none"
                                                                    target="_blank"
                                                                    style={{ color: "#000" }}
                                                                    to={item.link}
                                                                >
                                                                    {item.link}
                                                                </Link>
                                                            </td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "pdf")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("pdf");
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
                                                        <td colSpan={4} className="text-center">
                                                            No Pdf Data Available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <ul className="pagination m-t-20">
                                        <li className={`page-item ${pdfCurrentPage === 1 ? "disabled" : ""}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setPdfCurrentPage(pdfCurrentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {[...Array(Math.ceil(filteredPdfData.length / itemsPerPage)).keys()].map((page) => (
                                            <li
                                                key={page + 1}
                                                className={`page-item ${pdfCurrentPage === page + 1 ? "active" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPdfCurrentPage(page + 1)}
                                                >
                                                    {page + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li
                                            className={`page-item ${pdfCurrentPage === Math.ceil(filteredPdfData.length / itemsPerPage)
                                                ? "disabled"
                                                : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setPdfCurrentPage(pdfCurrentPage + 1)}
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
                                        <h5 className="modal-title">
                                            {modalType === "banner"
                                                ? "Edit Department Banner"
                                                : modalType === "description"
                                                    ? "Edit Department Description"
                                                    : modalType === "hod"
                                                        ? "Edit Hod Detail"
                                                        : "Edit Department Pdf"}
                                        </h5>
                                    </div>
                                    <div className="modal-body">
                                        {modalType === "banner" && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="heading">Department Name</label>
                                                    <select
                                                        className="form-control"
                                                        name="name"
                                                        value={editData.name}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, name: e.target.value })
                                                        }
                                                    >
                                                        <option value="" disabled>
                                                            Select Department Name
                                                        </option>
                                                        {departments.map((department) => (
                                                            <option value={department.heading} key={department.id}>
                                                                {department.heading}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="portalImage">Department Banner</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="bannerImage"
                                                        onChange={handleImageChange}
                                                    />
                                                    {imagePreview && (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            style={{ width: "100px", marginTop: "10px" }}
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {modalType === "description" && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="heading">Department Name</label>
                                                    <select
                                                        className="form-control"
                                                        name="department"
                                                        value={editData.department}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, department: e.target.value })
                                                        }
                                                    >
                                                        <option value="" disabled>Select Department Name</option>
                                                        {departments.map((department) => (
                                                            <option value={department.heading} key={department.id}>
                                                                {department.heading}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="description">Department Description</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="description"
                                                        value={editData.description}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, description: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Sub-Descriptions</label>
                                                    {editData.subDescriptions.map((subDesc, index) => (
                                                        <div key={index} className="d-flex mb-2">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={subDesc}
                                                                onChange={(e) => {
                                                                    const newSubDescriptions = [...editData.subDescriptions];
                                                                    newSubDescriptions[index] = e.target.value;
                                                                    setEditData({ ...editData, subDescriptions: newSubDescriptions });
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm ml-2"
                                                                onClick={() => {
                                                                    const newSubDescriptions = editData.subDescriptions.filter((_, i) => i !== index);
                                                                    setEditData({ ...editData, subDescriptions: newSubDescriptions });
                                                                }}
                                                            >
                                                                ❌
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() =>
                                                            setEditData({ ...editData, subDescriptions: [...editData.subDescriptions, ""] })
                                                        }
                                                    >
                                                        ➕ Add Sub-Description
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                        {modalType === "hod" && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="name">Hod Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        value={editData.name}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, name: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="designation">Designation</label>
                                                    <select
                                                        className="form-control"
                                                        name="designation"
                                                        value={editData.designation}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, designation: e.target.value })
                                                        }
                                                    >
                                                        <option value="" disabled>
                                                            Select Designation
                                                        </option>
                                                        {departments.map((department) => (
                                                            <option value={department.heading} key={department.id}>
                                                                {department.heading}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="education">Education Qualification</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="education"
                                                        value={editData.education}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, education: e.target.value })
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
                                                    <label htmlFor="number">Phone Number</label>
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
                                                    <label htmlFor="email">Email Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="email"
                                                        value={editData.email}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, email: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="hodImage">Hod Image</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="hodImage"
                                                        onChange={handleImageChange}
                                                    />
                                                    {imagePreview && (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            style={{ width: "100px", marginTop: "10px" }}
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {modalType === "pdf" && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="heading">Department Name</label>
                                                    <select
                                                        className="form-control"
                                                        name="department"
                                                        value={editData.department}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, department: e.target.value })
                                                        }
                                                    >
                                                        <option value="" disabled>
                                                            Select Department Name
                                                        </option>
                                                        {departments.map((department) => (
                                                            <option value={department.heading} key={department.id}>
                                                                {department.heading}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="number">PDF Heading</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading"
                                                        value={editData.heading}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, heading: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="number">PDF Link</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="link"
                                                        value={editData.link}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, link: e.target.value })
                                                        }
                                                    />
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
        </div >
    );
};

export default DepartmentInformation;