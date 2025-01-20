import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./ContactUs.css";
import img1 from "../../assets/images/Contact/location.png";
import img2 from "../../assets/images/Contact/envelope.png";
import img3 from "../../assets/images/Contact/call.png";
import img4 from "../../assets/images/Contact/download.png";

const ContactUs = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="contact-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Contact Us</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Contact</span>
                        <span className="highlighted-text"> Us</span>
                        <hr />
                    </h2>
                    <div className="row mt-5 gap-3">
                        <div className="col-xl-5 col-lg-5 col-md-6 col-12 col-sm-12 left_section">
                            <div className="d-flex items-content">
                                <div className="icon-container">
                                    <img src={img1} alt="Location" className="icon-image img-fluid" />
                                </div>
                                <div className="ms-3">
                                    <h5>Head Office</h5>
                                    <p>
                                        Ulhasnagar Municipal Corporation, Near Chopda Court, Ulhasnagar.
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex items-content">
                                <div className="icon-container">
                                    <img src={img3} alt="Phone" className="icon-image img-fluid" />
                                </div>
                                <div className="ms-3">
                                    <h5>Phone Number</h5>
                                    <p>+91 251 2720116-25</p>
                                </div>
                            </div>
                            <div className="d-flex items-content">
                                <div className="icon-container">
                                    <img src={img2} alt="Email" className="icon-image img-fluid" />
                                </div>
                                <div className="ms-3">
                                    <h5>Email</h5>
                                    <p>
                                        commissioner@umc.gov.in / commissionerulhasnagar@gmail.com
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex items-content">
                                <div className="icon-container">
                                    <img src={img4} alt="Download" className="icon-image img-fluid" />
                                </div>
                                <div className="ms-3">
                                    <h5>Download Official Contacts</h5>
                                    <p>
                                        Official Contacts
                                    </p>
                                </div>
                            </div>
                        </div>

                        <span className="divider"></span>

                        <div className="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-12">
                            <div className="row">
                                {[1, 2, 3, 4].map((ward) => (
                                    <div className="col-md-6 mb-3" key={ward}>
                                        <div className="card">
                                            <span className="card-header text-white bg-gradient">
                                                Ward Office No. {ward}
                                            </span>
                                            <div className="card-body position-relative">
                                                <span className="left-border"></span>
                                                <p>
                                                    <strong>Address:</strong>{" "}
                                                    {ward === 1
                                                        ? "Golmaidan, Ulhasnagar - 421001"
                                                        : ward === 2
                                                            ? "Yatri Niwas, Ulhasnagar - 421002"
                                                            : ward === 3
                                                                ? "VTC Ground, Ulhasnagar - 421003"
                                                                : "Netaji Chowk, Ulhasnagar - 421005"}
                                                </p>
                                                <p>
                                                    <strong>Phone No.:</strong>{" "}
                                                    {ward === 1
                                                        ? "0251 2720192"
                                                        : ward === 2
                                                            ? "0251 2721008"
                                                            : ward === 3
                                                                ? "0251 2720193"
                                                                : "0251 2721027"}
                                                </p>
                                                <p>
                                                    <strong>Email Id:</strong> umc.ward{ward}@gmail.com
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
