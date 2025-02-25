import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import "./WardOffice.css";
import { useTranslation } from "react-i18next";

const WardOffice = () => {
    const [wardData, setWardData] = useState([]);
    const [selectedWard, setSelectedWard] = useState(null);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Ward-office");

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
        api.get(`/ward-offices?lang=${i18n.language}`)
            .then((response) => {
                setWardData(response.data);
                if (response.data.length > 0) {
                    setSelectedWard(response.data[0]);
                }
            })
            .catch((error) => {
                console.error("Error fetching ward data:", error);
            });
        fetchHeaderImage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [i18n.language]);

    const handleWardClick = (ward) => {
        setSelectedWard(ward);
    };

    return (
        <>

            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,

                }}
            ></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="ward-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t('corporation.home')}
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            {t('corporation.corporation')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('ward.heading')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('ward.highlight')}</span>
                        <span className="highlighted-text"> {t('ward.highlight-text')}</span>
                        <hr />
                    </h2>

                    <div className="row border content-row">
                        <div className="col-md-2 sidebar d-flex flex-column justify-content-center align-items-center">
                            {wardData.map((ward) => (
                                <button
                                    key={ward.id}
                                    className={`btn ${selectedWard && selectedWard.id === ward.id ? "active" : ""}`}
                                    onClick={() => handleWardClick(ward)}
                                >
                                    {ward.ward_no}
                                </button>
                            ))}
                        </div>

                        <div className="col-md-10">
                            {selectedWard && (
                                <div className="row">
                                    <div className="col-md-7 ward-card">
                                        <h5 className="ward-title">
                                            {selectedWard.ward_name}
                                        </h5>
                                        <p className="ward-text">
                                            <strong>{t('corporation.wardname')}:</strong> {selectedWard.officer_name}
                                        </p>
                                        <p className="ward-text">
                                            <strong>{t('corporation.wardaddress')}:</strong> {selectedWard.address}
                                        </p>
                                        <p className="ward-text">
                                            <strong>{t('corporation.wardId')}:</strong> {selectedWard.email || '-'}
                                        </p>
                                        <p className="ward-text">
                                            <strong>{t('corporation.wardphNo')}:</strong> {selectedWard.mobile}
                                        </p>
                                        <p className="ward-text">
                                            <strong>{t('corporation.landline')}:</strong> {selectedWard.landline || '-'}
                                        </p>

                                        <table className="table table-bordered table-responsive mt-4">
                                            <thead className="theadcolor">
                                                <tr>
                                                    <th width='30%' className="table-heading-styling" style={{ textAlign: 'center' }}>{t('corporation.wardNo')}</th>
                                                    <th width='70%' className="table-heading-styling px-5">{t('corporation.wardarea')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: 'center', height: '100px' }}>{selectedWard.ward_no}</td>
                                                    <td className="areapadding">{selectedWard.areas}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-5 map-container">
                                        <h5 className="ward-location-title">{t('location.location-title')}</h5>
                                        <div className="map-wrapper">
                                            <iframe
                                                src={selectedWard.map_url}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0, borderRadius: "4px" }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                title="Ulhasnagar Location Map"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WardOffice;
