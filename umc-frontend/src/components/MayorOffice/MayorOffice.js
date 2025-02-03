import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CommingSoon/CommingSoon.css";
import "./MayorOffice.css"
import comingsoon from '../../assets/newcomingsoon.png'
import api, { baseURL } from "../api";

const MayorOffice = () => {
    const [bgImage, setBgImage] = useState("");
    useEffect(() => {
        fetchHeaderImage();
    }, []);
    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let latestBanner = response.data[response.data.length - 1];
                setBgImage(`${baseURL}${latestBanner.file_path}`);
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
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    marginTop: "-20px",
                    zIndex: "-1",
                }}
            ></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-2 mb-5" id="deputy-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Mayor Office</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Mayor</span>
                        <span className="highlighted-text"> Office</span>
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

export default MayorOffice;
