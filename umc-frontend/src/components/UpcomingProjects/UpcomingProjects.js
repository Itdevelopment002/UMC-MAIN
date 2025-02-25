import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UpcomingProjects.css";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const UpcomingProjects = () => {
    const [projects, setProjects] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");
            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Upcoming Projects");
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

    const fetchProjectCategories = async () => {
        try {
            const response = await api.get(`/project-category?lang=${i18n.language}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching project categories:", error);
            return [];
        }
    };

    const fetchProjectDescriptions = async () => {
        try {
            const response = await api.get(`/project-description?lang=${i18n.language}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching project descriptions:", error);
            return [];
        }
    };

    const fetchProjects = async () => {
        const categories = await fetchProjectCategories();
        const descriptions = await fetchProjectDescriptions();
        const groupedDescriptions = descriptions.reduce((acc, desc) => {
            if (!acc[desc.heading]) {
                acc[desc.heading] = {
                    heading: desc.heading,
                    descriptions: []
                };
            }

            const subDescriptionsArray = Array.isArray(desc.subDescriptions) ? desc.subDescriptions : [];

            acc[desc.heading].descriptions.push({
                id: desc.id,
                description: desc.description,
                subDescriptions: subDescriptionsArray
            });

            return acc;
        }, {});

        categories.forEach(cat => {
            if (groupedDescriptions[cat.heading]) {
                try {
                    let imagesArray = cat.images ? JSON.parse(cat.images) : [];
                    groupedDescriptions[cat.heading].images = imagesArray;
                } catch (error) {
                    console.error("Error parsing image URLs:", error);
                }
            }
        });

        setProjects(Object.values(groupedDescriptions));
    };

    useEffect(() => {
        fetchProjects();
        fetchHeaderImage();
        window.scrollTo({ top: 0, behavior: "smooth" });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    return (
        <>

            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,
                }}
            ></div>

            <div className="container-fluid font-location mt-4 mb-2" id="project-css">
                <nav className="breadcrumb">
                    <Link to="/" className="breadcrumb-item text-decoration-none">{t('departments.home')}</Link>
                    <span className="breadcrumb-item active1">{t('upcoming.title')}</span>
                </nav>
                <h2 className="location-title">
                    <span className="highlight">{t('upcoming.highlight')}</span>
                    <span className="highlighted-text"> {t('upcoming.highlight-text')}</span>
                </h2>
                {projects.map((project, index) => (
                    <div key={index} className="project-section">
                        <h3 className="text-danger mb-4">{project.heading}</h3>
                        <hr />
                        <div className="work-details mb-4">
                            <h5 className="project-work-style-h5">{t('upcoming.workdetail')}</h5>
                            <ul className="project-work-style">
                                {project.descriptions.map((desc, i) => (
                                    <React.Fragment key={i}>
                                        <li>{desc.description}</li>
                                        {desc.subDescriptions.length > 0 && (
                                            <ol type="1">
                                                {desc.subDescriptions.map((sub, subIndex) => (
                                                    <li key={subIndex}>{sub}</li>
                                                ))}
                                            </ol>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ul>
                        </div>

                        <div className="row mb-4">
                            {project.images && project.images.length > 0 ? (
                                project.images.map((image, i) => (
                                    <div key={i} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                                        <div className="card2 rounded-2">
                                            <img src={`${baseURL}${image}`} className="card-img-top" alt="" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>{t('upcoming.noimage')}</p>
                            )}
                        </div>

                        <hr />
                        <hr />
                    </div>
                ))}
            </div>
        </>
    );
};

export default UpcomingProjects;
