import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Departments.css";
import api, { baseURL } from "../api";

const Departments = () => {
    const [departments, setDepartments] = useState([]);

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/department-info");
            const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
            setDepartments(sortedData);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>
            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="contact-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Departments</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Departments</span>
                        <span className="highlighted-text"> of UMC</span>
                        <hr />
                    </h2>
                    <div className="row mt-5">
                        {departments.map((dept, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 mb-5">
                                <Link to={dept.link} className="text-decoration-none">
                                    <div className="department-card">
                                        <div className="image-container">
                                            <img src={`${baseURL}/${dept.main_icon_path}`} alt={dept.heading} />
                                        </div>
                                        <span className="department-name mx-5">{dept.heading}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Departments;