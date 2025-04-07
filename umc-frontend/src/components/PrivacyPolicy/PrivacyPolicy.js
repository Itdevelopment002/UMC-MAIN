import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
    const [policy, setPolicy] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

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
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const fetchPolicy = async () => {
        try {
            const response = await api.get(`/privacy-policy?lang=${i18n.language}`);
            setPolicy(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

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
                            {t('departments.home')}
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            {t('privacy.subTitle')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('privacy.title')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('privacy.highlight')}</span>
                        <span className="highlighted-text"> {t('privacy.highlight-text')}</span>
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
