import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pdficon from '../../assets/images/Departments/document 1.png';
import exticon from '../../assets/images/extIcon.png'
import "../TableCss/TableCss.css";
import Swal from "sweetalert2";
import api, { baseURL } from "../api"
import { useTranslation } from "react-i18next";

const ProactiveDisclosure = () => {
    const [rti, setRti] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Proactive Disclosure");

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
            const response = await api.get(`/proactive-disclosure?lang=${i18n.language}`);
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
                const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
                return dateB - dateA;
            });
            setRti(sortedData);
        } catch (error) {
            console.error("Error fetching proactive disclosure data", error);
        }
    };

    useEffect(() => {
        fetchHeaderImage();
        fetchRti();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

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
                            {t('departments.home')}
                        </Link>
                        <Link to="/rti" className="breadcrumb-item text-decoration-none">
                            {t('proactive.rti')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('proactive.title')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('proactive.highlight')}</span>
                        <span className="highlighted-text"> {t('proactive.highlight-text')}</span>
                        <hr />
                    </h2>
                    <div className="row mt-4">
                        <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                {t('departments.sno')}
                                            </th>
                                            <th className="table-heading-styling">
                                                {t('tourism.description')}
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                {t('departments.action')}
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
                                                    {(() => {
                                                        const language = i18n.language;

                                                        const toMarathiNumbers = (num) => {
                                                            const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
                                                            return num
                                                                .toString()
                                                                .split("")
                                                                .map((digit) => marathiDigits[parseInt(digit, 10)])
                                                                .join("");
                                                        };

                                                        const number = index + 1;
                                                        return language === "mr" ? toMarathiNumbers(number) : number;
                                                    })()}
                                                </td>
                                                <td
                                                    width="70%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textWrap: "pretty"
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
                                                        target={item.link.startsWith("/") ? "_self" : "_blank"}
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
                                                                {t('departments.view')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {t('rts.openLink')}
                                                                <img
                                                                    src={exticon}
                                                                    alt="External Link Icon"
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

export default ProactiveDisclosure;