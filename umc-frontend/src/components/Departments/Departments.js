import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Departments.css";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Departments");

                if (selectedBanner) {
                    setBgImage(`${baseURL}${selectedBanner.file_path}`);
                } else {
                    console.error("Banner with specified name not found.");
                }
            } else {
                console.error("No banner image found.");
            }
        } catch (error) {
            console.error("Error fetching header image:", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get(`/department-info?lang=${i18n.language}`);
            const sortedData = response.data.sort((a, b) => a.heading.localeCompare(b.heading));
            setDepartments(sortedData);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchHeaderImage();
        fetchDepartments();
        window.scrollTo({ top: 0, behavior: "smooth" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    return (
        <>

            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,

                }}
            ></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="contact-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t('department.home')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('department.department')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('department.highlight')}</span>
                        <span className="highlighted-text"> {t('department.highlight-text')}</span>
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