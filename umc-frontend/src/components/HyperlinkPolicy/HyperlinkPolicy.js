import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HyperlinkPolicy.css";
import api,{baseURL} from "../api";

const HyperlinkPolicy = () => {
    const [policy, setPolicy] = useState([]);
    const [bgImage, setBgImage] = useState("");

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Hyperlink-Policy");

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
            const response = await api.get("/hyperlink-policy");
            setPolicy(response.data);
        } catch (error) {
            console.error(error);
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
                <div className="container-fluid font-location mt-4 mb-2" id="hyperlink-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Hyperlink Policy</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Hyperlink</span>
                        <span className="highlighted-text"> Policy</span>
                        <hr />
                    </h2>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div>
                                {policy.map((policy) => (
                                    <React.Fragment key={policy.id}>
                                        <p className="hyperpara">{policy.description}</p>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HyperlinkPolicy;