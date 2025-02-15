import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ContactUs.css";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const ContactUs = () => {
    const [contact, setContact] = useState([]);
    const [ward, setWard] = useState([]);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();

     useEffect(() => {
            fetchHeaderImage();
        }, []);
    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Contact-us");

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
    const fetchContact = async () => {
        try {
            const response = await api.get(`/contact-info?lang=${i18n.language}`);
            setContact(response.data);
        } catch (error) {
            console.error("Error fethcing contact data", error);
        }
    };

    const fetchWard = async () => {
        try {
            const response = await api.get(`/ward-info?lang=${i18n.language}`);
            setWard(response.data);
        } catch (error) {
            console.error("Error fethcing ward data", error);
        }
    };


    useEffect(() => {
        fetchContact();
        fetchWard();
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                <div className="container-fluid font-location mt-4 mb-2" id="contact-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t("breadcrumbHome")}
                        </Link>
                        <span className="breadcrumb-item active1">{t("contactUs.breadcrumb")}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t("contactUs.contact")}</span>
                        <span className="highlighted-text"> {t("contactUs.us")}</span>
                        <hr />
                    </h2>
                    <div className="row mt-5 gap-3">
                        <div className="col-xl-5 col-lg-5 col-md-6 col-12 col-sm-12 left_section">
                            {contact.map((item, index) => (
                                <div className="d-flex items-content" key={index}>
                                    <div className="icon-container">
                                        <img
                                            src={`${baseURL}/${item.image_path}`}
                                            alt={item.heading}
                                            className="icon-image img-fluid"
                                        />
                                    </div>
                                    <div className="ms-3">
                                        <h5>{item.heading}</h5>
                                        <p>
                                            {index === contact.length - 1 ? (
                                                <Link
                                                    to="https://drive.google.com/file/d/13EhELXyYBaX6-2Jxj4FLWFmCY6iLyIps/view?usp=drive_link"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none"
                                                >
                                                    {item.description}
                                                </Link>
                                            ) : (
                                                item.description
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}

                        </div>

                        <span className="divider"></span>

                        <div className="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-12">
                            <div className="row">
                                {ward.map((ward) => (
                                    <div className="col-md-6 mb-3" key={ward}>
                                        <div className="card">
                                            <span className="card-header text-white bg-gradient">
                                                {t("contactUs.wardOfficeNo")} {ward.office}
                                            </span>
                                            <div className="card-body position-relative">
                                                <span className="left-border"></span>
                                                <p>
                                                    <strong>{t("contactUs.address")}:</strong>{" "}
                                                    {ward.address}
                                                </p>
                                                <p>
                                                    <strong>{t("contactUs.phoneNo")}:</strong>{" "}
                                                    {ward.phone}
                                                </p>
                                                <p>
                                                    <strong>{t("contactUs.emailId")}:</strong> {ward.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
