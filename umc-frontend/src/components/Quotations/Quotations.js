import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../CommingSoon/CommingSoon.css";
import "./Quotations.css"
import comingsoon from '../../assets/newcomingsoon.png'

const Quotations = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            <div className="quotations-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-2 mb-5" id="deputy-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Quotations</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Quotations</span>
                        <span className="highlighted-text"> of UMC</span>
                        <hr />
                    </h2>

                    <div className="coming-soon-section text-center mt-4">
                        <img
                            src={comingsoon}
                            alt="Coming Soon"
                            className="coming-soon-gif"
                        />
                        <p className="coming-soon-message">
                            This page is under development and will be available soon.
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Quotations;
