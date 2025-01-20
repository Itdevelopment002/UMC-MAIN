import React, { useState, useEffect } from "react";
import api from "../api";
// eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TreatmentFacility = () => {
  const [facilities, setFacilities] = useState([]);
  const [name, setName] = useState("");
  const [loc, setLoc] = useState("");
  const [capacity, setCapacity] = useState("");
  const [intake, setIntake] = useState("");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState({});
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    loc: "",
    capacity: "",
    intake: "",
    output: "",
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await api.get("/treatment_facility");
      setFacilities(response.data);
    } catch (error) {
      toast.error("Error fetching treatment facilities.");
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!loc) newErrors.loc = "Location is required.";
    if (!capacity) newErrors.capacity = "Capacity is required.";
    if (!intake) newErrors.intake = "Intake is required.";
    if (!output) newErrors.output = "Output is required.";
    return newErrors;
  };

  const handleAddFacility = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      const newFacility = { name, loc, capacity, intake, output };
      try {
        const response = await api.post("/treatment_facility", newFacility);
        setFacilities([...facilities, response.data]);
        resetForm();
        setShowAddNewModal(false);
      } catch (error) {
        console.error("Error adding facility.");
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleDeleteClick = (facility) => {
    setSelectedFacility(facility);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFacility) return;

    try {
      await api.delete(`/treatment_facility/${selectedFacility.id}`);
      setFacilities(
        facilities.filter((facility) => facility.id !== selectedFacility.id)
      );
      toast.success("Facility deleted successfully!");
    } catch (error) {
      toast.error("Error deleting facility.");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleEditClick = (facility) => {
    if (facility) {
      setEditData(facility);
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = async () => {
    if (!editData.id) return;
    try {
      const response = await api.put(
        `/treatment_facility/${editData.id}`,
        editData
      );
      setFacilities(
        facilities.map((facility) =>
          facility.id === editData.id ? response.data : facility
        )
      );
      toast.success("Facility updated successfully!");
    } catch (error) {
      toast.error("Error updating facility.");
    } finally {
      setShowEditModal(false);
    }
  };
  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (errors[field]) {
      setErrors((prevErrors) => {
        const { [field]: removed, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  const resetForm = () => {
    setName("");
    setLoc("");
    setCapacity("");
    setIntake("");
    setOutput("");
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <div className="card-block">
              <div className="row">
                <div className="col-sm-4 col-3">
                  <h4 className="page-title">Treatment Facility</h4>
                </div>
                <div className="col-sm-8 col-9 text-right m-b-20">
                  <button
                    onClick={() => setShowAddNewModal(true)}
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
                      <th width="10%">Sr. No.</th>
                      <th>Name of the Plant</th>
                      <th>Location of the Plant</th>
                      <th>Designed Plant Capacity (MTD)</th>
                      <th>Present waste Intake (MTD)</th>
                      <th>Output of plant</th>
                      <th width="15%">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.loc}</td>
                        <td>{item.capacity}</td>
                        <td>{item.intake}</td>
                        <td>{item.output}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm m-t-10"
                            onClick={() => handleEditClick(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm m-t-10"
                            onClick={() => handleDeleteClick(item)}
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

      <div
        className={`modal ${showAddNewModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showAddNewModal ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Treatment Facility</h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    value={name}
                    onChange={handleInputChange(setName, "name")}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    className={`form-control ${errors.loc ? "is-invalid" : ""}`}
                    value={loc}
                    onChange={handleInputChange(setLoc, "loc")}
                  />
                  {errors.loc && (
                    <small className="text-danger">{errors.loc}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors.capacity ? "is-invalid" : ""
                    }`}
                    value={capacity}
                    onChange={handleInputChange(setCapacity, "capacity")}
                  />
                  {errors.capacity && (
                    <small className="text-danger">{errors.capacity}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Intake</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors.intake ? "is-invalid" : ""
                    }`}
                    value={intake}
                    onChange={handleInputChange(setIntake, "intake")}
                  />
                  {errors.intake && (
                    <small className="text-danger">{errors.intake}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Output</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.output ? "is-invalid" : ""
                    }`}
                    value={output}
                    onChange={handleInputChange(setOutput, "output")}
                  />
                  {errors.output && (
                    <small className="text-danger">{errors.output}</small>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddNewModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddFacility}
              >
                Add Facility
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal ${isDeleteModalOpen ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: isDeleteModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>Are you sure you want to delete this treatment facility?</h5>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setDeleteModalOpen(false)}
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
        className={`modal ${showEditModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showEditModal ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Treatment Facility</h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.loc}
                    onChange={(e) =>
                      setEditData({ ...editData, loc: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editData.capacity}
                    onChange={(e) =>
                      setEditData({ ...editData, capacity: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Intake</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editData.intake}
                    onChange={(e) =>
                      setEditData({ ...editData, intake: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Output</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editData.output}
                    onChange={(e) =>
                      setEditData({ ...editData, output: e.target.value })
                    }
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEditSubmit}
              >
                Update Facility
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TreatmentFacility;
