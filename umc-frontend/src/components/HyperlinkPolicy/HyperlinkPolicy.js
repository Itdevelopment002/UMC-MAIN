import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HyperlinkPolicy.css";
import api from "../api";

const HyperlinkPolicy = () => {
    const [policy, setPolicy] = useState([]);

    useEffect(() => {
        fetchPolicy();
    }, []);

    const fetchPolicy = async () => {
        try {
            const response = await api.get("/hyperlink-policy");
            setPolicy(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>

            <div className="history-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="hyperlink-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Hyperlink Policy</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Hyperlink</span>
                        <span className="highlighted-text"> Policy</span>
                        <hr />
                    </h2>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div>
                                {policy.map((policy) => (
                                    <React.Fragment key={policy.id}>
                                        <p>{policy.description}</p>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HyperlinkPolicy;