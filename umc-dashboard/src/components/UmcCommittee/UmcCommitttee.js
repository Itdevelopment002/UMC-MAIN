import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UmcCommittee = () => {
  const [standingData, setStandingData] = useState([]);
  const [womenData, setWomenData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [standingCurrentPage, setStandingCurrentPage] = useState(1);
  const [womenCurrentPage, setWomenCurrentPage] = useState(1);
  const [wardCurrentPage, setWardCurrentPage] = useState(1);
  const [selectedWardData, setSelectedWardData] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({});
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchStandingData();
    fetchWomenData();
    fetchWardData();
    //eslint-disable-next-line
  }, []);

  const fetchStandingData = async () => {
    try {
      const response = await api.get("/standing-committee");
      setStandingData(response.data);
    } catch (error) {
      toast.error("Failed to fetch standing committee data!");
    }
  };

  const fetchWomenData = async () => {
    try {
      const response = await api.get("/women-committee");
      setWomenData(response.data);
    } catch (error) {
      toast.error("Failed to fetch women committee data!");
    }
  };

  const fetchWardData = async () => {
    try {
      const response = await api.get("/ward-committee");
      const sortedData = response.data.sort((a, b) => a.ward.localeCompare(b.ward));
      setWardData(sortedData);
      if (sortedData.length > 0 && !selectedWardData) {
        setSelectedWardData(sortedData[0].ward);
      }
    } catch (error) {
      toast.error("Failed to fetch Ward Committee data!");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "standing") {
        await api.delete(`/standing-committee/${id}`);
        setStandingData((prevData) => prevData.filter((item) => item.id !== id));
      } else if (type === "ward") {
        await api.delete(`/ward-committee/${id}`);
        setWardData((prevData) => prevData.filter((item) => item.id !== id));
      } else if (type === "women") {
        await api.delete(`/women-committee/${id}`);
        setWomenData((prevData) => prevData.filter((item) => item.id !== id));
      }
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Committee data deleted successfully!`
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
      if (modalType === "standing") {
        await api.put(`/standing-committee/${selectedItem.id}`, {
          heading: editData.heading,
          language_code: editData.language_code,
        });
        setStandingData(
          standingData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, heading: editData.heading, language_code: editData.language_code }
              : item
          )
        );
        fetchStandingData();
      } else if (modalType === "women") {
        await api.put(`/women-committee/${selectedItem.id}`, {
          heading: editData.heading,
          language_code: editData.language_code,
        });
        setWomenData(
          womenData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, heading: editData.heading, language_code: editData.language_code }
              : item
          )
        );
        fetchWomenData();
      } else if (modalType === "ward") {
        await api.put(`/ward-committee/${selectedItem.id}`, {
          ward: editData.ward,
          heading: editData.heading,
          language_code: editData.language_code,
        });
        setWardData(
          wardData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, ward: editData.ward, heading: editData.heading, language_code: editData.language_code }
              : item
          )
        );
        fetchWardData();
      }
      toast.success(
        `${modalType.charAt(0).toUpperCase() + modalType.slice(1).toLowerCase()} Committee data updated successfully!`
      );
      navigate("/umc-committee");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the entry!");
    }
    closeModal();
  };

  const standingPageData = standingData.slice((standingCurrentPage - 1) * itemsPerPage, standingCurrentPage * itemsPerPage);
  const womenPageData = womenData.slice((womenCurrentPage - 1) * itemsPerPage, womenCurrentPage * itemsPerPage);

  const filteredWardData = selectedWardData
    ? wardData.filter((item) => item.ward === selectedWardData)
    : wardData;

  const startWardIndex = (wardCurrentPage - 1) * itemsPerPage;
  const paginatedWardData = filteredWardData.slice(startWardIndex, startWardIndex + itemsPerPage);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Corporation</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                UMC Committee
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-6">
                      <h4 className="page-title">Standing Committee</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link
                        to="/add-standing-committee"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Info
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Member Name</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standingPageData.length > 0 ? (
                          standingPageData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{((standingCurrentPage - 1) * itemsPerPage) + (index + 1)}</td>
                              <td>{item.heading}</td>
                              <td className="text-center">
                                <button
                                  onClick={() => openEditModal(item, "standing")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("standing");
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
                            <td colSpan={3} className="text-center">No Standing Committee data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <ul className="pagination m-t-20">
                  <li className={`page-item ${standingCurrentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setStandingCurrentPage(standingCurrentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {[
                    ...Array(Math.ceil(standingData.length / itemsPerPage)).keys(),
                  ].map((page) => (
                    <li
                      key={page + 1}
                      className={`page-item ${standingCurrentPage === page + 1 ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setStandingCurrentPage(page + 1)}
                      >
                        {page + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${standingCurrentPage === Math.ceil(standingData.length / itemsPerPage)
                      ? "disabled"
                      : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setStandingCurrentPage(standingCurrentPage + 1)}
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
                    <div className="col-6">
                      <h4 className="page-title">Ward Committee</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link to="/add-ward-committee" className="btn btn-primary btn-rounded float-right">
                        <i className="fa fa-plus"></i> Add Info
                      </Link>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <select
                        className="form-control"
                        value={selectedWardData || ""}
                        onChange={(e) => {
                          setSelectedWardData(e.target.value);
                          setWardCurrentPage(1);
                        }}
                      >
                        {[...new Set(wardData.map((item) => item.ward))].map((ward, index) => (
                          <option key={index} value={ward}>
                            {ward}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Member Name</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedWardData.length > 0 ? (
                          paginatedWardData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{startWardIndex + index + 1}</td>
                              <td>{item.heading}</td>
                              <td className="text-center">
                                <button onClick={() => openEditModal(item, "ward")} className="btn btn-success btn-sm m-t-10">
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("ward");
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
                            <td colSpan={4} className="text-center">No Ward Committee data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <ul className="pagination m-t-20">
                    <li className={`page-item ${wardCurrentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setWardCurrentPage(wardCurrentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    {[...Array(Math.ceil(filteredWardData.length / itemsPerPage)).keys()].map((page) => (
                      <li key={page + 1} className={`page-item ${wardCurrentPage === page + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setWardCurrentPage(page + 1)}>
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${wardCurrentPage === Math.ceil(filteredWardData.length / itemsPerPage) ? "disabled" : ""
                        }`}
                    >
                      <button className="page-link" onClick={() => setWardCurrentPage(wardCurrentPage + 1)}>
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
                    <div className="col-6">
                      <h4 className="page-title">Women and child Welfare Committee</h4>
                    </div>
                    <div className="col-6 text-right m-b-20">
                      <Link
                        to="/add-women-committee"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Info
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%" className="text-center">Sr. No.</th>
                          <th>Member Name</th>
                          <th width="15%" className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {womenPageData.length > 0 ? (
                          womenPageData.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-center">{((womenCurrentPage - 1) * itemsPerPage) + (index + 1)}</td>
                              <td>{item.heading}</td>
                              <td className="text-center">
                                <button
                                  onClick={() => openEditModal(item, "women")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalType("women");
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
                            <td colSpan={3} className="text-center">No Women and child Welfare Committee data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <ul className="pagination m-t-20">
                  <li className={`page-item ${womenCurrentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setWomenCurrentPage(womenCurrentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {[
                    ...Array(Math.ceil(womenData.length / itemsPerPage)).keys(),
                  ].map((page) => (
                    <li
                      key={page + 1}
                      className={`page-item ${womenCurrentPage === page + 1 ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setWomenCurrentPage(page + 1)}
                      >
                        {page + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${womenCurrentPage === Math.ceil(womenData.length / itemsPerPage)
                      ? "disabled"
                      : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setWomenCurrentPage(womenCurrentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
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
                      {modalType === "standing"
                        ? "Edit Standing Committee"
                        : modalType === "women"
                          ? "Edit Women and child Welfare Committee"
                          : modalType === "ward"
                            ? "Edit Ward Committee"
                            : "Edit Department Pdf"}
                    </h5>
                  </div>
                  <div className="modal-body">
                    {modalType === "standing" && (
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
                              setEditData({ ...editData, language_code: e.target.value })
                            }
                          >
                            <option value="">Select Language</option>
                            <option value="en">English</option>
                            <option value="mr">Marathi</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="description">Member Name</label>
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
                      </>
                    )}
                    {modalType === "ward" && (
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
                              setEditData({ ...editData, language_code: e.target.value })
                            }
                          >
                            <option value="">Select Language</option>
                            <option value="en">English</option>
                            <option value="mr">Marathi</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="heading">Ward Name</label>
                          <select
                            className="form-control"
                            name="ward"
                            value={editData.ward}
                            onChange={(e) =>
                              setEditData({ ...editData, ward: e.target.value })
                            }
                          >
                            <option value="" disabled>Select Ward Name</option>
                            <option value="Ward Committee A">Ward Committee A</option>
                            <option value="Ward Committee B">Ward Committee B</option>
                            <option value="Ward Committee C">Ward Committee C</option>
                            <option value="Ward Committee D">Ward Committee D</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="description">Member Name</label>
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
                      </>
                    )}
                    {modalType === "women" && (
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
                              setEditData({ ...editData, language_code: e.target.value })
                            }
                          >
                            <option value="">Select Language</option>
                            <option value="en">English</option>
                            <option value="mr">Marathi</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="description">Member Name</label>
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

export default UmcCommittee;
