import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURL } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdministrativeStructure = () => {
    const [structureData1, setStructureData1] = useState([]);
    const [structureData2, setStructureData2] = useState([]);
    const [structureData3, setStructureData3] = useState([]);
    const [structureData4, setStructureData4] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchStructureData1();
        fetchStructureData2();
        fetchStructureData3();
        fetchStructureData4();
    }, []);

    const fetchStructureData1 = async () => {
        try {
            const response = await api.get("/structure-tab1");
            setStructureData1(response.data);
        } catch (error) {
            toast.error("Failed to fetch portal data!");
        }
    };

    const fetchStructureData2 = async () => {
        try {
            const response = await api.get("/structure-tab2");
            setStructureData2(response.data);
        } catch (error) {
            toast.error("Failed to fetch portal data!");
        }
    };

    const fetchStructureData3 = async () => {
        try {
            const response = await api.get("/structure-tab3");
            setStructureData3(response.data);
        } catch (error) {
            toast.error("Failed to fetch portal data!");
        }
    };

    const fetchStructureData4 = async () => {
        try {
            const response = await api.get("/structure-tab4");
            setStructureData4(response.data);
        } catch (error) {
            toast.error("Failed to fetch portal data!");
        }
    };

    const handleDelete = async (id, type) => {
        try {
            if (type === "structure1") {
                await api.delete(`/structure-tab1/${id}`);
                setStructureData1((prevData) => prevData.filter((item) => item.id !== id));
            } else if (type === "structure2") {
                await api.delete(`/structure-tab2/${id}`);
                setStructureData2((prevData) => prevData.filter((item) => item.id !== id));
            } else if (type === "structure3") {
                await api.delete(`/structure-tab3/${id}`);
                setStructureData3((prevData) => prevData.filter((item) => item.id !== id));
            } else if (type === "structure4") {
                await api.delete(`/structure-tab4/${id}`);
                setStructureData4((prevData) => prevData.filter((item) => item.id !== id));
            }

            let successMessage = "";
            switch (type) {
                case "structure1":
                    successMessage = "Departments entrusted to Additional Commissioners deleted successfully!";
                    break;
                case "structure2":
                    successMessage = "Departments entrusted to the Deputy Commissioner deleted successfully!";
                    break;
                case "structure3":
                    successMessage = "Departments assigned to Assistant Commissioner deleted successfully!";
                    break;
                case "structure4":
                    successMessage = "Assistant Commissioner Ward Committee deleted successfully!";
                    break;
                default:
                    successMessage = "Deletion successful!";
            }

            toast.success(successMessage);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the entry!");
        }
        closeModal();
    };

    const openEditModal = (item, type) => {
        setSelectedItem(item);
        setEditData(
            type === "structure1" ? { ...item } : { ...item }
        );
        setModalType(type);
        setShowEditModal(true);
    };

    const closeModal = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedItem(null);
        setEditData({});
    };

    const handleSaveChanges = async () => {
        try {
            if (modalType === "structure1") {

                await api.put(`/structure-tab1/${selectedItem.id}`, {
                    heading1: editData.heading1,
                    heading2: editData.heading2,
                    language_code: editData.language_code
                });
                setStructureData1(
                    structureData1.map((item) =>
                        item.id === selectedItem.id ? { ...item, ...editData } : item
                    )
                );
                fetchStructureData1();
            } else if (modalType === "structure2") {

                await api.put(`/structure-tab2/${selectedItem.id}`, {
                    heading1: editData.heading1,
                    heading2: editData.heading2,
                    heading3: editData.heading3,
                    language_code: editData.language_code
                });
                setStructureData2(
                    structureData2.map((item) =>
                        item.id === selectedItem.id ? { ...item, ...editData } : item
                    )
                );
                fetchStructureData2();
            } else if (modalType === "structure3") {
                await api.put(`/structure-tab3/${selectedItem.id}`, {
                    heading1: editData.heading1,
                    heading2: editData.heading2,
                    heading3: editData.heading3,
                    heading4: editData.heading4,
                    language_code: editData.language_code
                });
                setStructureData3(
                    structureData3.map((item) =>
                        item.id === selectedItem.id ? { ...item, ...editData } : item
                    )
                );
                fetchStructureData3();
            } else if (modalType === "structure4") {
                await api.put(`/structure-tab4/${selectedItem.id}`, {
                    ward: editData.ward,
                    officer: editData.officer,
                    language_code: editData.language_code
                });
                setStructureData4(
                    structureData4.map((item) =>
                        item.id === selectedItem.id ? { ...item, ...editData } : item
                    )
                );
                fetchStructureData4();
            }

            let successMessage = "";
            switch (modalType) {
                case "structure1":
                    successMessage = "Departments entrusted to Additional Commissioners updated successfully!";
                    break;
                case "structure2":
                    successMessage = "Departments entrusted to the Deputy Commissioner updated successfully!";
                    break;
                case "structure3":
                    successMessage = "Departments assigned to Assistant Commissioner updated successfully!";
                    break;
                case "structure4":
                    successMessage = "Assistant Commissioner Ward Committee updated successfully!";
                    break;
                default:
                    successMessage = "Deletion successful!";
            }

            toast.success(successMessage);
            navigate("/administrative-structure");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update the entry!");
        }
        closeModal();
    };


    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="#">Administrative Wings</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Administrative Structure
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-6">
                                            <h4 className="page-title">Departments entrusted to Additional Commissioners</h4>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-6 text-right m-b-20">
                                            <Link
                                                to="/add-structure-tab1"
                                                className="btn btn-primary btn-rounded float-right"
                                            >
                                                <i className="fa fa-plus"></i> Add Data
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Heading 1</th>
                                                    <th>Heading 2</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {structureData1.length > 0 ? (
                                                    structureData1.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{item.heading1}</td>
                                                            <td>{item.heading2}</td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "structure1")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("structure1");
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
                                                        <td colSpan="4">No Additional Commissioner Data Available</td>
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
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-6">
                                            <h4 className="page-title">Departments entrusted to the Deputy Commissioner</h4>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-6 text-right m-b-20">
                                            <Link
                                                to="/add-structure-tab2"
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
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Heading 1</th>
                                                    <th>Heading 2</th>
                                                    <th>Heading 3</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {structureData2.length > 0 ? (
                                                    structureData2.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{item.heading1}</td>
                                                            <td>{item.heading2}</td>
                                                            <td>{item.heading3}</td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "structure2")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("structure2");
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
                                                        <td colSpan="5">No Deputy Commissioner Data Available</td>
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
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-6">
                                            <h4 className="page-title">Departments assigned to Assistant Commissioner</h4>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-6 text-right m-b-20">
                                            <Link
                                                to="/add-structure-tab3"
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
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Heading 1</th>
                                                    <th>Heading 2</th>
                                                    <th>Heading 3</th>
                                                    <th>Heading 4</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {structureData3.length > 0 ? (
                                                    structureData3.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{item.heading1}</td>
                                                            <td>{item.heading2}</td>
                                                            <td>{item.heading3}</td>
                                                            <td>{item.heading4}</td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "structure3")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("structure3");
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
                                                        <td colSpan="6">No Assistant Commissioner Data Available</td>
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
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-6">
                                            <h4 className="page-title">Assistant Commissioner Ward Committee</h4>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-6 text-right m-b-20">
                                            <Link
                                                to="/add-structure-tab4"
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
                                                    <th width="10%" className="text-center">Sr. No.</th>
                                                    <th>Ward Committee No.</th>
                                                    <th>Officer Name</th>
                                                    <th width="15%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {structureData4.length > 0 ? (
                                                    structureData4.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{item.ward}</td>
                                                            <td>{item.officer}</td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() => openEditModal(item, "structure4")}
                                                                    className="btn btn-success btn-sm m-t-10"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setModalType("structure4");
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
                                                        <td colSpan="4">No Division Committee Data Available</td>
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
                                            {modalType === "structure1"
                                                ? "Edit Departments Entrusted to Additional Commissioners"
                                                : modalType === "structure2"
                                                    ? "Edit Departments Entrusted to the Deputy Commissioner"
                                                    : modalType === "structure3"
                                                        ? "Edit Departments Assigned to Assistant Commissioner"
                                                        : "Edit Assistant Commissioner Ward Committee"}
                                        </h5>
                                    </div>
                                    <div className="modal-body">
                                        {modalType === "structure1" ? (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="language_code">Select Language</label>
                                                    <select
                                                        className="form-control"
                                                        id="language_code"
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
                                                    <label htmlFor="heading1">Heading 1</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading1"
                                                        value={editData.heading1}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading1: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="heading2">Heading 2</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading2"
                                                        value={editData.heading2}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading2: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : modalType === "structure2" ? (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="language_code">Select Language</label>
                                                    <select
                                                        className="form-control"
                                                        id="language_code"
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
                                                    <label htmlFor="heading1">Heading 1</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading1"
                                                        value={editData.heading1}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading1: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="heading2">Heading 2</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading2"
                                                        value={editData.heading2}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading2: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="heading3">Heading 3</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading3"
                                                        value={editData.heading3}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading3: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : modalType === "structure3" ? (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="language_code">Select Language</label>
                                                    <select
                                                        className="form-control"
                                                        id="language_code"
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
                                                    <label htmlFor="heading1">Heading 1</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading1"
                                                        value={editData.heading1}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading1: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="heading2">Heading 2</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading2"
                                                        value={editData.heading2}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading2: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <div className="form-group">
                                                        <label htmlFor="heading3">Heading 3</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="heading3"
                                                            value={editData.heading3}
                                                            onChange={(e) =>
                                                                setEditData({
                                                                    ...editData,
                                                                    heading3: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="heading4">Heading 4</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="heading4"
                                                        value={editData.heading4}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                heading4: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="language_code">Select Language</label>
                                                    <select
                                                        className="form-control"
                                                        id="language_code"
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
                                                    <label htmlFor="ward">Ward Committee No.</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ward"
                                                        value={editData.ward}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                ward: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="officer">Officer Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="officer"
                                                        value={editData.officer}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                officer: e.target.value,
                                                            })
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
        </div>
    );
};

export default AdministrativeStructure;
