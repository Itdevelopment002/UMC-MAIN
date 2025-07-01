import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HyperlinkPolicy.css";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const HyperlinkPolicy = () => {
    const [policy, setPolicy] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

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
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const fetchPolicy = async () => {
        try {
            const response = await api.get(`/hyperlink-policy?lang=${i18n.language}`);
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
                            {t('departments.home')}
                        </Link>
                        <span className="breadcrumb-item text-decoration-none">
                            {t('privacy.subTitle')}
                        </span>
                        <span className="breadcrumb-item active1">{t('hyperlink.title')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('hyperlink.highlight')}</span>
                        <span className="highlighted-text"> {t('hyperlink.highlight-text')}</span>
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