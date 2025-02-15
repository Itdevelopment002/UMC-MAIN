import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";
import api, { baseURL } from "../api";

const PrivacyPolicy = () => {
    const [policy, setPolicy] = useState([]);
    const [bgImage, setBgImage] = useState("");

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Privacy-Policy");

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
        fetchPolicy();
        fetchHeaderImage();
    }, []);

    const fetchPolicy = async () => {
        try {
            const response = await api.get("/privacy-policy");
            setPolicy(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Group policies by their headings
    const groupedPolicies = policy.reduce((acc, currentPolicy) => {
        const { heading, description } = currentPolicy;
        if (!acc[heading]) {
            acc[heading] = [];
        }
        acc[heading].push(description);
        return acc;
    }, {});

    return (
        <>
            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,

                }}
            ></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="privacy-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Privacy Policy</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Privacy</span>
                        <span className="highlighted-text"> Policy</span>
                        <hr />
                    </h2>

                    <div className="row">
                        <div className="col-12">
                            {Object.entries(groupedPolicies).map(([heading, descriptions]) => (
                                <div key={heading} className="mb-4">
                                    <h5 className="privacy-h5-style">{heading}</h5>
                                    {descriptions.map((description, index) => (
                                        <p key={index} className="privacy-p-style">
                                            {description}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
