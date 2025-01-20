import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./WardOffice.css";

const WardOffice = () => {
    const [selectedWard, setSelectedWard] = useState("Ward 'A'");

    const wardData = {
        "Ward 'A'": {
            name: "Shree. Ganesh Shimpi",
            address: "Bhagvati navani stage, Ulhasnagar-1",
            email: "-",
            mobile: "9323028206",
            landline: "-",
            areas: ["Ulhasnagar-1"],
        },
        "Ward 'B'": {
            name: "Shree. Tushar Sonavne",
            address: "Near Sapna Garden Ulhasnagar-2",
            email: "-",
            mobile: "9860364676",
            landline: "-",
            areas: ["Ulhasnagar-2"],
        },
        "Ward 'C'": {
            name: "Shree. Ajit Gowari",
            address: "School No. 14 Ulhasnagar-4",
            email: "-",
            mobile: "9323130104",
            landline: "-",
            areas: ["Ulhasnagar-4"],
        },
        "Ward 'D'": {
            name: "Shree. Mahendra Punjabi",
            address: "Math Temple, Near Fish Market, School No.19, Ulhasnagar-5",
            email: "-",
            mobile: "8855013000",
            landline: "-",
            areas: ["Ulhasnagar-5"],
        },
    };

    const handleWardClick = (ward) => {
        setSelectedWard(ward);
    };

    const currentWard = wardData[selectedWard];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>

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
                            {Object.keys(wardData).map((ward) => (
                                <button
                                    key={ward}
                                    className={`btn ${selectedWard === ward ? "active" : ""}`}
                                    onClick={() => handleWardClick(ward)}
                                >
                                    {ward}
                                </button>
                            ))}
                        </div>

                        <div className="col-md-10">

                            <div className="row">
                                <div className="col-md-7 ward-card">
                                    <h5 className="ward-title">{selectedWard} Office</h5>
                                    <p className="ward-text">
                                        <strong>Ward Officer Name:</strong> {currentWard.name}
                                    </p>
                                    <p className="ward-text">
                                        <strong>Ward Officer Address:</strong> {currentWard.address}
                                    </p>
                                    <p className="ward-text">
                                        <strong>Email Id:</strong> {currentWard.email}
                                    </p>
                                    <p className="ward-text">
                                        <strong>Mobile Number:</strong> {currentWard.mobile}
                                    </p>
                                    <p className="ward-text">
                                        <strong>Landline Number:</strong> {currentWard.landline}
                                    </p>

                                    <table className="table table-bordered table-responsive mt-4">
                                        <thead className="theadcolor">
                                            <tr>
                                                <th width='30%' className="table-heading-styling" style={{ textAlign: 'center' }}>Ward No.</th>
                                                <th width='70%' className="table-heading-styling px-5">Area in Ward</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentWard.areas.map((area, index) => (
                                                <tr key={index}>
                                                    <td style={{ textAlign: 'center', height: '100px' }}>{selectedWard}</td>
                                                    <td className="areapadding">{area}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-5 map-container">
                                    <h5 className="ward-location-title">Location</h5>
                                    <div className="map-wrapper">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.5755642497846!2d73.0952821149035!3d19.216419887005727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be79585bd166cb7%3A0x42b34fd7eaa1a58c!2sUlhasnagar!5e0!3m2!1sen!2sin!4v1687438589000!5m2!1sen!2sin"
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
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default WardOffice;