import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AccessibilityStatement.css";
import "../CommingSoon/CommingSoon.css";
import comingsoon from '../../assets/newcomingsoon.png'
import api,{baseURL} from "../api";

const AccessibilityStatement = () => {
    const [bgImage, setBgImage] = useState("");

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Accessibility-statement");

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
            fetchHeaderImage();
        }, []);
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
                <div className="container-fluid font-location mt-4 mb-2" id="accessibility-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Accessibility Statement</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Accessibility</span>
                        <span className="highlighted-text"> Statement</span>
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

export default AccessibilityStatement;