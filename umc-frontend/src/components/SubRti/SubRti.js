import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pdficon from '../../assets/images/Departments/document 1.png';
import exticon from '../../assets/images/extIcon.png'
import "../TableCss/TableCss.css";
import Swal from "sweetalert2";
import api, { baseURL } from "../api"

const SubRti = () => {
    const [rti, setRti] = useState([]);
    const [bgImage, setBgImage] = useState("");

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "SUB RTI");

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
    const fetchRti = async () => {
        try {
            const response = await api.get("/rti-info");
            setRti(response.data);
        } catch (error) {
            console.error("Error fetching rti data", error);
        }
    };

    useEffect(() => {
        fetchHeaderImage();
        fetchRti();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleClick = (link, e) => {
        if (link === "#") {
            e.preventDefault();
            Swal.fire({
                title: 'Information',
                text: 'The PDF will be available soon.',
                icon: 'info',
                confirmButtonText: 'Ok'
            });
        }
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
                <div className="container-fluid font-location mt-4 mb-2" id="rti-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="rti" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="rti" className="breadcrumb-item text-decoration-none">
                            Proactive Disclosure
                        </Link>
                        <span className="breadcrumb-item active1">SUB RTI</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">SUB</span>
                        <span className="highlighted-text"> RTI</span>
                        <hr />
                    </h2>
                    <div className="row mt-4">
                        <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">
                                                Description
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rti.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="font-large"
                                                    width="10%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {index + 1}
                                                </td>
                                                <td
                                                    width="70%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                    }}
                                                >
                                                    {item.description}
                                                </td>
                                                <td
                                                    width="20%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <Link
                                                        to={item.link}
                                                        className="text-decoration-none"
                                                        target="_blank"
                                                        style={{ color: "#292D32" }}
                                                        onClick={(e) => handleClick(item.link, e)}
                                                    >
                                                        {item.link.endsWith("drive_link") || item.link.endsWith("#") ? (
                                                            <>
                                                                <img
                                                                    src={pdficon}
                                                                    alt="PDF Icon"
                                                                    style={{
                                                                        width: "18px",
                                                                        height: "18px",
                                                                        marginRight: "8px",
                                                                        verticalAlign: "middle",
                                                                    }}
                                                                />
                                                                View PDF
                                                            </>
                                                        ) : (
                                                            <>
                                                                Open Link
                                                                <img
                                                                    src={exticon}
                                                                    alt="PDF Icon"
                                                                    style={{
                                                                        width: "18px",
                                                                        height: "18px",
                                                                        marginLeft: "8px",
                                                                        verticalAlign: "middle",
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubRti;