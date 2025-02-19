import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './ScreenReader.css';
import "../TableCss/TableCss.css";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";


const ScreenReader = () => {
    const [reader, setReader] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();


    const fetchReader = async () => {
        try {
            const response = await api.get(`/screen-reader?lang=${i18n.language}`);
            setReader(response.data);
        } catch (error) {
            console.error("Error fetching reader data");
        }
    };


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

    useEffect(() => {
        fetchReader();
        fetchHeaderImage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [i18n.language]);

    return (
        <>
            <div className="history-header-image" style={{ backgroundImage: `url(${bgImage})` }}></div>
            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="reader-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t('corporation.home')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('reader.title')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('reader.highlight')}</span>
                        <span className="highlighted-text"> {t('reader.highlight-text')}</span>
                        <hr />
                    </h2>
                    <div className="row mt-4">
                        <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                            <div className="system-style-div text-start">
                                <p className="mb-0">
                                    <span className="span-system1">{t('reader.text')}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling text-center" >
                                                {t('departments.sno')}
                                            </th>
                                            <th className="table-heading-styling">
                                                {t('reader.name')}
                                            </th>
                                            <th className="table-heading-styling">
                                                {t('reader.website')}
                                            </th>
                                            <th className="table-heading-styling text-center" >
                                                {t('reader.commercial')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reader.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="font-large"
                                                    width="8%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
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
                                                    width="35%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                    }}
                                                >
                                                    {item.name}
                                                </td>
                                                <td
                                                    width="35%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                    }}
                                                >
                                                    <Link to={item.website} className="text-decoration-none custom-list-effect" target="_blank">
                                                        {item.website}
                                                    </Link>
                                                </td>
                                                <td
                                                    width="15%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {item.available}
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

export default ScreenReader;