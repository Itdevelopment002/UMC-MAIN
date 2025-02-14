import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Tourism.css';
import { GrLocation } from "react-icons/gr";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";


const Tourism = () => {
    const [gardensData, setGardensData] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    useEffect(() => {
        const fetchGardens = async () => {
            try {
                const response = await api.get(`/tourism?lang=${i18n.language}`);
                setGardensData(response.data);
            } catch (error) {
                console.error("Error fetching tourism data:", error);
            }
        };
        fetchGardens();
    }, [i18n.language]);
    useEffect(() => {
        fetchHeaderImage();
    }, []);
    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Tourism");

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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
             <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,
                   
                }}
            ></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="tourism-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">Home</Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">About UMC</Link>
                        <span className="breadcrumb-item active1">Tourism</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Tourism</span>
                        <span className="highlighted-text"> of UMC</span>
                    </h2>

                    {gardensData.map((location, index) => (
                        <React.Fragment key={index}>
                            <div className="row mt-4">
                                <div className="col-12 col-xl-5 col-lg-5 col-md-5 col-sm-12">
                                    <div className="card1">
                                        <div className="card-overlay card-overlay1 mx-auto">
                                            <Link to={location.location_link} target="_blank" className="text-decoration-none">
                                                <button className="btn btn-primary location-btn">
                                                    <GrLocation style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                                    {t("btn-title")}
                                                </button>
                                            </Link>
                                        </div>
                                        <img
                                            src={`${baseURL}${location.main_image || "defaultImage.jpg"}`}
                                            className="card-img-top"
                                            style={{ borderRadius: "7px" }}
                                            alt={location.name || "No Name"}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-xl-7 col-lg-7 col-md-7 col-sm-12">
                                    <h2 className="h2-styling-tourism">{location.name || "Unknown Location"}</h2>
                                    <p><strong>Address:</strong> <span className="span-tourism">{location.address || "No Address Available"}</span></p>
                                    <hr />
                                    <p>
                                        <strong>Hours: </strong>
                                        <span
                                            className="span-tourism"
                                            dangerouslySetInnerHTML={{
                                                __html: location.hours
                                                    ? location.hours.replace(/\|/g, '<br>')
                                                    : "No Hours Available"
                                            }}
                                        ></span>
                                    </p>
                                    <hr />
                                    <p><strong>Description:</strong> <span className="span-tourism">{location.description || "No Description Available"}</span></p>
                                </div>
                            </div>

                            {/* Gallery Section */}
                            <div className="row mt-4">
                                {JSON.parse(location.gallery).map((image, galleryIndex) => (
                                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col" key={galleryIndex}>
                                        <div className="card2 rounded-2">
                                            <img
                                                src={`${baseURL}${image}`}
                                                className="card-img-top"
                                                alt={`Gallery-${galleryIndex + 1}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            {index !== gardensData.length - 1 && (
                                <>
                                    <hr />
                                    <hr />
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Tourism;
