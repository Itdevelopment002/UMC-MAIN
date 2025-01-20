import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedHod, setEditedHod] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [departmentsPerPage] = useState(5);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleDelete = (id) => {
        setSelectedDepartment(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/departments/${selectedDepartment}`);
            setShowDeleteModal(false);
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    const handleEdit = (department) => {
        setSelectedDepartment(department.id);
        setEditedName(department.name);
        setEditedHod(department.hod);
        setShowEditModal(true);
    };

    const confirmEdit = async () => {
        try {
            await api.put(`/departments/${selectedDepartment}`, {
                name: editedName,
                hod: editedHod,
            });
            setShowEditModal(false);
            fetchDepartments();
        } catch (error) {
            console.error('Error editing department:', error);
        }
    };

    const indexOfLastDepartment = currentPage * departmentsPerPage;
    const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
    const currentDepartments = departments.slice(indexOfFirstDepartment, indexOfLastDepartment);
    const totalPages = Math.ceil(departments.length / departmentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Departments</li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-sm-4 col-3">
                                            <h4 className="page-title">Departments</h4>
                                        </div>
                                        <div className="col-sm-8 col-9 text-right m-b-20">
                                            <Link to="/add-departments" className="btn btn-primary btn-rounded float-right">
                                                <i className="fa fa-plus"></i> Add Departments
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered m-b-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Departments Name</th>
                                                    <th>Name of HOD</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentDepartments.map((department, index) => (
                                                    <tr key={department.id}>
                                                        <td>{indexOfFirstDepartment + index + 1}</td>
                                                        <td>{department.name}</td>
                                                        <td>{department.hod}</td>
                                                        <td>
                                                        <button
                                                                className="btn btn-success btn-sm m-t-10"
                                                                onClick={() => handleEdit(department)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm me-2 m-t-10"
                                                                onClick={() => handleDelete(department.id)}
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
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                        </li>
                    </ul>

                    {showDeleteModal && (
                        <div className="modal show d-block" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-body text-center">
                                        <h5>Are you sure you want to delete this item?</h5>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                        <button type="button" className="btn btn-sm btn-danger" onClick={confirmDelete}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {showEditModal && (
                        <div className="modal show d-block" tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Department</h5>

                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="form-group">
                                                <label>Department Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Name of HOD</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editedHod}
                                                    onChange={(e) => setEditedHod(e.target.value)}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                                        <button type="button" className="btn btn-sm btn-primary" onClick={confirmEdit}>Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Departments;
