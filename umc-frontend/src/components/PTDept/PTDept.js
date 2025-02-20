import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pdficon from '../../assets/images/Departments/document 1.png';
import './PTDept.css';
import "../TableCss/TableCss.css";
import Swal from "sweetalert2";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";


const PTDept = () => {
    const [tax, setTax] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();


    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Property-Tax-Dept");

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
    const fetchTax = async () => {
        try {
            const response = await api.get(`/property-dept?lang=${i18n.language}`);
            setTax(response.data.reverse());
        } catch (error) {
            console.error("Error fetching property tax data", error);
        }
    };

    useEffect(() => {
        fetchHeaderImage();
        fetchTax();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <div className="container-fluid font-location mt-4 mb-2" id="pt-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t("breadcrumbHome")}
                        </Link>
                        <span className="breadcrumb-item active1">{t("propertyTaxDept.propertyTaxDepartment")}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t("propertyTaxDept.property")}</span>
                        <span className="highlighted-text"> {t("propertyTaxDept.taxDepartment")}</span>
                        <hr />
                    </h2>
                    <div className="row mt-4">
                        <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                            <div className="system-style-div text-start">
                                <p className="mb-0">
                                    <span className="span-system1">List of property tax areas of more than one lakh</span>
                                </p>
                            </div>
                        </div>
                    </div>
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
                                        {tax.map((item, index) => (
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
                                                        target={item.link === "#" ? "" : "_blank"}
                                                        style={{ color: "#333333" }}
                                                        onClick={(e) => handleClick(item.link, e)}
                                                    >
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

export default PTDept;