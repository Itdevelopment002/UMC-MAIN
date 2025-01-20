import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./HyperlinkPolicy.css";

const HyperlinkPolicy = () => {
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
                                <p>
                                    "We do not object to you linking directly to the information
                                    that is hosted on our site and no prior permission is required
                                    for the same. However, we would like you to inform us about any
                                    links provided to our site so that you can be informed of any
                                    changes or updation therein. Also, we do not permit our pages to
                                    be loaded into frames on your site. Our Department's pages MUST
                                    load into a newly opened browser window of the user".
                                </p>
                                <p>
                                    "Prior permission is required before hyperlinks are directed
                                    from any website to this site. Permission for the same, stating
                                    the nature of the content on the pages from where the link has
                                    to be given and the exact language of the Hyperlink should be
                                    obtained by sending a request at Email address of the
                                    Department".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HyperlinkPolicy;