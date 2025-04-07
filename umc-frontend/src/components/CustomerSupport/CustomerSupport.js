import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CommingSoon/CommingSoon.css";
import "./CustomerSupport.css"
import comingsoon from '../../assets/newcomingsoon.png'
import api, { baseURL } from "../api"
import { useTranslation } from "react-i18next";

const CustomerSupport = () => {
    const [bgImage, setBgImage] = useState("");
    const { t } = useTranslation();

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
        fetchHeaderImage();
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
                            {t('departments.home')}
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            {t('privacy.subTitle')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('support.title')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('support.highlight')}</span>
                        <span className="highlighted-text"> {t('support.highlight-text')}</span>
                        <hr />
                    </h2>

                    <div className="coming-soon-section text-center mt-4">
                        <img
                            src={comingsoon}
                            alt="Coming Soon"
                            className="coming-soon-gif"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerSupport;
