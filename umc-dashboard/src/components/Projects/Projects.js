import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => lightbox.destroy();
  }, [projects]);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDeleteModalOpen = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleEditModalOpen = async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      setSelectedProject(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to fetch project details");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${selectedProject.id}`);
      setProjects(
        projects.filter((project) => project.id !== selectedProject.id)
      );
      setShowDeleteModal(false);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProject(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProject(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    if (selectedProject.heading)
      formData.append("heading", selectedProject.heading);
    if (selectedProject.description)
      formData.append("description", selectedProject.description);
    if (selectedProject.link)
      formData.append("link", selectedProject.link);
    if (selectedProject.mainIcon)
      formData.append("mainIcon", selectedProject.mainIcon);

    try {
      await api.put(`/projects/${selectedProject.id}`, formData);
      fetchProjects();
      setShowEditModal(false);
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProject((prevProject) => ({ ...prevProject, [field]: file }));
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Upcoming Projects
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Upcoming Projects</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-projects"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Upcoming Project
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Project Heading</th>
                          <th>Project Description</th>
                          <th>Project Link</th>
                          <th>Project Image</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project, index) => (
                          <tr key={project.id}>
                            <td>{index + 1}</td>
                            <td>{project.heading}</td>
                            <td>{project.description}</td>
                            <td>{project.link}</td>
                            <td>
                              <Link
                                to={`${baseURL}/${project.main_icon_path}`}
                                className="glightbox"
                                data-gallery="project-images"
                              >
                                <img
                                  width="100px"
                                  src={`${baseURL}/${project.main_icon_path}`}
                                  alt={project.heading}
                                />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10 mx-1"
                                onClick={() => handleEditModalOpen(project.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() => handleDeleteModalOpen(project)}
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

          {showDeleteModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this service?</h5>
                  </div>
                  <div className="modal-footer justify-content-right">
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
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEditModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Upcoming Project</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Project Heading</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Project Heading"
                          value={selectedProject?.heading || ""}
                          onChange={(e) =>
                            setSelectedProject({
                              ...selectedProject,
                              heading: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Project Description</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Project Description"
                          value={selectedProject?.description || ""}
                          onChange={(e) =>
                            setSelectedProject({
                              ...selectedProject,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Project Link</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Project Link"
                          value={selectedProject?.link || ""}
                          onChange={(e) =>
                            setSelectedProject({
                              ...selectedProject,
                              link: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                        Project Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleFileChange(e, "mainIcon")}
                        />
                      </div>
                    </form>
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
                      className="btn brn-sm btn-primary"
                      onClick={handleSaveEdit}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Projects;
