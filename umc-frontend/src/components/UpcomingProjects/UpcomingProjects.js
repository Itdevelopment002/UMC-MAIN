// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "./UpcomingProjects.css";
// import api, {baseURL} from "../api";

// import img1 from "../../assets/images/project/img1.png";
// import img2 from "../../assets/images/project/img2.png";
// import img3 from "../../assets/images/project/img3.png";
// import img4 from "../../assets/images/project/img4.png";
// import img5 from "../../assets/images/project/img5.png";
// import img6 from "../../assets/images/project/img6.png";
// import img7 from "../../assets/images/project/img7.png";
// import img8 from "../../assets/images/project/img8.png";

// const UpcomingProjects = () => {
// const [bgImage, setBgImage] = useState([]);

// const fetchHeaderImage = async () => {
//     try {
//         const response = await api.get("/banner");

//         if (response.data.length > 0) {
//             let selectedBanner = response.data.find(banner => banner.banner_name === "Upcoming Projects");

//             if (selectedBanner) {
//                 setBgImage(`${baseURL}${selectedBanner.file_path}`);
//             } else {
//                 console.error("Banner with specified name not found.");
//             }
//         } else {
//             console.error("No banner image found.");
//         }
//     } catch (error) {
//         console.error("Error fetching header image:", error);
//     }
// };

// useEffect(() => {
//     fetchHeaderImage();
//     window.scrollTo({ top: 0, behavior: 'smooth' });
// }, []);

//     return (
//         <>
//             <div
//                 className="history-header-image"
//                 style={{
//                     backgroundImage: `url(${bgImage})`,

//                 }}
//             ></div>

//             <div className="container-fluid font-location mt-4 mb-2" id="project-css">
//                 <nav className="breadcrumb">
//                     <Link to="/" className="breadcrumb-item text-decoration-none">
//                         Home
//                     </Link>
//                     <span className="breadcrumb-item active1">Upcoming Projects</span>
//                 </nav>
//                 <h2 className="location-title">
//                     <span className="highlight">Upcoming</span>
//                     <span className="highlighted-text"> Projects</span>
//                 </h2>
//                 <div className="row mt-4">
//                     <div className="col-12">
//                         <h3 className="text-danger mb-4">
//                             Construction of cement concrete road from Netaji Chowk in Ulhasnagar-4
//                             to Kailash Colony, via Kurla Camp.
//                         </h3>
//                         <hr />
//                         <div className="work-details mb-4">
//                             <h5 className="project-work-style-h5">Work Details:</h5>
//                             <ul className="project-work-style">
//                                 <li>
//                                     Drainage work on both sides has been completed, road concreting from
//                                     Bhatia Chowk to Kailas Colony has been completed. Usage is in
//                                     progress. Work is in progress near Samata Nagar Arch and near
//                                     Gurunnanak School.
//                                 </li>
//                                 <li>
//                                     Kali Mata Chowk, Sainath Colony, Lalsai Bungalow Chowk is pending.
//                                     Bhatia Chowk to Netaji Chowk work is pending. Sewage channel work is
//                                     in progress.
//                                 </li>
//                             </ul>
//                             <ol type="1" className="project-work-style">
//                                 <li>
//                                     Encroachments on both sides of the road have been removed by
//                                     giving notice from the ward office.
//                                 </li>
//                                 <li>Work near Swargdwar crematorium needs to be completed and made proper soon.</li>
//                                 <li>The work of the divider is incomplete.</li>
//                             </ol>
//                             <p className="project-work-style">
//                                 The length of the proposed road is 2000 meters and the width is 24 meters.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="row mb-4">
//                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
//                         <div className="card2 rounded-2">
//                             <img src={img1} className="card-img-top" alt="" />
//                         </div>
//                     </div>
//                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
//                         <div className="card2 rounded-2">
//                             <img src={img2} className="card-img-top" alt="" />
//                         </div>
//                     </div>
//                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
//                         <div className="card2 rounded-2">
//                             <img src={img3} className="card-img-top" alt="" />
//                         </div>
//                     </div><div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
//                         <div className="card2 rounded-2">
//                             <img src={img4} className="card-img-top" alt="" />
//                         </div>
//                     </div>
//                 </div>
//                 <hr />
//                 <hr />

