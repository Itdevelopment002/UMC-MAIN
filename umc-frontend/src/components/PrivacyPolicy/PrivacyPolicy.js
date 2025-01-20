import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="privacy-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Privacy Policy</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Privacy</span>
                        <span className="highlighted-text"> Policy</span>
                        <hr />
                    </h2>

                    <div className="row">
                        <div className="col-12">
                            <div className="mb-4">
                                <h5 className="privacy-h5-style">Disclaimer</h5>
                                <p className="privacy-p-style">
                                    Although information and contents of various departmental websites
                                    on this portal have been provided with care and diligence,
                                    Government of Maharashtra does not take responsibility on how
                                    this information is used or the consequences of its use. In case
                                    of any inconsistency/confusion, the user should contact the
                                    concerned Department/Officer of the Government of Maharashtra for
                                    further clarifications.
                                </p>
                            </div>
                            <div>
                                <h5 className="privacy-h5-style">Copyright Policy</h5>
                                <p className="privacy-p-style">
                                    Material featured on this portal may be reproduced free of charge
                                    in any format or media without requiring specific permission. This
                                    is subject to the material being reproduced accurately and not
                                    being used in a derogatory manner or in a misleading context.
                                    Where the material is being published or issued to others, the
                                    source must be prominently acknowledged. However, the permission
                                    to reproduce this material does not extend to any material on this
                                    site which is identified as being the copyright of the third
                                    party.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrivacyPolicy;