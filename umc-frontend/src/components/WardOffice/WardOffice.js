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
    
    useEffect(() => {
        fetchHeaderImage();
    }, []);
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

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Ward Office</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Ward</span>
                        <span className="highlighted-text"> Office</span>
                        <hr />
                    </h2>

                    <div className="row border content-row">
                        <div className="col-md-2 sidebar d-flex flex-column justify-content-center align-items-center">
                            {/* List of all wards */}
                            {wardData.map((ward) => (
                                <button
                                    key={ward.id}  // Assuming the API returns `id` for each ward
                                    className={`btn ${selectedWard && selectedWard.id === ward.id ? "active" : ""}`}
                                    onClick={() => handleWardClick(ward)}
                                >
                                    {ward.ward_name}
                                </button>
                            ))}
                        </div>

                        <div className="col-md-10">
                            {selectedWard && (
                                <div className="row">
                                    <div className="col-md-7 ward-card">
                                        <h5 className="ward-title">
                                            {selectedWard.ward_name.replace(/(\w+)\s(\d+)/, "$1 Office $2")}
                                        </h5>

                                        <p className="ward-text">
                                            <strong>Ward Officer Name:</strong> {selectedWard.officer_name}
                                        </p>
                                        <p className="ward-text">
                                            <strong>Ward Officer Address:</strong> {selectedWard.address}
                                        </p>
                                        <p className="ward-text">
                                            <strong>Email Id:</strong> {selectedWard.email || '-'}
                                        </p>
                                        <p className="ward-text">
                                            <strong>Mobile Number:</strong> {selectedWard.mobile}
                                        </p>
                                        <p className="ward-text">
                                            <strong>Landline Number:</strong> {selectedWard.landline || '-'}
                                        </p>

                                        <table className="table table-bordered table-responsive mt-4">
                                            <thead className="theadcolor">
                                                <tr>
                                                    <th width='30%' className="table-heading-styling" style={{ textAlign: 'center' }}>Ward No.</th>
                                                    <th width='70%' className="table-heading-styling px-5">Area in Ward</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Check if 'areas' is an array before mapping */}

                                                <tr>
                                                    <td style={{ textAlign: 'center', height: '100px' }}>{selectedWard.ward_no}</td>
                                                    <td className="areapadding">{selectedWard.areas}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-5 map-container">
                                        <h5 className="ward-location-title">Location</h5>
                                        <div className="map-wrapper">
                                            {/* Example map, replace with dynamic URL if necessary */}
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