//                 <div className="row mt-4">
//                     <div className="col-12">
//                         <h3 className="text-danger mb-4">
//                             Construction of cement concrete road from A-Block at Ulhasnagar-1 to Saibaba Temple, Dolphin Club and Century Ground.
//                         </h3>
//                         <hr />
//                         <div className="work-details mb-4">
//                             <h5 className="project-work-style-h5">Work Details:</h5>
//                             <ul className="project-work-style">
//                                 <li>
//                                     The drainage work on both sides has been completed, concreting of the road from Jai Babadham Chowk to Nijdham Ashram and Ration Office in front of Petrol Pump on the left side has been completed. Usage is in progress.
//                                 </li>
//                                 <li>
//                                     Road work from Netaji School to New English School Road and Ration Office to Lalchakki Chowk is pending.
//                                 </li>
//                                 <li>
//                                     The affected encroachment has been removed by giving a notice from the Ward Office. The work of sewage channel is in progress.
//                                 </li>
//                             </ul>
//                             <ol type="1" className="project-work-style">
//                                 <li>
//                                     The work of divider is incomplete.
//                                 </li>
//                                 <li>The work of main Chowk is pending</li>
//                             </ol>
//                             <p className="project-work-style">
//                                 The length of the proposed road is 1100 meters and the width is 24 x 36 meters.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="row mb-4">
//                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
//                         <div className="card2 rounded-2">
//                             <img src={img5} className="card-img-top" alt="" />
//                         </div>
//                     </div>
//                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
//                         <div className="card2 rounded-2">
//                             <img src={img6} className="card-img-top" alt="" />
//                         </div>
//                     </div>
//                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
//                         <div className="card2 rounded-2">
//                             <img src={img7} className="card-img-top" alt="" />
//                         </div>
//                     </div><div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
//                         <div className="card2 rounded-2">
//                             <img src={img8} className="card-img-top" alt="" />
//                         </div>
//                     </div>
//                 </div>
//                 <hr />
//                 <hr />

//                 <div className="row mt-4">
//                     <div className="col-12">
//                         <h3 className="text-danger mb-4">
//                             Construction of cement concrete road from A-Block at Ulhasnagar-1 to Saibaba Temple, Dolphin Club and Century Ground.
//                         </h3>
//                         <hr />
//                         <div className="work-details mb-4">
//                             <h5 className="project-work-style-h5">Work Details:</h5>
//                             <ul className="project-work-style">
//                                 <li>
//                                     The drainage work on both sides has been completed, concreting of the road from Jai Babadham Chowk to Nijdham Ashram and Ration Office in front of Petrol Pump on the left side has been completed. Usage is in progress.
//                                 </li>
//                                 <li>
//                                     Road work from Netaji School to New English School Road and Ration Office to Lalchakki Chowk is pending.
//                                 </li>
//                                 <li>
//                                     The affected encroachment has been removed by giving a notice from the Ward Office. The work of sewage channel is in progress.
//                                 </li>
//                             </ul>
//                             <ol type="1" className="project-work-style">
//                                 <li>
//                                     The work of divider is incomplete.
//                                 </li>
//                                 <li>The work of main Chowk is pending</li>
//                             </ol>
//                             <p className="project-work-style">
//                                 The length of the proposed road is 1100 meters and the width is 24 x 36 meters.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </>
//     );
// };

// export default UpcomingProjects;

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

        // Group descriptions under headings
        const groupedDescriptions = descriptions.reduce((acc, desc) => {
            if (!acc[desc.heading]) {
                acc[desc.heading] = {
                    heading: desc.heading,
                    descriptions: []
                };
            }

            // Ensure subDescriptions is always an array
            const subDescriptionsArray = Array.isArray(desc.subDescriptions) ? desc.subDescriptions : [];

            acc[desc.heading].descriptions.push({
                id: desc.id,
                description: desc.description,
                subDescriptions: subDescriptionsArray
            });

            return acc;
        }, {});

        // Attach images from categories where headings match
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
