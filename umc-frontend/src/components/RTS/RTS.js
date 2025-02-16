import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './RTS.css';
import pdficon from '../../assets/images/Departments/document 1.png'
import exticon from '../../assets/images/extIcon.png'
import api, { baseURL } from "../api"
import { useTranslation } from "react-i18next";

const RTS = () => {
    const [bgImage, setBgImage] = useState("");
    const [rts, setRts] = useState([]);
    const { i18n, t } = useTranslation();

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Right to Service");

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

    const fetchRts = async () => {
        try {
            const response = await api.get(`/rts?lang=${i18n.language}`);
            setRts(response.data);
        } catch (error) {
            console.error("Error fetching rts data", error);
        }
    };

    useEffect(() => {
        fetchRts();
        fetchHeaderImage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [i18n.language]);

    return (
        <>
            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,

                }}
            ></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-2 mb-5" id='rts-css'>
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                        {t("breadcrumbHome")}
                        </Link>
                        <span className="breadcrumb-item active1">{t("rts.breadcrumb")}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t("rts.rightToService")} </span>
                        <span className="highlighted-text">{t("rts.act")}</span>
                    </h2>
                    <hr />
                    <p>{t("rts.content")}:- <Link to='https://aaplesarkar.mahaonline.gov.in/' target="_blank" style={{ color: '#4674D9' }}>https://aaplesarkar.mahaonline.gov.in</Link>
                    </p>
                    <div className="row">
                        <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className='circular-wrapper'>
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                            {t("rts.srNo")}
                                            </th>
                                            <th className="table-heading-styling">
                                            {t("rts.breadcrumb")}
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                            {t("rts.action")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rts.map((item, index) => (
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
                                                    {item.heading}
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
                                                    >
                                                        {item.link.endsWith("drive_link") ? (
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
                                                                {t("rts.viewPDF")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {t("rts.openLink")}
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

export default RTS