import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TermsConditions.css";
import "../CommingSoon/CommingSoon.css";
import comingsoon from '../../assets/newcomingsoon.png'
import api, { baseURL } from "../api"

const TermsConditions = () => {
    const [bgImage, setBgImage] = useState("");
    useEffect(() => {
        fetchHeaderImage();
    }, []);
    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Terms-and-conditions");

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
                <div className="container-fluid font-location mt-4 mb-2" id="terms-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Terms & Conditions</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Terms</span>
                        <span className="highlighted-text"> & Conditions</span>
                        <hr />
                    </h2>

                    <div className="coming-soon-section text-center mt-4">
                        <img
                            src={comingsoon}
                            alt="Coming Soon"
                            className="coming-soon-gif"
                        />
                        <p className="coming-soon-message">
                            This page is under development and will be available soon.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TermsConditions;