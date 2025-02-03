import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CommingSoon/CommingSoon.css";
import "./CustomerSupport.css"
import comingsoon from '../../assets/newcomingsoon.png'
import api, { baseURL } from "../api"

const CustomerSupport = () => {
    const [bgImage, setBgImage] = useState("");
    useEffect(() => {
        fetchHeaderImage();
    }, []);
    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Customer-support");

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
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                <div className="container-fluid font-location mt-2 mb-5" id="deputy-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Customer Support</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Customer</span>
                        <span className="highlighted-text"> Support</span>
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
    );
};

export default CustomerSupport;
