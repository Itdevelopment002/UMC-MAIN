import React, { useState, useEffect } from "react";
import api from "../api";
//eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SanitationInspectorForm from "./SanitationInspectorForm";

const ZoneWiseSanitationInspectors = () => {
  const [inspectors, setInspectors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState(null);

  useEffect(() => {
    fetchInspectors();
  }, []);

  const fetchInspectors = async () => {
    try {
      const response = await api.get("/sanitation_inspectors");
      setInspectors(response.data);
    } catch (error) {
      toast.error("Error fetching inspectors.");
    }
  };

  const handleAddInspector = async (formData) => {
    try {
      const response = await api.post("/sanitation_inspectors", formData);
      setInspectors([...inspectors, response.data]);
      setShowAddModal(false);
      toast.success("Inspector added successfully!");
    } catch (error) {
      toast.error("Error adding inspector.");
    }
  };

  const handleEditInspector = async (formData) => {
    try {
      const response = await api.put(
        `/sanitation_inspectors/${selectedInspector.id}`,
        formData
      );
      setInspectors(
        inspectors.map((inspector) =>
          inspector.id === selectedInspector.id ? response.data : inspector
        )
      );
      setShowEditModal(false);
      toast.success("Inspector updated successfully!");
    } catch (error) {
      toast.error("Error updating inspector.");
    }
  };

  const handleDeleteInspector = async () => {
    try {
      await api.delete(`/sanitation_inspectors/${selectedInspector.id}`);
      setInspectors(
        inspectors.filter((inspector) => inspector.id !== selectedInspector.id)
      );
      setShowDeleteModal(false);
      toast.success("Inspector deleted successfully!");
    } catch (error) {
      toast.error("Error deleting inspector.");
    }
  };

  const handleEditClick = (inspector) => {
    setSelectedInspector(inspector);
    setShowEditModal(true);
  };

  const handleDeleteClick = (inspector) => {
    setSelectedInspector(inspector);
    setShowDeleteModal(true);
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <div className="card-block">
              <div className="row">
                <div className="col-sm-6 col-8">
                  <h4 className="page-title">
                    Zone Wise Names of Sanitation Inspectors
                  </h4>
                </div>
                <div className="col-sm-6 col-4 text-right m-b-20">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary btn-rounded float-right"
                  >
                    <i className="fa fa-plus"></i> Add New
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered m-b-0">
                  <thead>
                    <tr>
                      <th width="10%">Zone No.</th>
                      <th>Names of Sanitary Inspectors</th>
                      <th>Mobile No.</th>
                      <th>Ward No.</th>
                      <th width="15%">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectors.map((inspector) => (
                      <tr key={inspector.id}>
                        <td>{inspector.zone_no}</td>
                        <td>{inspector.names}</td>
                        <td>{inspector.mob_no}</td>
                        <td>{inspector.ward_no}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm m-t-10"
                            onClick={() => handleEditClick(inspector)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm m-t-10"
                            onClick={() => handleDeleteClick(inspector)}
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

      {showAddModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Inspector</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowAddModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <SanitationInspectorForm onSubmit={handleAddInspector} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Inspector</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowEditModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <SanitationInspectorForm
                  onSubmit={handleEditInspector}
                  initialData={selectedInspector}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h5>Are you sure you want to delete this inspector?</h5>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={handleDeleteInspector}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ZoneWiseSanitationInspectors;
